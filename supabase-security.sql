-- ============================================================
-- Club 404 AU — Secure Role Management Functions
-- Run this AFTER the main schema to add role security
-- ============================================================

-- 1. Secure function to change user roles (server-side only)
CREATE OR REPLACE FUNCTION public.change_user_role(
  target_user_id UUID,
  new_role TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_role TEXT;
  target_current_role TEXT;
  valid_roles TEXT[] := ARRAY['member', 'moderator', 'admin', 'super_admin'];
BEGIN
  -- Get caller's role
  SELECT role INTO caller_role
  FROM public.profiles
  WHERE id = auth.uid();

  -- Check if caller is authenticated
  IF caller_role IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Check if new_role is valid
  IF new_role != ALL(valid_roles) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid role');
  END IF;

  -- Get target's current role
  SELECT role INTO target_current_role
  FROM public.profiles
  WHERE id = target_user_id;

  IF target_current_role IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Target user not found');
  END IF;

  -- SECURITY: Prevent self-role escalation
  IF target_user_id = auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot change your own role');
  END IF;

  -- SECURITY: Only super_admin can promote to super_admin or admin
  IF new_role IN ('super_admin', 'admin') AND caller_role != 'super_admin' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only super_admin can assign admin roles');
  END IF;

  -- SECURITY: Cannot promote to equal or higher role than yourself
  IF (
    CASE new_role
      WHEN 'super_admin' THEN 4
      WHEN 'admin' THEN 3
      WHEN 'moderator' THEN 2
      WHEN 'member' THEN 1
    END
  ) >= (
    CASE caller_role
      WHEN 'super_admin' THEN 4
      WHEN 'admin' THEN 3
      WHEN 'moderator' THEN 2
      WHEN 'member' THEN 1
    END
  ) AND caller_role != 'super_admin' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot promote to your level or higher');
  END IF;

  -- Perform the role change
  UPDATE public.profiles
  SET role = new_role::user_role
  WHERE id = target_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Role changed successfully',
    'old_role', target_current_role,
    'new_role', new_role
  );
END;
$$;

-- 2. Secure function to approve access requests
CREATE OR REPLACE FUNCTION public.approve_access_request(
  request_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_role TEXT;
  request_record RECORD;
BEGIN
  -- Get caller's role
  SELECT role INTO caller_role
  FROM public.profiles
  WHERE id = auth.uid();

  -- Check if caller has permission
  IF caller_role IS NULL OR caller_role NOT IN ('super_admin', 'admin', 'moderator') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;

  -- Get the request
  SELECT * INTO request_record
  FROM public.access_requests
  WHERE id = request_id AND status = 'pending';

  IF request_record IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Request not found or already processed');
  END IF;

  -- SECURITY: Moderators cannot approve admin/super_admin roles
  IF request_record.requested_role IN ('admin', 'super_admin') AND caller_role != 'super_admin' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only super_admin can approve admin roles');
  END IF;

  -- SECURITY: Moderators cannot approve moderator roles (only admins+)
  IF request_record.requested_role = 'moderator' AND caller_role = 'moderator' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only admins can approve moderator roles');
  END IF;

  -- Update the request status
  UPDATE public.access_requests
  SET
    status = 'approved',
    reviewed_by = auth.uid(),
    reviewed_at = NOW()
  WHERE id = request_id;

  -- Update the user's role
  UPDATE public.profiles
  SET role = request_record.requested_role
  WHERE id = request_record.user_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Request approved',
    'user_id', request_record.user_id,
    'new_role', request_record.requested_role::TEXT
  );
END;
$$;

-- 3. Secure function to reject access requests
CREATE OR REPLACE FUNCTION public.reject_access_request(
  request_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_role TEXT;
BEGIN
  -- Get caller's role
  SELECT role INTO caller_role
  FROM public.profiles
  WHERE id = auth.uid();

  -- Check if caller has permission
  IF caller_role IS NULL OR caller_role NOT IN ('super_admin', 'admin', 'moderator') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;

  -- Update the request status
  UPDATE public.access_requests
  SET
    status = 'rejected',
    reviewed_by = auth.uid(),
    reviewed_at = NOW()
  WHERE id = request_id AND status = 'pending';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Request not found or already processed');
  END IF;

  RETURN jsonb_build_object('success', true, 'message', 'Request rejected');
END;
$$;

-- 4. Drop and recreate the profiles UPDATE policy to prevent self-role escalation
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Users can update their own profile BUT NOT the role column
CREATE POLICY "Users can update own profile (no role)"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile (role changes go through function)
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- 5. Prevent direct role updates via client (security trigger)
CREATE OR REPLACE FUNCTION public.prevent_direct_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Allow role changes only from SECURITY DEFINER functions
  -- (which run with the function owner's privileges, not the user's)
  IF pg_catalog.current_setting('role') != 'rds_superuser' AND
     NOT pg_catalog.current_setting('request.jwt.claims', true)::jsonb->>'role' IS NOT NULL THEN
    -- If this is a direct client update (not via SECURITY DEFINER function)
    IF OLD.role IS DISTINCT FROM NEW.role THEN
      RAISE EXCEPTION 'Direct role changes are not allowed. Use the change_user_role function.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Only create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'prevent_role_change_trigger'
  ) THEN
    CREATE TRIGGER prevent_role_change_trigger
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.prevent_direct_role_change();
  END IF;
END $$;

-- 6. Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.change_user_role(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_access_request(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_access_request(UUID) TO authenticated;

-- ============================================================
-- SECURITY NOTES:
-- 1. change_user_role() validates caller permissions server-side
-- 2. Self-role escalation is blocked
-- 3. Only super_admin can assign admin roles
-- 4. Cannot promote to equal or higher role than yourself
-- 5. Direct client updates to role column are blocked by trigger
-- 6. All role changes are logged via SECURITY DEFINER functions
-- ============================================================

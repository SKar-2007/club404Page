import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HashLink } from 'react-router-hash-link';
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { LINKS } from "@/lib/config";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import UserAvatar from "./UserAvatar";
import { Menu, X, Shield } from "lucide-react";

export default function Header () {

  const { isAuthenticated, profile, isRoleOrAbove } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const navLinks = [
    { to: "#about", label: "About" },
    { to: "#services", label: "Services" },
    { to: "#events", label: "Events" },
    { to: "#playground", label: "Playground" },
    { to: "#halloffame", label: "Hall of Fame" },
    { to: "#contact", label: "Contact" },
  ];

  return (
     <motion.header 
      className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b-4 border-primary"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
          <HashLink smooth to="#hero" className="flex items-center space-x-3">
             <motion.img 
              src="https://res.cloudinary.com/dxkje9whm/image/upload/v1758892567/Club-404-logo_gfnhkb.jpg" 
              alt="Club 404 AU Logo" 
              className="w-10 h-10 rounded-lg border-2 border-primary"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
             <motion.span 
              className="font-display font-bold text-xl text-primary"
              whileHover={{ scale: 1.05 }}
            >Club 404 AU</motion.span>
          </HashLink>
          </motion.div>
          
           <motion.nav 
            className="hidden md:flex items-center space-x-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {navLinks.map((link) => (
              <HashLink key={link.to} smooth to={link.to} className="font-mono font-bold uppercase tracking-wider hover:text-primary transition-colors">
                <motion.span 
                  className="font-mono font-bold uppercase tracking-wider hover:text-primary transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {link.label}
                </motion.span>
              </HashLink>
            ))}
            {isAuthenticated && isRoleOrAbove("moderator") && (
              <HashLink smooth to="#admin" className="font-mono font-bold uppercase tracking-wider hover:text-primary transition-colors">
                <motion.span 
                  className="font-mono font-bold uppercase tracking-wider text-electric hover:text-primary transition-colors flex items-center gap-1"
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Shield className="w-3 h-3" />
                  Admin
                </motion.span>
              </HashLink>
            )}
          </motion.nav>
          
            <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-3"
          >
            {isAuthenticated && profile ? (
              <div className="hidden md:flex items-center gap-3">
                <UserAvatar
                  avatarUrl={profile.avatar_url}
                  name={profile.full_name}
                  role={profile.role}
                  size="sm"
                />
                <LogoutButton />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <div className="relative">
                  <Button
                    className="btn-brutal"
                    onClick={() => setAuthOpen(!authOpen)}
                  >
                    Login
                  </Button>
                  <AnimatePresence>
                    {authOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-72 card-brutal p-4 z-50"
                      >
                        <div className="terminal-block mb-3 text-left">
                          <div className="text-neon-green text-xs">
                            ~/club404-au/auth$ login
                          </div>
                        </div>
                        <LoginButton />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
            <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="hidden md:block">
              <Button className="btn-brutal">
                Join Now
              </Button>
            </a>
            
            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </motion.div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 border-t-2 border-foreground/20 pt-4"
            >
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <HashLink
                    key={link.to}
                    smooth
                    to={link.to}
                    className="font-mono font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </HashLink>
                ))}
                {isAuthenticated && isRoleOrAbove("moderator") && (
                  <HashLink
                    smooth
                    to="#admin"
                    className="font-mono font-bold uppercase tracking-wider text-electric hover:text-primary transition-colors flex items-center gap-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Shield className="w-3 h-3" />
                    Admin
                  </HashLink>
                )}
                <div className="border-t border-foreground/20 pt-3 mt-3">
                  {isAuthenticated && profile ? (
                    <div className="flex flex-col space-y-3">
                      <UserAvatar
                        avatarUrl={profile.avatar_url}
                        name={profile.full_name}
                        role={profile.role}
                        size="sm"
                      />
                      <LogoutButton />
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <LoginButton />
                    </div>
                  )}
                </div>
                <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                  <Button className="btn-brutal w-full">
                    Join Now
                  </Button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

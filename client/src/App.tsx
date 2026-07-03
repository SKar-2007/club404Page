import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/use-auth";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PlaygroundPage from "./pages/PlaygroundPage";
import AuthCallback from "./pages/AuthCallback";
import WelcomeScreen from "./components/WelcomeScreen";
const queryClient = new QueryClient();

const App = () => {

  const [showWelcome, setShowWelcome] = useState(true);

   const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  return(
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
      <AnimatePresence mode="wait">
        {showWelcome ? (
           <WelcomeScreen key="welcome" onComplete={handleWelcomeComplete} />
           ) : (
      <BrowserRouter key="app">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
           )}
      </AnimatePresence>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
  )
};

export default App;

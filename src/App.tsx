import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PitchProvider } from "./context/PitchContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import CreatePitch from "./pages/dashboard/CreatePitch";
import PitchLibrary from "./pages/dashboard/PitchLibrary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PitchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<CreatePitch />} />
              <Route path="create" element={<CreatePitch />} />
              <Route path="library" element={<PitchLibrary />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PitchProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HelmetProvider } from "react-helmet-async";
import AppLayout from "@/components/AppLayout";
import Index from "./pages/Index";
import BlogPage from "./pages/BlogPage";
import NotFound from "./pages/NotFound";
import CertificationsPage from "./pages/certs/Index";
import AboutPage from "./pages/about/Index";
import SkillsPage from "./pages/skills/Index";
import WorkPage from "./pages/work/Index";
import ProjectsPage from "./pages/projects/Index";
import ContactPage from "./pages/contact/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/work" element={<WorkPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/certs" element={<CertificationsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blog" element={<BlogPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

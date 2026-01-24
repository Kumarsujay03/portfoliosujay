import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HelmetProvider } from "react-helmet-async";
import AppLayout from "@/components/AppLayout";
import { Analytics } from "@vercel/analytics/react";

const Index = lazy(() => import("./pages/Index"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CertificationsPage = lazy(() => import("./pages/certs/Index"));
const AboutPage = lazy(() => import("./pages/about/Index"));
const SkillsPage = lazy(() => import("./pages/skills/Index"));
const WorkPage = lazy(() => import("./pages/work/Index"));
const ProjectsPage = lazy(() => import("./pages/projects/Index"));
const ContactPage = lazy(() => import("./pages/contact/Index"));
const BlogPostPage = lazy(() => import("./pages/blog/Post"));

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
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

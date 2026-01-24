import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Seo title="Projects" description="Featured projects and other builds — screenshots, tech stack, and links." />
      <main className="pt-20">
        <Projects hideLabel={true} />
      </main>
      <Footer showSocialLinks />
      <ScrollToTop />
    </div>
  );
};

export default ProjectsPage;

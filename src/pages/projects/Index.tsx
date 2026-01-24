import Header from "@/components/Header";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Header />
      <main className="pt-20">
        <Projects hideLabel={true} />
      </main>
      <Footer showSocialLinks />
      <ScrollToTop />
    </div>
  );
};

export default ProjectsPage;

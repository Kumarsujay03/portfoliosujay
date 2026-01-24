import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Seo
        title="Home"
        description="Sujay Kumar — software engineer portfolio. Projects, experience, certifications, and contact."
      />
      <main>
        <Hero />
        <About />
        <Skills backgroundVariant="none" />
        <Certifications backgroundVariant="none" />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;

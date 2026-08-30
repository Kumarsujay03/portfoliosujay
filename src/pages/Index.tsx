import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HomeBackground from "@/components/HomeBackground";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth relative overflow-hidden">
      <HomeBackground />
      <div className="relative z-10">
        <Seo
          title="Home"
          description="Sujay Kumar — machine learning researcher and engineer. Projects, experience, certifications, and contact."
        />
        <main>
          <Hero />
          <About animateOnView showPortrait={false} maxParagraphs={2} />
          <Skills backgroundVariant="none" animateOnView />
          <Experience limit={4} showViewAll animateOnView />
          <Certifications backgroundVariant="none" animateOnView />
          <Projects animateOnView />
          <Contact animateOnView />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </div>
  );
};

export default Index;

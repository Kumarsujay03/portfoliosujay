import Header from "@/components/Header";
import Skills from "@/components/Skills";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const SkillsPage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Header />
      <main className="pt-16">
        <Skills hideLabel={true} />
      </main>
      <Footer showSocialLinks />
      <ScrollToTop />
    </div>
  );
};

export default SkillsPage;

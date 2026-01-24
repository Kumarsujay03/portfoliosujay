import Skills from "@/components/Skills";
import FooterBridge from "@/components/FooterBridge";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";

const SkillsPage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Seo title="Skills" description="Skills and tech stack — frontend, backend, and tools I use." />
      <main className="pt-16">
        <Skills hideLabel={true} backgroundVariant="none" />
      </main>
      <FooterBridge />
      <Footer showSocialLinks />
      <ScrollToTop />
    </div>
  );
};

export default SkillsPage;

import About from "@/components/About";
import FooterBridge from "@/components/FooterBridge";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Seo title="About" description="About Sujay Kumar — background, interests, and what I build." />
      <main className="pt-20">
        <About hideLabel={true} />
      </main>
      <FooterBridge />
      <Footer showSocialLinks />
      <ScrollToTop />
    </div>
  );
};

export default AboutPage;
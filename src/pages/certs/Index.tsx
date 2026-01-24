import Certifications from "@/components/Certifications";
import FooterBridge from "@/components/FooterBridge";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";

const CertificationsPage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Seo title="Certifications" description="Certifications and programs — verified learning and achievements." />
      <main className="pt-16">
        <Certifications forceShowAll backgroundVariant="none" />
      </main>
      <FooterBridge />
      <Footer showSocialLinks />
      <ScrollToTop />
    </div>
  );
};

export default CertificationsPage;

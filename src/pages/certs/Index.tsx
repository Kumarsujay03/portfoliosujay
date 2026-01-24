import Header from "@/components/Header";
import Certifications from "@/components/Certifications";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const CertificationsPage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Header />
      <main className="pt-16">
        <Certifications forceShowAll />
      </main>
      <Footer showSocialLinks />
      <ScrollToTop />
    </div>
  );
};

export default CertificationsPage;

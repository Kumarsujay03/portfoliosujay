import Header from "@/components/Header";
import About from "@/components/About";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Header />
      <main className="pt-20">
        <About hideLabel={true} />
      </main>
      <Footer showSocialLinks />
      <ScrollToTop />
    </div>
  );
};

export default AboutPage;
import Header from "@/components/Header";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Header />
      <main className="pt-20">
        <Contact hideLabel={true} />
      </main>
      <Footer/>
      <ScrollToTop />
    </div>
  );
};

export default ContactPage;

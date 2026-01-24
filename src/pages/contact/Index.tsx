import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Seo title="Contact" description="Get in touch with Sujay Kumar — email and social links." />
      <main className="pt-20">
        <Contact hideLabel={true} />
      </main>
      <Footer/>
      <ScrollToTop />
    </div>
  );
};

export default ContactPage;

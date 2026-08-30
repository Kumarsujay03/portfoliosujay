import Contact from "@/components/Contact";
import PageBackground from "@/components/PageBackground";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth relative overflow-hidden">
      <PageBackground variant="contact" />
      <Seo title="Contact" description="Get in touch with Sujay Kumar — email and social links." />
      <main className="min-h-[70vh] pt-20">
        <Contact hideLabel={true} />
      </main>
      <Footer/>
      <ScrollToTop />
    </div>
  );
};

export default ContactPage;

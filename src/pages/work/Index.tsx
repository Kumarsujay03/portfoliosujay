import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";

const WorkPage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Seo title="Work" description="Work and volunteer experience — roles, responsibilities, and impact." />
      <main className="pt-20">
        <Experience hideLabel={true} />
      </main>
      <Footer showSocialLinks />
      <ScrollToTop />
    </div>
  );
};

export default WorkPage;

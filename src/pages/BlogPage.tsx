import Blog from "@/components/Blog";
import FooterBridge from "@/components/FooterBridge";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth relative overflow-hidden">
      <PageBackground variant="blog" />
      <Seo title="Blog" description="Blog posts and notes — learnings, projects, and experiments." />
      <main className="pt-16 cv-auto">
        <Blog backgroundVariant="none" />
      </main>
      <FooterBridge />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default BlogPage;

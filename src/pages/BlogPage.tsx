import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Seo from "@/components/Seo";

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Seo title="Blog" description="Blog posts and notes — learnings, projects, and experiments." />
      <main className="pt-16">
        <Blog />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default BlogPage;

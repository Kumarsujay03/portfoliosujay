import Header from "@/components/Header";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Header />
      <main className="pt-20">
        <Blog />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default BlogPage;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchStoreBlogs, type BlogPost } from "../../lib/api";
import { toastError } from "../../lib/toast";
import { BlogPostCard } from "../../components/store/BlogPostCard";
import { NewsHeroSection } from "./News/features";

export default function Blogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchStoreBlogs();
        setPosts(data);
      } catch {
        toastError("Could not load news.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NewsHeroSection />

      <div className="bg-[#f8f9fb] py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF7A00] hover:underline mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-[20px] bg-slate-200/80" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-slate-600 py-12">
              No articles yet. Check back soon, or ensure the API is connected and blogs are seeded.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((item) => (
                <BlogPostCard key={item.id} post={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

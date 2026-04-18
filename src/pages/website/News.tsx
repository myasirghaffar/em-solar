import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import { fetchStoreBlogs, type BlogPost } from "../../lib/api";
import { toastError } from "../../lib/toast";
import { NewsHeroSection } from "./News/features";

export default function News() {
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
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="group relative block overflow-hidden rounded-[20px] border border-gray-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div
                    className="h-52 bg-cover bg-center transition duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="p-5">
                    <h2 className="text-lg font-bold leading-snug text-gray-900 group-hover:text-[#FF7A00]">
                      {item.title}
                    </h2>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#FF7A00]">
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                        {item.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <Tag className="h-4 w-4 shrink-0" aria-hidden />
                        {item.tag}
                      </span>
                    </div>
                    {item.excerpt ? (
                      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{item.excerpt}</p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

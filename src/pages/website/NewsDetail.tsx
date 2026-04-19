import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import { fetchStoreBlog, type BlogPost } from "../../lib/api";
import { toastError } from "../../lib/toast";

export default function NewsDetail() {
  const { id: idParam } = useParams();
  const id = Number(idParam);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(id) || id < 1) {
      setPost(null);
      setLoading(false);
      return;
    }
    void (async () => {
      try {
        const p = await fetchStoreBlog(id);
        setPost(p);
      } catch {
        toastError("Could not load this article.");
        setPost(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="min-h-[60vh] bg-[#f8f9fb] py-12 md:py-16">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF7A00] hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          All news
        </Link>
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-2/3 rounded bg-slate-200" />
            <div className="h-56 rounded-2xl bg-slate-200" />
            <div className="h-24 rounded bg-slate-200" />
          </div>
        ) : !post ? (
          <p className="text-slate-600">This article could not be found.</p>
        ) : (
          <article>
            <h1 className="text-3xl font-bold text-[#0B2A4A] md:text-4xl">{post.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#FF7A00]">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Calendar className="h-4 w-4" aria-hidden />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Tag className="h-4 w-4" aria-hidden />
                {post.tag}
              </span>
            </div>
            <div
              className="mt-8 aspect-[21/9] w-full rounded-2xl bg-cover bg-center shadow-lg"
              style={{ backgroundImage: `url(${post.image})` }}
            />
            {post.excerpt ? (
              <p className="mt-8 text-lg text-slate-700 leading-relaxed">{post.excerpt}</p>
            ) : null}
            {post.body?.trim() ? (
              <div
                className="prose prose-slate mt-6 max-w-none text-slate-700 leading-relaxed [&_a]:text-[#FF7A00] [&_a:hover]:underline"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
            ) : null}
          </article>
        )}
      </div>
    </div>
  );
}

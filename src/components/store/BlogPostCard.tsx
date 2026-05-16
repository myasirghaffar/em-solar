import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import type { BlogPost } from "../../lib/api";

type BlogPostCardProps = {
  post: Pick<BlogPost, "id" | "title" | "date" | "image">;
  className?: string;
};

export function BlogPostCard({ post, className = "" }: BlogPostCardProps) {
  const href = post.id > 0 ? `/news/${post.id}` : "/news";

  return (
    <Link
      to={href}
      className={`group block overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(15,23,42,0.1)] ${className}`}
    >
      <div className="aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={post.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-5 sm:p-6">
        <p className="inline-flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
          <span>{post.date}</span>
        </p>
        <h3 className="mt-3 text-left text-base font-bold leading-snug text-[#0B2A4A] sm:text-lg line-clamp-3">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

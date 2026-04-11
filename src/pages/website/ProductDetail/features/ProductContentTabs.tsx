import { useId, useState } from "react";
import { Download, FileText, Star } from "lucide-react";
import { SpecificationsTable } from "./SpecificationsTable";

type TabId = "description" | "specifications" | "reviews" | "attachments";

export type ProductAttachment = { title: string; href: string };

type Review = {
  id: string;
  author: string;
  rating: number;
  body: string;
  date: string;
};

const tabs: { id: TabId; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "specifications", label: "Specifications" },
  { id: "reviews", label: "Reviews" },
  { id: "attachments", label: "Attachments" },
];

function StarRow({ value, onChange, name }: { value: number; onChange: (n: number) => void; name: string }) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <label key={n} className="cursor-pointer p-0.5">
          <input type="radio" name={name} value={n} className="sr-only" checked={value === n} onChange={() => onChange(n)} />
          <Star
            className={`h-6 w-6 ${n <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            aria-hidden
          />
        </label>
      ))}
    </div>
  );
}

export function ProductContentTabs({ product }: { product: any }) {
  const [active, setActive] = useState<TabId>("description");
  const baseId = useId();
  const panelId = (t: TabId) => `${baseId}-${t}-panel`;
  const tabId = (t: TabId) => `${baseId}-${t}-tab`;

  const longText: string | undefined = product.longDescription;
  const attachments: ProductAttachment[] = Array.isArray(product.attachments) ? product.attachments : [];
  const specs = (product.specifications || {}) as Record<string, unknown>;

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "seed-1",
      author: "Verified buyer",
      rating: 5,
      body: "Great quality and fast delivery. Team answered sizing questions quickly.",
      date: "2026-03-12",
    },
  ]);
  const [formAuthor, setFormAuthor] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formBody, setFormBody] = useState("");
  const [formThanks, setFormThanks] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthor.trim() || !formBody.trim()) return;
    setReviews((prev) => [
      {
        id: `r-${Date.now()}`,
        author: formAuthor.trim(),
        rating: formRating,
        body: formBody.trim(),
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setFormAuthor("");
    setFormBody("");
    setFormRating(5);
    setFormThanks(true);
    window.setTimeout(() => setFormThanks(false), 4000);
  };

  return (
    <div className="mt-12 sm:mt-14">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex flex-wrap gap-x-6 gap-y-1 border-b border-gray-200/80 sm:gap-x-10"
      >
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            id={tabId(id)}
            type="button"
            role="tab"
            aria-selected={active === id}
            aria-controls={panelId(id)}
            tabIndex={active === id ? 0 : -1}
            onClick={() => setActive(id)}
            className={[
              "-mb-px min-h-[44px] border-b-2 pb-3 text-sm font-semibold transition-colors sm:text-base",
              active === id
                ? "border-[#FF7A00] text-[#0B2A4A]"
                : "border-transparent text-gray-500 hover:text-[#0B2A4A]",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="pt-8 sm:pt-10">
        {active === "description" && (
          <div
            id={panelId("description")}
            role="tabpanel"
            aria-labelledby={tabId("description")}
            className="max-w-3xl"
          >
            <p className="text-base leading-relaxed text-gray-700">{product.description}</p>
            {longText ? <p className="mt-5 text-base leading-relaxed text-gray-600">{longText}</p> : null}
          </div>
        )}

        {active === "specifications" && (
          <div
            id={panelId("specifications")}
            role="tabpanel"
            aria-labelledby={tabId("specifications")}
            className="max-w-2xl"
          >
            <SpecificationsTable specs={specs} variant="tab" />
          </div>
        )}

        {active === "reviews" && (
          <div id={panelId("reviews")} role="tabpanel" aria-labelledby={tabId("reviews")} className="space-y-10">
            <div>
              <h3 className="mb-4 text-base font-semibold text-[#0B2A4A]">Write a review</h3>
              <form onSubmit={handleReviewSubmit} className="max-w-xl space-y-5 rounded-2xl bg-gray-50/70 p-6 sm:p-7">
                <div>
                  <label htmlFor={`${baseId}-author`} className="mb-1.5 block text-sm text-gray-600">
                    Your name
                  </label>
                  <input
                    id={`${baseId}-author`}
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full rounded-xl border-0 bg-white px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-gray-200/80 outline-none transition-shadow focus:ring-2 focus:ring-[#FF7A00]/35"
                    placeholder="e.g. Ali Khan"
                    required
                  />
                </div>
                <div>
                  <span className="mb-1.5 block text-sm text-gray-600">Rating</span>
                  <StarRow value={formRating} onChange={setFormRating} name={`${baseId}-rating`} />
                </div>
                <div>
                  <label htmlFor={`${baseId}-body`} className="mb-1.5 block text-sm text-gray-600">
                    Your review
                  </label>
                  <textarea
                    id={`${baseId}-body`}
                    value={formBody}
                    onChange={(e) => setFormBody(e.target.value)}
                    rows={4}
                    className="w-full resize-y rounded-xl border-0 bg-white px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-gray-200/80 outline-none transition-shadow focus:ring-2 focus:ring-[#FF7A00]/35"
                    placeholder="Share your experience with this product…"
                    required
                  />
                </div>
                {formThanks && (
                  <p className="text-sm font-medium text-green-700" role="status">
                    Thanks — your review was added below.
                  </p>
                )}
                <button
                  type="submit"
                  className="rounded-full bg-[#0B2A4A] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B2A4A]/90"
                >
                  Submit review
                </button>
              </form>
            </div>

            <div>
              <h3 className="mb-4 text-base font-semibold text-[#0B2A4A]">Customer reviews</h3>
              {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet. Be the first to share your experience.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {reviews.map((r) => (
                    <li key={r.id} className="py-5 first:pt-0">
                      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-medium text-[#0B2A4A]">{r.author}</span>
                        <span className="text-xs text-gray-400">{r.date}</span>
                        <span className="flex">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              className={`h-4 w-4 ${n <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                            />
                          ))}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">{r.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {active === "attachments" && (
          <div id={panelId("attachments")} role="tabpanel" aria-labelledby={tabId("attachments")}>
            {attachments.length === 0 ? (
              <p className="text-gray-600">No attachments are available for this product yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {attachments.map((file) => (
                  <li key={file.title}>
                    <a
                      href={file.href}
                      target={file.href.startsWith("data:") ? undefined : "_blank"}
                      rel={file.href.startsWith("data:") ? undefined : "noopener noreferrer"}
                      download={
                        file.href.startsWith("data:")
                          ? `${file.title.replace(/[^\w\s-]+/g, "").trim().slice(0, 80) || "attachment"}.download`
                          : undefined
                      }
                      className="group flex items-center gap-4 py-4 text-[#0B2A4A] first:pt-0 transition-colors hover:text-[#FF7A00]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[#FF7A00] transition-colors group-hover:bg-[#FF7A00]/10">
                        {!file.href || file.href === "#" ? (
                          <FileText className="h-5 w-5" aria-hidden />
                        ) : (
                          <Download className="h-5 w-5" aria-hidden />
                        )}
                      </span>
                      <span className="font-medium">{file.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useRef, useEffect, useCallback, type MouseEvent } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Diamond,
  Tag,
} from "lucide-react";
import { LATEST_NEWS } from "../../../../data/latestNews";

/** Card width + gap — ~3 cards visible on large screens */
const SLIDE_WIDTH = 380;
const SLIDE_GAP = 24;
const SLIDE_STEP = SLIDE_WIDTH + SLIDE_GAP;
const LOOP_JUMP_THRESHOLD = 120;
const CARD_HEIGHT = 440;

export function LatestNewsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const jumpLockRef = useRef(false);
  const autoPlayPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);

  const items = LATEST_NEWS;
  const logicalItems =
    items.length > 0 && items.length < 4 ? [...items, ...items] : items;
  const count = logicalItems.length;
  const setWidth = count > 0 ? count * SLIDE_STEP - SLIDE_GAP : 0;

  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || count < 2 || jumpLockRef.current || setWidth <= 0) return;

    const { scrollLeft } = el;

    const rightEdge = scrollLeft + el.clientWidth;

    if (rightEdge >= 2 * setWidth - LOOP_JUMP_THRESHOLD) {
      jumpLockRef.current = true;
      el.scrollLeft = scrollLeft - setWidth;
      requestAnimationFrame(() => {
        jumpLockRef.current = false;
      });
    } else if (scrollLeft <= LOOP_JUMP_THRESHOLD) {
      jumpLockRef.current = true;
      el.scrollLeft = scrollLeft + setWidth;
      requestAnimationFrame(() => {
        jumpLockRef.current = false;
      });
    }
  }, [count, setWidth]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || count < 2) return;
    requestAnimationFrame(() => {
      el.scrollLeft = setWidth;
    });
  }, [count, setWidth]);

  useEffect(() => {
    if (count < 2) return;
    const timer = window.setInterval(() => {
      if (autoPlayPausedRef.current) return;
      trackRef.current?.scrollBy({ left: SLIDE_STEP, behavior: "smooth" });
    }, 2600);
    return () => window.clearInterval(timer);
  }, [count]);

  const scrollPrev = () => {
    trackRef.current?.scrollBy({ left: -SLIDE_STEP, behavior: "smooth" });
  };

  const scrollNext = () => {
    trackRef.current?.scrollBy({ left: SLIDE_STEP, behavior: "smooth" });
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    autoPlayPausedRef.current = true;
    dragStartXRef.current = e.pageX;
    dragStartScrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || !isDraggingRef.current) return;
    const delta = e.pageX - dragStartXRef.current;
    el.scrollLeft = dragStartScrollLeftRef.current - delta;
  };

  const endMouseDrag = () => {
    isDraggingRef.current = false;
    autoPlayPausedRef.current = false;
  };

  const loopSlides =
    count > 1
      ? [...logicalItems, ...logicalItems, ...logicalItems]
      : logicalItems;

  return (
    <section
      className="scroll-reveal bg-[#f8f9fb] py-16 md:py-24 text-[#0f172a]"
      aria-labelledby="latest-news-heading"
    >
      <div className="relative max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="pb-8 text-center md:pb-10">
          <div className="mb-3 inline-flex items-center gap-2 text-[#FF7A00]">
            <Diamond
              className="h-3 w-3 shrink-0 fill-[#FF7A00] text-[#FF7A00]"
              strokeWidth={2}
              aria-hidden
            />
            <span className="text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
              Media and News
            </span>
          </div>
          <h2
            id="latest-news-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-[clamp(2rem,3vw,2.75rem)]"
          >
            Our Latest News
          </h2>
        </div>
      </div>

      <div className="mx-auto max-w-[1460px] overflow-hidden px-4 sm:px-6 lg:px-8">
        {count === 0 ? (
          <p className="text-gray-500 px-4 py-8">No news to show.</p>
        ) : (
          <div
            ref={trackRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Latest news"
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endMouseDrag}
            onMouseEnter={() => {
              if (!isDraggingRef.current) autoPlayPausedRef.current = true;
            }}
            onMouseLeave={() => {
              endMouseDrag();
              if (!isDraggingRef.current) autoPlayPausedRef.current = false;
            }}
            onTouchStart={() => {
              autoPlayPausedRef.current = true;
            }}
            onTouchEnd={() => {
              autoPlayPausedRef.current = false;
            }}
            className="latest-news-carousel flex cursor-grab overflow-x-auto overflow-y-hidden scroll-smooth active:cursor-grabbing"
          >
            {loopSlides.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="swiper-slide flex-shrink-0 mr-6 last:mr-0"
                style={{ width: SLIDE_WIDTH }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${item.title}`}
              >
                <article
                  className="group relative overflow-hidden rounded-[20px] border border-gray-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition-transform duration-300 ease-out will-change-transform hover:z-10 hover:scale-[1.02]"
                  style={{ height: CARD_HEIGHT }}
                >
                  <div
                    className="absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

                  <div className="absolute inset-x-3 bottom-3 z-10 md:inset-x-4 md:bottom-4">
                    <div className="rounded-2xl bg-white px-4 py-4 shadow-lg md:px-5 md:py-4">
                      <h3 className="text-left text-base font-bold leading-snug text-gray-900 md:text-lg">
                        {item.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#FF7A00]">
                          <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                          {item.date}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#FF7A00]">
                          <Tag className="h-4 w-4 shrink-0" aria-hidden />
                          {item.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </div>

      {count > 1 && (
        <div
          className="mx-auto mt-8 flex max-w-[1460px] items-center justify-center gap-3 px-4 sm:px-6 lg:px-8"
          role="group"
          aria-label="News carousel controls"
        >
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous news"
            className="flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]/40"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next news"
            className="flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]/40"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.2} />
          </button>
        </div>
      )}
    </section>
  );
}

import {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useCallback,
  type TransitionEvent,
} from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    title: "Best quality and delivered on time",
    name: "Ahmed Khan",
    location: "Lahore",
    role: "Homeowner",
    text: "Excellent quality solar panels. The team was very helpful in choosing the right system for my home.",
    rating: 5,
  },
  {
    title: "Best prices in Pakistan",
    name: "Sara Ali",
    location: "Karachi",
    role: "Business Owner",
    text: "Got my complete solar system installed within a week. Highly professional and great value.",
    rating: 5,
  },
  {
    title: "Professional service, genuine products",
    name: "Muhammad Hassan",
    location: "Islamabad",
    role: "Residential Client",
    text: "Professional service and genuine products. Highly recommended for solar solutions.",
    rating: 5,
  },
  {
    title: "Smooth installation and great support",
    name: "Ayesha Tariq",
    location: "Faisalabad",
    role: "Homeowner",
    text: "The installation team was punctual and explained everything clearly. Performance has been excellent.",
    rating: 5,
  },
  {
    title: "Excellent ROI for our office",
    name: "Bilal Raza",
    location: "Rawalpindi",
    role: "Business Owner",
    text: "We reduced our monthly electricity expense significantly. Product quality and after-sales service are solid.",
    rating: 5,
  },
  {
    title: "Trusted partner for long-term solar needs",
    name: "Fatima Noor",
    location: "Multan",
    role: "Commercial Client",
    text: "From consultation to final commissioning, everything was handled professionally. Highly recommended team.",
    rating: 5,
  },
];

function buildLoopPages(paired: boolean) {
  const pages = paired
    ? testimonials.map((_, i) => [
        testimonials[i],
        testimonials[(i + 1) % testimonials.length],
      ])
    : testimonials.map((t) => [t]);
  return [pages[pages.length - 1], ...pages, pages[0]];
}

const MD_QUERY = "(min-width: 768px)";
const TRANSITION_MS = 500;

/** Jump without animating (infinite-loop reset). Double rAF avoids re-enabling transition before paint. */
function jumpToSlide(
  setWithTransition: (v: boolean) => void,
  setSlideIndex: (v: number) => void,
  index: number,
) {
  setWithTransition(false);
  requestAnimationFrame(() => {
    setSlideIndex(index);
    requestAnimationFrame(() => setWithTransition(true));
  });
}

export function TestimonialsSection() {
  const [isMdUp, setIsMdUp] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MD_QUERY).matches : true,
  );

  useLayoutEffect(() => {
    const mq = window.matchMedia(MD_QUERY);
    const onChange = () => setIsMdUp(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const loopPages = useMemo(() => buildLoopPages(isMdUp), [isMdUp]);
  const pageCount = testimonials.length;
  const lastRealIndex = loopPages.length - 2;
  const cloneEndIndex = loopPages.length - 1;

  const [slideIndex, setSlideIndex] = useState(1);
  const [withTransition, setWithTransition] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const slideIndexRef = useRef(slideIndex);
  slideIndexRef.current = slideIndex;

  useEffect(() => {
    isAnimatingRef.current = false;
    jumpToSlide(setWithTransition, setSlideIndex, 1);
  }, [isMdUp]);

  const goToNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setWithTransition(true);
    setSlideIndex((p) => p + 1);
  }, []);

  const goToPrev = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setWithTransition(true);
    setSlideIndex((p) => p - 1);
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (isAnimatingRef.current || index === slideIndexRef.current) return;
    isAnimatingRef.current = true;
    setWithTransition(true);
    setSlideIndex(index);
  }, []);

  useEffect(() => {
    const t = setInterval(goToNext, 5000);
    return () => clearInterval(t);
  }, [goToNext]);

  const resetLoopIfNeeded = useCallback(
    (index: number) => {
      if (index === cloneEndIndex) {
        jumpToSlide(setWithTransition, setSlideIndex, 1);
        return true;
      }
      if (index === 0) {
        jumpToSlide(setWithTransition, setSlideIndex, lastRealIndex);
        return true;
      }
      return false;
    },
    [cloneEndIndex, lastRealIndex],
  );

  const handleTrackTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== trackRef.current || e.propertyName !== "transform") return;
    isAnimatingRef.current = false;
    resetLoopIfNeeded(slideIndexRef.current);
  };

  /** Recover when transitionend never fires (reduced motion, background tab, rapid clicks). */
  useEffect(() => {
    const index = slideIndexRef.current;

    if (index < 0 || index >= loopPages.length) {
      isAnimatingRef.current = false;
      jumpToSlide(setWithTransition, setSlideIndex, 1);
      return;
    }

    if (index !== 0 && index !== cloneEndIndex) return;

    const t = window.setTimeout(() => {
      const current = slideIndexRef.current;
      if (current === 0 || current === cloneEndIndex) {
        isAnimatingRef.current = false;
        resetLoopIfNeeded(current);
      }
    }, TRANSITION_MS + 80);

    return () => window.clearTimeout(t);
  }, [slideIndex, loopPages.length, cloneEndIndex, resetLoopIfNeeded]);

  const activeDot = (slideIndex - 1 + pageCount) % pageCount;

  return (
    <section className="py-20 bg-[#0B2A4A] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF7A00] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FF7A00] rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 scroll-reveal" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            What Our Customers Say
          </h2>
          <div className="w-16 h-1 bg-[#FF7A00] mx-auto mb-4" />
          <p className="text-gray-300 max-w-2xl mx-auto">
            Real reviews from satisfied customers across Pakistan
          </p>
        </div>
        <div className="max-w-7xl mx-auto">
          <div
            className={`flex w-full items-center ${isMdUp ? "min-h-[460px]" : "min-h-[400px]"}`}
          >
            <div className="w-full overflow-hidden">
              <div
                ref={trackRef}
                className={`flex ${withTransition ? "transition-transform duration-500 ease-out" : ""}`}
                style={{ transform: `translateX(-${slideIndex * 100}%)` }}
                onTransitionEnd={handleTrackTransitionEnd}
              >
                {loopPages.map((pair, pageIndex) => (
                  <div
                    key={`${isMdUp ? "p" : "s"}-${pageIndex}`}
                    className={`grid min-w-full gap-6 px-4 ${isMdUp ? "grid-cols-2" : "grid-cols-1"}`}
                  >
                    {pair.map((item, idx) => (
                      <article
                        key={`${item.name}-${idx}-${pageIndex}`}
                        className="bg-white p-8 md:p-9 rounded-2xl shadow-xl border-t-4 border-[#FF7A00]"
                      >
                        <Quote className="w-10 h-10 text-[#FF7A00]/30 mb-4" />
                        <h3 className="text-lg font-semibold text-[#0B2A4A] mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          "{item.text}"
                        </p>
                        <div className="flex justify-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < item.rating ? "fill-[#FF7A00] text-[#FF7A00]" : "text-gray-200"}`}
                            />
                          ))}
                        </div>
                        <div className="text-center pt-4 border-t border-gray-100">
                          <p className="font-semibold text-[#0B2A4A]">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.role} · {item.location}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={goToPrev}
              className="p-2 rounded-full bg-white/10 hover:bg-[#FF7A00] text-white transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i + 1)}
                  className={`h-2 rounded-full transition-all ${i === activeDot ? "w-6 bg-[#FF7A00]" : "w-2 bg-white/40 hover:bg-white/60"}`}
                />
              ))}
            </div>
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-white/10 hover:bg-[#FF7A00] text-white transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
];

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = next (slide left), -1 = prev (slide right)

  const goToNext = () => {
    setDirection(1);
    setCurrentTestimonial((p) => (p + 1) % testimonials.length);
  };
  const goToPrev = () => {
    setDirection(-1);
    setCurrentTestimonial((p) => (p === 0 ? testimonials.length - 1 : p - 1));
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  useEffect(() => {
    const t = setInterval(goToNext, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-20 bg-[#0B2A4A] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF7A00] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FF7A00] rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            What Our Customers Say
          </h2>
          <div className="w-16 h-1 bg-[#FF7A00] mx-auto mb-4" />
          <p className="text-gray-300 max-w-2xl mx-auto">
            Real reviews from satisfied customers across Pakistan
          </p>
        </div>
        <div className="max-w-3xl mx-auto scroll-reveal">
          <div className="h-[420px] flex items-center w-full">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={currentTestimonial}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full bg-white p-8 md:p-10 rounded-2xl shadow-xl border-t-4 border-[#FF7A00]"
              >
                <Quote className="w-10 h-10 text-[#FF7A00]/30 mb-4" />
                <h3 className="text-lg font-semibold text-[#0B2A4A] mb-3">
                  {testimonials[currentTestimonial].title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonials[currentTestimonial].rating ? "fill-[#FF7A00] text-[#FF7A00]" : "text-gray-200"}`}
                    />
                  ))}
                </div>
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="font-semibold text-[#0B2A4A]">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonials[currentTestimonial].role} ·{" "}
                    {testimonials[currentTestimonial].location}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
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
                  onClick={() => {
                    setDirection(i > currentTestimonial ? 1 : -1);
                    setCurrentTestimonial(i);
                  }}
                  className={`h-2 rounded-full transition-all ${i === currentTestimonial ? "w-6 bg-[#FF7A00]" : "w-2 bg-white/40 hover:bg-white/60"}`}
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

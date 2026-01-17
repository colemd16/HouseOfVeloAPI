import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { testimonials, Testimonial } from '../../../data/testimonials';

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  autoPlay?: boolean;
  interval?: number;
}

export function TestimonialsSection({
  title = 'What Athletes Say',
  subtitle = 'Success Stories',
  autoPlay = true,
  interval = 5000,
}: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Auto-rotate testimonials
  useEffect(() => {
    if (!autoPlay || !inView) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, inView]);

  const goTo = (index: number) => setActiveIndex(index);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section ref={ref} className="py-24 bg-velo-black relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-velo-red/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="container-public px-4 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold font-medium uppercase tracking-wider mb-3">
            {subtitle}
          </p>
          <h2 className="heading-display text-white">{title}</h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          {/* Quote Icon */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <svg
              className="w-16 h-16 mx-auto text-gold/30"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </motion.div>

          {/* Testimonial Content */}
          <div className="relative min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8 italic">
                  "{testimonials[activeIndex].text}"
                </p>

                <div className="flex flex-col items-center gap-3">
                  <div>
                    <p className="text-white font-semibold">
                      {testimonials[activeIndex].author}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {testimonials[activeIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-10">
            {/* Previous Button */}
            <button
              onClick={goPrev}
              className="p-2 rounded-full border border-gray-700 text-gray-400 hover:border-gold hover:text-gold transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'bg-gold w-8'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={goNext}
              className="p-2 rounded-full border border-gray-700 text-gray-400 hover:border-gold hover:text-gold transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Compact testimonial card for grid layouts
interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-velo-dark rounded-xl p-6 border border-gray-800 hover:border-gold/30 transition-colors">
      <svg
        className="w-8 h-8 text-gold/30 mb-4"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>

      <p className="text-gray-300 mb-6 line-clamp-4">"{testimonial.text}"</p>

      <div className="flex items-center gap-3">
        <div>
          <p className="text-white font-medium text-sm">{testimonial.author}</p>
          <p className="text-gray-500 text-xs">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

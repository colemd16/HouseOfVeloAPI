import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  className?: string;
}

// Easing function for smooth counting
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function AnimatedCounter({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  label,
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const frameRef = useRef<number>();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    if (!inView || hasAnimated) return;

    setHasAnimated(true);
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const currentCount = Math.round(easedProgress * end);

      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [inView, end, duration, hasAnimated]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`text-center ${className}`}
    >
      <div className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gold mb-2">
        {prefix}{count}{suffix}
      </div>
      <div className="text-gray-400 text-sm md:text-base uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}

// Stats row component for displaying multiple counters
interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

interface StatsRowProps {
  stats: Stat[];
  className?: string;
}

export function StatsRow({ stats, className = '' }: StatsRowProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 ${className}`}>
      {stats.map((stat, index) => (
        <AnimatedCounter
          key={stat.label}
          end={stat.value}
          suffix={stat.suffix}
          prefix={stat.prefix}
          label={stat.label}
          duration={2000 + index * 200}
        />
      ))}
    </div>
  );
}

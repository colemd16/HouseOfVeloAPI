import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { homeStats } from '../../../data/stats';

interface StatsSectionProps {
  stats?: typeof homeStats;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function StatsSection({
  stats = homeStats,
  title,
  subtitle,
  className = '',
}: StatsSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className={`py-20 bg-velo-dark ${className}`}>
      <div className="container-public px-4">
        {/* Optional Header */}
        {(title || subtitle) && (
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {subtitle && (
              <p className="text-gold font-medium uppercase tracking-wider mb-3">
                {subtitle}
              </p>
            )}
            {title && <h2 className="heading-display text-white">{title}</h2>}
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AnimatedCounter
                end={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                label={stat.label}
                duration={2000}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Compact version for embedding in other sections
export function StatsStrip({ stats = homeStats }: { stats?: typeof homeStats }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div
      ref={ref}
      className="py-8 bg-gradient-to-r from-velo-black via-velo-dark to-velo-black border-y border-gray-800"
    >
      <div className="container-public px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center min-w-[120px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-display font-bold text-gold">
                {inView && (
                  <>
                    {stat.prefix}
                    {stat.value}
                    {stat.suffix}
                  </>
                )}
              </div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

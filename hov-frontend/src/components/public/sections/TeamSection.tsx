import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { TeamCard, TeamCardCompact } from '../ui/TeamCard';
import { teamMembers } from '../../../data/teamMembers';

interface TeamSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showCTA?: boolean;
  variant?: 'full' | 'preview';
  maxMembers?: number;
}

export function TeamSection({
  title = 'Meet Our Team',
  subtitle = 'Expert Coaching Staff',
  description = 'Our coaches bring decades of combined experience in professional and collegiate baseball, delivering world-class instruction to every athlete.',
  showCTA = true,
  variant = 'full',
  maxMembers,
}: TeamSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const displayMembers = maxMembers
    ? teamMembers.slice(0, maxMembers)
    : teamMembers;

  return (
    <section ref={ref} className="py-24 bg-velo-black">
      <div className="container-public px-4">
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
          <h2 className="heading-display text-white mb-4">{title}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{description}</p>
        </motion.div>

        {/* Team Grid */}
        {variant === 'full' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <TeamCard member={member} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {displayMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TeamCardCompact member={member} />
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        {showCTA && maxMembers && displayMembers.length < teamMembers.length && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark font-medium transition-colors"
            >
              Meet the Full Team
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Horizontal scrolling team strip for compact displays
export function TeamStrip() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div ref={ref} className="py-16 bg-velo-dark overflow-hidden">
      <div className="container-public px-4 mb-8">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-gold font-medium uppercase tracking-wider text-sm mb-1">
              Expert Coaches
            </p>
            <h3 className="text-2xl font-display font-bold text-white">
              Our Team
            </h3>
          </div>
          <Link
            to="/about"
            className="text-gray-400 hover:text-gold text-sm transition-colors"
          >
            View All
          </Link>
        </motion.div>
      </div>

      <div className="flex gap-6 px-4 overflow-x-auto pb-4 scrollbar-hide">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            className="flex-shrink-0 w-72"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <TeamCardCompact member={member} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

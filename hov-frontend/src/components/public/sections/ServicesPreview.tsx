import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { getServiceTagline } from '../../../data/services';

// Featured services to display on home page
const featuredServices = [
  {
    name: 'MV Hitting Evolution Program',
    description:
      'Our patented off-season training program designed to transform your swing mechanics, bat speed, and overall hitting performance.',
  },
  {
    name: 'MV Pitching Evolution Program',
    description:
      'Comprehensive pitching development focusing on velocity, command, movement, and arm health for lasting success.',
  },
  {
    name: '1 Hour Hitting Lesson',
    description:
      'Personalized one-on-one instruction to address your specific needs and take your hitting to the next level.',
  },
  {
    name: '1 Hour Pitching Lesson',
    description:
      'Expert pitching instruction combining video analysis, drill work, and live reps for maximum improvement.',
  },
];

interface ServicesPreviewProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showCTA?: boolean;
}

export function ServicesPreview({
  title = 'Training Programs',
  subtitle = 'Elevate Your Game',
  description = 'From personalized lessons to comprehensive development programs, we offer training solutions for athletes of all skill levels.',
  showCTA = true,
}: ServicesPreviewProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 bg-velo-dark">
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

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {featuredServices.map((service, index) => {
            const tagline = getServiceTagline(service.name);

            return (
              <motion.div
                key={service.name}
                className="group bg-velo-black rounded-xl border border-gray-800 p-6
                  hover:border-gold/50 hover:shadow-gold-glow transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Service Name */}
                <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-gold transition-colors">
                  {service.name}
                </h3>

                {/* Tagline */}
                {tagline && (
                  <p className="text-gold text-sm font-medium mb-3">
                    {tagline}
                  </p>
                )}

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* CTA */}
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-gold hover:text-gold-dark font-medium text-sm transition-colors"
                >
                  Learn More
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
            );
          })}
        </div>

        {/* CTA */}
        {showCTA && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gold text-velo-black font-semibold
                hover:bg-gold-dark transition-all duration-300 hover:shadow-gold-glow"
            >
              View All Programs
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

// Compact services list for sidebar or footer
export function ServicesQuickLinks() {
  const quickLinks = [
    { name: 'Hitting Lessons', href: '/services' },
    { name: 'Pitching Lessons', href: '/services' },
    { name: 'Evolution Programs', href: '/services' },
    { name: 'Strength Training', href: '/services' },
    { name: 'Team Training', href: '/services' },
  ];

  return (
    <div className="space-y-2">
      {quickLinks.map((link) => (
        <Link
          key={link.name}
          to={link.href}
          className="block text-gray-400 hover:text-gold transition-colors text-sm"
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}

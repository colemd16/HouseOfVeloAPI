import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

interface Organization {
  name: string;
  tagline: string;
  description: string;
  href: string;
  ctaText: string;
  logo: string;
  accentColor: 'gold' | 'red';
}

const organizations: Organization[] = [
  {
    name: 'Moore Velocity',
    tagline: 'Elite Training Programs',
    description:
      'World-class hitting and pitching instruction using cutting-edge technology and proven methodologies. Transform your game with personalized training from experienced coaches.',
    href: '/services',
    ctaText: 'View Programs',
    logo: '/images/mv.png',
    accentColor: 'gold',
  },
  {
    name: '518 Velocity',
    tagline: 'Premier Travel Baseball',
    description:
      'Competitive travel baseball organization featuring elite coaching, premier tournament play, and comprehensive player development for athletes ages 13U-18U.',
    href: '/518-velocity',
    ctaText: 'Learn More',
    logo: '/images/518.png',
    accentColor: 'red',
  },
];

export function OrganizationsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
            Our Organizations
          </p>
          <h2 className="heading-display text-white mb-4">
            Two Paths to Excellence
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Whether you're looking to sharpen your skills through elite training or
            compete at the highest levels of travel baseball, House of Velo has you
            covered.
          </p>
        </motion.div>

        {/* Organization Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {organizations.map((org, index) => (
            <OrganizationCard
              key={org.name}
              organization={org}
              index={index}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface OrganizationCardProps {
  organization: Organization;
  index: number;
  inView: boolean;
}

function OrganizationCard({ organization, index, inView }: OrganizationCardProps) {
  const accentClasses = {
    gold: {
      border: 'group-hover:border-gold/50',
      glow: 'group-hover:shadow-gold-glow',
      text: 'text-gold',
      button: 'bg-gold hover:bg-gold-dark text-velo-black',
    },
    red: {
      border: 'group-hover:border-velo-red/50',
      glow: 'group-hover:shadow-red-glow',
      text: 'text-velo-red',
      button: 'bg-velo-red hover:bg-velo-red-dark text-white',
    },
  };

  const accent = accentClasses[organization.accentColor];

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl bg-velo-dark border border-gray-800
        ${accent.border} ${accent.glow} transition-all duration-500`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      {/* Background Logo Watermark */}
      <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <img
          src={organization.logo}
          alt=""
          className="w-64 h-64 object-contain"
        />
      </div>

      {/* Content */}
      <div className="relative p-8 md:p-10">
        {/* Logo */}
        <div className="mb-6">
          <img
            src={organization.logo}
            alt={organization.name}
            className="h-16 w-auto"
          />
        </div>

        {/* Name */}
        <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
          {organization.name}
        </h3>

        {/* Tagline */}
        <p className={`font-medium uppercase tracking-wider text-sm mb-4 ${accent.text}`}>
          {organization.tagline}
        </p>

        {/* Description */}
        <p className="text-gray-400 leading-relaxed mb-8">
          {organization.description}
        </p>

        {/* CTA Button */}
        <Link
          to={organization.href}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
            transition-all duration-300 ${accent.button}`}
        >
          {organization.ctaText}
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
      </div>

      {/* Decorative Glow */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl
          ${organization.accentColor === 'gold' ? 'bg-gold' : 'bg-velo-red'}`}
      />
    </motion.div>
  );
}

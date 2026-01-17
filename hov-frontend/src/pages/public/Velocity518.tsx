import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PublicLayout } from '../../components/public/PublicLayout';
import { HeroSection } from '../../components/public/sections/HeroSection';
import { CTASection } from '../../components/public/sections/CTASection';
import { velocity518Benefits, ageGroups } from '../../data/services';

export function Velocity518() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <HeroSection
        title="518 VELOCITY"
        subtitle="Premier Travel Baseball"
        description="Building Champions On & Off The Field. The premier youth travel baseball program in Saratoga County."
        primaryCTA={{
          text: 'Register for Tryouts',
          href: 'https://forms.gle/your-google-form-link',
        }}
        secondaryCTA={{ text: 'Learn More', href: '#about' }}
        backgroundImage="/images/518-hero-bg.jpg"
        size="large"
        overlay="darker"
      />

      {/* About Section */}
      <AboutSection />

      {/* Tryout CTA */}
      <TryoutSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Age Divisions */}
      <AgeDivisionsSection />

      {/* Final CTA */}
      <CTASection
        title="Ready to Compete?"
        subtitle="Join 518 Velocity"
        description="Join the 518 Velocity family and experience what championship-caliber travel baseball is all about."
        primaryCTA={{
          text: 'Register for Tryouts',
          href: 'https://forms.gle/your-google-form-link',
        }}
        secondaryCTA={{ text: 'Contact Us', href: '/contact' }}
      />
    </PublicLayout>
  );
}

function AboutSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="about" ref={ref} className="py-24 bg-velo-dark">
      <div className="container-public px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <motion.img
            src="/images/518.png"
            alt="518 Velocity"
            className="w-32 h-32 mx-auto mb-8 drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          />

          <p className="text-gold font-medium uppercase tracking-wider mb-3">
            Welcome to
          </p>
          <h2 className="heading-display text-white mb-6">518 Velocity</h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            518 Velocity is the premier youth travel baseball program in the
            Saratoga County area. Since our inception in 2021, we have
            consistently elevated our standards both on and off the field. Our
            teams are recognized not only for their competitive excellence and
            championship performance, but also for developing exceptional young
            individuals who exemplify integrity, teamwork, and leadership in
            their communities.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function TryoutSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="py-20 bg-velo-black">
      <div className="container-public px-4">
        <motion.div
          className="max-w-4xl mx-auto bg-gradient-to-br from-velo-dark to-velo-black
            rounded-2xl p-10 border border-gray-800 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-velo-red/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <p className="text-gold font-medium uppercase tracking-wider mb-3">
              2026 Summer Season
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Tryouts Now Open
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Join one of the most competitive travel baseball programs in the
              Capital Region. We're looking for dedicated players who are
              committed to excellence on and off the field.
            </p>

            <a
              href="https://forms.gle/your-google-form-link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-velo-red text-white
                font-bold text-lg hover:bg-velo-red-dark transition-all duration-300 hover:shadow-red-glow"
            >
              Register for Tryouts
              <svg
                className="w-5 h-5"
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
            </a>

            <p className="text-gray-500 mt-6">
              Ages 13U - 18U | Multiple Age Divisions Available
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BenefitsSection() {
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
            Why Choose Us
          </p>
          <h2 className="heading-display text-white">
            What Makes 518 Velocity Different
          </h2>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {velocity518Benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="bg-velo-black rounded-xl border border-gray-800 p-6
                hover:border-gold/50 hover:shadow-gold-glow transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Icon Placeholder */}
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-display font-bold text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgeDivisionsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="py-20 bg-velo-black">
      <div className="container-public px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold font-medium uppercase tracking-wider mb-3">
            Teams
          </p>
          <h2 className="heading-display text-white">Age Divisions</h2>
        </motion.div>

        {/* Age Group Badges */}
        <div className="flex flex-wrap justify-center gap-4">
          {ageGroups.map((age, index) => (
            <motion.div
              key={age}
              className="bg-gradient-to-br from-gold to-gold-dark text-velo-black
                text-xl font-display font-bold px-8 py-4 rounded-full
                shadow-lg hover:shadow-gold-glow hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {age}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

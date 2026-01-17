import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PublicLayout } from '../../components/public/PublicLayout';
import { PageHeader } from '../../components/public/sections/HeroSection';
import { TeamSection } from '../../components/public/sections/TeamSection';
import { CTASection } from '../../components/public/sections/CTASection';
import { teamMembers } from '../../data/teamMembers';

export function About() {
  return (
    <PublicLayout>
      {/* Hero */}
      <PageHeader
        title="About House of Velo"
        subtitle="Building Better Athletes, Better People"
        backgroundImage="/images/facility-bg.jpg"
      />

      {/* Mission Section */}
      <MissionSection />

      {/* Organization Overview */}
      <OrganizationSection />

      {/* Full Team Section */}
      <TeamSection
        subtitle="Expert Coaching Staff"
        title="Meet the Velo Team"
        description="Our coaches bring decades of combined experience in professional and collegiate baseball, delivering world-class instruction to every athlete."
        variant="full"
        showCTA={false}
      />

      {/* Full Team Profiles */}
      <TeamProfilesSection />

      {/* CTA Section */}
      <CTASection
        title="Ready to Start Your Journey?"
        subtitle="Join the Velo Family"
        description="Experience elite training with world-class coaches who are committed to your development."
        primaryCTA={{ text: 'View Programs', href: '/services' }}
        secondaryCTA={{ text: 'Contact Us', href: '/contact' }}
      />
    </PublicLayout>
  );
}

function MissionSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="py-24 bg-velo-dark">
      <div className="container-public px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold font-medium uppercase tracking-wider mb-3">
            Our Mission
          </p>
          <h2 className="heading-display text-white mb-8">
            Make the athlete better.
            <br />
            <span className="text-gold">On & off the field.</span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Here at Moore Velocity Sports Performance, we strive not only to
            create a strong physical foundation for the athlete but to build a
            strong mental and independent mindset that will take their game to
            the next level. From our elite programs and skill training to our
            unparalleled combined knowledge of what it takes to be elite
            mentally, physically, and emotionally. We pass on all of these
            assets to our athletes and better not only their baseball careers
            but their lives as well.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function OrganizationSection() {
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
            Who We Are
          </p>
          <h2 className="heading-display text-white">
            Two Pillars of Excellence
          </h2>
        </motion.div>

        {/* House of Velo Overview */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-velo-dark rounded-2xl p-8 md:p-10 border border-gray-800 text-center">
            <img
              src="/images/houseofvelo.png"
              alt="House of Velo"
              className="w-24 h-24 object-contain mx-auto mb-6"
            />
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              House of Velo
            </h3>
            <p className="text-gray-300 leading-relaxed">
              House of Velo represents the premier convergence of two pillars in
              Saratoga County's youth sports community: Moore Velocity and 518
              Velocity. Since our founding in 2020, we have been dedicated to
              transforming lives through sport, fostering not only athletic
              excellence but also character development. Our comprehensive
              approach combines elite training methodologies with a commitment
              to teaching life lessons that extend far beyond the baseball
              diamond.
            </p>
          </div>
        </motion.div>

        {/* Organization Tree Visual */}
        <div className="max-w-5xl mx-auto">
          {/* Vertical Connector */}
          <motion.div
            className="w-1 h-16 bg-gradient-to-b from-gold to-gray-600 mx-auto"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
          />

          {/* Horizontal Connector */}
          <motion.div
            className="h-1 bg-gradient-to-r from-gold via-gray-600 to-gold mx-auto"
            style={{ width: '60%' }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.5 }}
          />

          {/* Two Organizations */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* Moore Velocity */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="w-1 h-12 bg-gradient-to-b from-gold to-transparent mx-auto hidden md:block" />
              <div className="bg-velo-dark rounded-xl p-6 border border-gray-800 hover:border-gold/50 transition-colors">
                <img
                  src="/images/mv.png"
                  alt="Moore Velocity"
                  className="w-20 h-20 object-contain mx-auto mb-4"
                />
                <h4 className="text-xl font-display font-bold text-white mb-3">
                  Moore Velocity
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Cutting-edge baseball training organization specializing in
                  comprehensive player development through evidence-based
                  techniques, state-of-the-art technology, and personalized
                  coaching.
                </p>
              </div>
            </motion.div>

            {/* 518 Velocity */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="w-1 h-12 bg-gradient-to-b from-gold to-transparent mx-auto hidden md:block" />
              <div className="bg-velo-dark rounded-xl p-6 border border-gray-800 hover:border-gold/50 transition-colors">
                <img
                  src="/images/518.png"
                  alt="518 Velocity"
                  className="w-20 h-20 object-contain mx-auto mb-4"
                />
                <h4 className="text-xl font-display font-bold text-white mb-3">
                  518 Velocity
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  The premier youth travel baseball program in the Saratoga
                  County area, consistently elevating standards both on and off
                  the field, developing exceptional young individuals.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamProfilesSection() {
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
            Full Profiles
          </p>
          <h2 className="heading-display text-white">Coach Credentials</h2>
        </motion.div>

        {/* Team Member Profiles */}
        <div className="space-y-12 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className="bg-velo-black rounded-2xl border border-gray-800 overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              {/* Header with Photo */}
              <div className="md:flex">
                {/* Photo */}
                <div className="md:w-1/3 p-6 flex justify-center items-start">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 rounded-full object-cover border-4 border-gold shadow-lg"
                    style={{
                      objectPosition:
                        member.name === 'Christian Garcia'
                          ? 'center 20%'
                          : 'center',
                    }}
                  />
                </div>

                {/* Info */}
                <div className="md:w-2/3 p-6 md:pl-0">
                  {/* Name & Title */}
                  <div className="mb-6 pb-6 border-b border-gray-800">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-gold mb-2">
                      {member.name}
                    </h3>
                    <p className="text-gray-400">{member.title}</p>
                  </div>

                  {/* Bio */}
                  <div className="text-gray-300 leading-relaxed space-y-4 mb-6">
                    {member.bio.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}

                    {/* Highlights (for Nolan) */}
                    {member.highlights &&
                      member.highlights.map((highlight, idx) => (
                        <p key={idx}>
                          <strong className="text-gold">
                            {highlight.title}:
                          </strong>{' '}
                          {highlight.text}
                        </p>
                      ))}

                    {member.closingBio && <p>{member.closingBio}</p>}
                  </div>

                  {/* Credentials */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Education */}
                    <div>
                      <h4 className="text-gold font-display font-bold mb-2">
                        Education
                      </h4>
                      <p className="text-gray-400 text-sm">{member.education}</p>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h4 className="text-gold font-display font-bold mb-2">
                        Certifications
                      </h4>
                      <ul className="space-y-1">
                        {member.certifications.map((cert, idx) => (
                          <li
                            key={idx}
                            className="text-gray-400 text-sm flex items-start gap-2"
                          >
                            <svg
                              className="w-4 h-4 text-gold mt-0.5 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {cert}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

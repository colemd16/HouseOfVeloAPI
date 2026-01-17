import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GlowButton } from '../ui/GlowButton';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
  variant?: 'default' | 'minimal' | 'split';
}

export function CTASection({
  title = 'Ready to Dominate?',
  subtitle = 'Start Your Journey',
  description = "Join the hundreds of athletes who've transformed their game at House of Velo. Your next level awaits.",
  primaryCTA = { text: 'Book a Session', href: '/services' },
  secondaryCTA,
  backgroundImage,
  variant = 'default',
}: CTASectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  if (variant === 'minimal') {
    return (
      <section
        ref={ref}
        className="py-16 bg-gradient-to-r from-velo-red to-velo-red-dark"
      >
        <div className="container-public px-4">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                {title}
              </h3>
              <p className="text-white/80">{description}</p>
            </div>
            <GlowButton
              href={primaryCTA.href}
              variant="gold"
              size="lg"
            >
              {primaryCTA.text}
            </GlowButton>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      {backgroundImage ? (
        <>
          <div className="absolute inset-0">
            <img
              src={backgroundImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-velo-black/80" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-velo-black via-velo-dark to-velo-black" />
      )}

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-velo-red/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <div className="container-public px-4 relative">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Subtitle */}
          <motion.p
            className="text-gold font-medium uppercase tracking-wider mb-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {subtitle}
          </motion.p>

          {/* Title */}
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {title}
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-xl text-gray-300 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <GlowButton href={primaryCTA.href} variant="red" size="xl">
              {primaryCTA.text}
            </GlowButton>
            {secondaryCTA && (
              <GlowButton
                href={secondaryCTA.href}
                variant="outline-gold"
                size="xl"
              >
                {secondaryCTA.text}
              </GlowButton>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-velo-black to-transparent" />
    </section>
  );
}

// Simple inline CTA for use within sections
interface InlineCTAProps {
  text: string;
  href: string;
  variant?: 'gold' | 'red';
}

export function InlineCTA({ text, href, variant = 'gold' }: InlineCTAProps) {
  return (
    <GlowButton href={href} variant={variant} size="lg">
      {text}
    </GlowButton>
  );
}

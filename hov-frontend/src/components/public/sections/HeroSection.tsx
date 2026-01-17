import { motion } from 'framer-motion';
import { GlowButton } from '../ui/GlowButton';

interface HeroSectionProps {
  title: string;
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
  backgroundVideo?: string;
  showScrollIndicator?: boolean;
  overlay?: 'dark' | 'darker' | 'gradient';
  size?: 'full' | 'large' | 'medium';
  centered?: boolean;
}

export function HeroSection({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  backgroundVideo,
  showScrollIndicator = false,
  overlay = 'gradient',
  size = 'full',
  centered = true,
}: HeroSectionProps) {
  const sizeClasses = {
    full: 'min-h-screen',
    large: 'min-h-[80vh]',
    medium: 'min-h-[60vh]',
  };

  const overlayClasses = {
    dark: 'bg-velo-black/70',
    darker: 'bg-velo-black/85',
    gradient: 'hero-overlay',
  };

  return (
    <section
      className={`relative ${sizeClasses[size]} flex items-center justify-center overflow-hidden`}
    >
      {/* Background Video */}
      {backgroundVideo && (
	<div className="absolute inset-0">
	 <video
	   src={backgroundVideo}
	   autoPlay
	   muted
	   loop
	   playsInline
	   className="w-full h-full object-cover"
	 />
	</div>
      )}

      {/* Fallback gradient background */}
      {!backgroundImage && !backgroundVideo (
        <div className="absolute inset-0 bg-gradient-to-br from-velo-black via-velo-dark to-velo-black" />
      )}

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-velo-red/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 container-public ${
          centered ? 'text-center' : ''
        } px-4`}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Subtitle */}
          {subtitle && (
            <motion.p
              className="text-gold font-medium text-lg md:text-xl mb-4 tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {subtitle}
            </motion.p>
          )}

          {/* Title */}
          <motion.h1
            className="heading-hero mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {title}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {description}
            </motion.p>
          )}

          {/* CTAs */}
          {(primaryCTA || secondaryCTA) && (
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {primaryCTA && (
                <GlowButton href={primaryCTA.href} variant="red" size="lg">
                  {primaryCTA.text}
                </GlowButton>
              )}
              {secondaryCTA && (
                <GlowButton
                  href={secondaryCTA.href}
                  variant="outline-white"
                  size="lg"
                >
                  {secondaryCTA.text}
                </GlowButton>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-gray-400"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-sm uppercase tracking-widest">Scroll</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

// Simpler page header variant
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export function PageHeader({ title, subtitle, backgroundImage }: PageHeaderProps) {
  return (
    <HeroSection
      title={title}
      subtitle={subtitle}
      backgroundImage={backgroundImage}
      size="medium"
      overlay="darker"
      showScrollIndicator={false}
    />
  );
}

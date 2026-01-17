import { motion } from 'framer-motion';
import { useState } from 'react';
import { GlowButton } from './GlowButton';

interface ServiceCardProps {
  name: string;
  tagline: string;
  duration: number;
  price?: number;
  onViewDetails?: () => void;
  onBook?: () => void;
  className?: string;
}

export function ServiceCard({
  name,
  tagline,
  duration,
  price,
  onViewDetails,
  onBook,
  className = '',
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`card-dark relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        {/* Duration badge */}
        <div className="inline-block bg-gold/10 text-gold text-sm font-medium px-3 py-1 rounded-full mb-4">
          {duration} min
        </div>

        {/* Title */}
        <h3 className="text-xl font-display font-bold text-white mb-3">
          {name}
        </h3>

        {/* Tagline */}
        <p className="text-gray-400 text-sm mb-6 min-h-[48px]">
          {tagline}
        </p>

        {/* Price */}
        {price && (
          <div className="mb-6">
            <span className="text-gray-500 text-sm">Starting at </span>
            <span className="text-gold text-2xl font-bold">${price}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {onViewDetails && (
            <GlowButton
              variant="outline-gold"
              size="sm"
              onClick={onViewDetails}
              className="flex-1"
            >
              Details
            </GlowButton>
          )}
          {onBook && (
            <GlowButton
              variant="red"
              size="sm"
              onClick={onBook}
              className="flex-1"
            >
              Book Now
            </GlowButton>
          )}
        </div>
      </div>

      {/* Decorative corner accent */}
      <motion.div
        className="absolute top-0 right-0 w-20 h-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-gold/20 to-transparent" />
      </motion.div>
    </motion.div>
  );
}

// Featured service card (larger, more prominent)
interface FeaturedServiceCardProps {
  name: string;
  description: string;
  duration: number;
  price?: number;
  features?: string[];
  onBook?: () => void;
  className?: string;
}

export function FeaturedServiceCard({
  name,
  description,
  duration,
  price,
  features,
  onBook,
  className = '',
}: FeaturedServiceCardProps) {
  return (
    <motion.div
      className={`bg-gradient-to-br from-velo-gray-light to-velo-dark border-2 border-gold/30 rounded-2xl p-8 relative overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ borderColor: 'rgba(196, 169, 98, 0.6)' }}
      transition={{ duration: 0.5 }}
    >
      {/* Featured badge */}
      <div className="absolute top-4 right-4 bg-gold text-velo-black text-xs font-bold px-3 py-1 rounded-full">
        FEATURED
      </div>

      <div className="mb-4">
        <span className="text-gold font-medium">{duration} minutes</span>
      </div>

      <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
        {name}
      </h3>

      <p className="text-gray-300 mb-6 leading-relaxed">
        {description}
      </p>

      {features && features.length > 0 && (
        <ul className="mb-6 space-y-2">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-gray-400">
              <span className="text-gold">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between">
        {price && (
          <div>
            <span className="text-gray-500 text-sm block">Starting at</span>
            <span className="text-gold text-3xl font-bold">${price}</span>
          </div>
        )}
        {onBook && (
          <GlowButton variant="red" size="lg" onClick={onBook}>
            Book Now
          </GlowButton>
        )}
      </div>
    </motion.div>
  );
}

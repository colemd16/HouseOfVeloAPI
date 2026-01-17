import { motion } from 'framer-motion';
import { useState } from 'react';

interface TeamMember {
  name: string;
  title: string;
  shortTitle?: string;
  image: string;
  certifications?: string[];
}

interface TeamCardProps {
  member: TeamMember;
  className?: string;
  showDetails?: boolean;
}

export function TeamCard({ member, className = '', showDetails = true }: TeamCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-dark overflow-hidden">
        {/* Image Container */}
        <div className="relative mb-6 overflow-hidden rounded-xl">
          <motion.div
            className="aspect-[4/5] relative"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-top"
            />
            {/* Overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-velo-black via-transparent to-transparent"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: isHovered ? 0.7 : 0.3 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Gold border accent */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gold"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-2xl font-display font-bold text-white mb-1">
            {member.name}
          </h3>
          <p className="text-gold font-medium mb-4">
            {member.shortTitle || member.title}
          </p>

          {/* Certifications on hover */}
          {showDetails && member.certifications && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isHovered ? 'auto' : 0,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                  Certifications
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {member.certifications.slice(0, 3).map((cert, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gold/10 text-gold px-2 py-1 rounded-full"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Compact version for previews
interface TeamCardCompactProps {
  member: TeamMember;
  className?: string;
}

export function TeamCardCompact({ member, className = '' }: TeamCardCompactProps) {
  return (
    <motion.div
      className={`flex items-center gap-4 p-4 rounded-xl bg-velo-gray-light border border-gray-800 hover:border-gold/50 transition-all duration-300 ${className}`}
      whileHover={{ x: 5 }}
    >
      <img
        src={member.image}
        alt={member.name}
        className="w-16 h-16 rounded-full object-cover border-2 border-gold"
      />
      <div>
        <h4 className="font-semibold text-white">{member.name}</h4>
        <p className="text-sm text-gray-400">{member.shortTitle || member.title}</p>
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

type ButtonVariant = 'gold' | 'red' | 'outline-gold' | 'outline-white';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface GlowButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
  pulse?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const variantStyles: Record<ButtonVariant, string> = {
  gold: 'bg-gold text-velo-black hover:bg-gold-hover hover:shadow-gold-glow',
  red: 'bg-velo-red text-white hover:bg-velo-red-hover hover:shadow-red-glow',
  'outline-gold': 'border-2 border-gold text-gold bg-transparent hover:bg-gold hover:text-velo-black',
  'outline-white': 'border-2 border-white text-white bg-transparent hover:bg-white hover:text-velo-black',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
};

export function GlowButton({
  children,
  variant = 'gold',
  size = 'md',
  href,
  external = false,
  onClick,
  className = '',
  pulse = false,
  disabled = false,
  type = 'button',
}: GlowButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold rounded-lg
    transition-all duration-300
    transform hover:-translate-y-1
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${pulse ? 'animate-glow-pulse' : ''}
    ${className}
  `;

  const motionProps = {
    whileHover: disabled ? {} : { scale: 1.02 },
    whileTap: disabled ? {} : { scale: 0.98 },
  };

  // External link
  if (href && external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseStyles}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  // Internal link
  if (href) {
    return (
      <motion.div {...motionProps}>
        <Link to={href} className={baseStyles}>
          {children}
        </Link>
      </motion.div>
    );
  }

  // Button
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}

// Icon button variant
interface IconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel: string;
}

export function IconButton({
  children,
  onClick,
  className = '',
  ariaLabel,
}: IconButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        p-3 rounded-full
        bg-velo-gray-light border border-gray-700
        text-white hover:text-gold
        hover:border-gold/50 hover:shadow-gold
        transition-all duration-300
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}

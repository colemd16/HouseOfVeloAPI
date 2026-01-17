import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: '518 Velocity', href: '/518-velocity' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.nav
        className={`transition-all duration-300 ${
          scrolled
            ? 'py-2 bg-velo-black/95 backdrop-blur-lg border-b border-gray-800'
            : 'py-4 bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 relative z-10">
              <motion.img
                src="/images/houseofvelo.png"
                alt="House of Velo"
                className={`transition-all duration-300 ${
                  scrolled ? 'h-10 md:h-12' : 'h-12 md:h-14'
                }`}
                whileHover={{ scale: 1.05 }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    location.pathname === link.href
                      ? 'text-gold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.href && (
                    <motion.div
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold"
                      layoutId="navbar-indicator"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Auth Button */}
            <div className="hidden lg:block">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 rounded-lg bg-gold text-velo-black font-semibold text-sm hover:bg-gold-hover transition-all duration-300 hover:shadow-gold-glow"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-lg bg-velo-red text-white font-semibold text-sm hover:bg-velo-red-hover transition-all duration-300 hover:shadow-red-glow"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden relative z-10 p-2"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <motion.span
                  className="w-full h-0.5 bg-white rounded-full block"
                  animate={{
                    rotate: mobileMenuOpen ? 45 : 0,
                    y: mobileMenuOpen ? 9 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-full h-0.5 bg-white rounded-full block"
                  animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-full h-0.5 bg-white rounded-full block"
                  animate={{
                    rotate: mobileMenuOpen ? -45 : 0,
                    y: mobileMenuOpen ? -9 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-velo-black/98 backdrop-blur-lg border-t border-gray-800 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                        location.pathname === link.href
                          ? 'bg-gold/10 text-gold'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="pt-4 border-t border-gray-800"
                >
                  {isAuthenticated ? (
                    <Link
                      to="/dashboard"
                      className="block w-full text-center px-4 py-3 rounded-lg bg-gold text-velo-black font-semibold hover:bg-gold-hover transition-colors"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="block w-full text-center px-4 py-3 rounded-lg bg-velo-red text-white font-semibold hover:bg-velo-red-hover transition-colors"
                    >
                      Login
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PublicLayout } from '../../components/public/PublicLayout';
import { PageHeader } from '../../components/public/sections/HeroSection';
import { CTASection } from '../../components/public/sections/CTASection';
import { sessionTypesApi } from '../../api/sessionTypes';
import { SessionTypeResponse, SessionTypeOptionResponse } from '../../types/responses';
import { PricingType } from '../../types/enums';
import { getServiceTagline } from '../../data/services';
import { useAuth } from '../../contexts/AuthContext';

export function Services() {
  const [sessionTypes, setSessionTypes] = useState<SessionTypeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<SessionTypeResponse | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<SessionTypeOptionResponse[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetchSessionTypes();
  }, []);

  // Handle booking - redirect based on pricing type
  // Subscriptions go to checkout, one-time options go to bookings
  const handleBookNow = (option?: SessionTypeOptionResponse | null) => {
    if (!option) {
      // No option selected, go to general bookings page
      if (isAuthenticated) {
        navigate('/bookings');
      } else {
        navigate('/login', { state: { from: { pathname: '/bookings' } } });
      }
      handleCloseModal();
      return;
    }

    // Determine destination based on pricing type
    const isSubscription = option.pricingType === PricingType.SUBSCRIPTION;
    const destinationPath = isSubscription
      ? `/checkout?optionId=${option.id}`
      : `/bookings?optionId=${option.id}`;

    if (isAuthenticated) {
      navigate(destinationPath);
    } else {
      navigate('/login', { state: { from: { pathname: destinationPath } } });
    }

    // Close modal if open
    handleCloseModal();
  };

  const fetchSessionTypes = async () => {
    try {
      setLoading(true);
      const data = await sessionTypesApi.getAll();
      setSessionTypes(data.filter((st) => st.isActive));
    } catch (err) {
      setError('Failed to load services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (service: SessionTypeResponse) => {
    setSelectedService(service);

    // If options are already included in the response, use them
    if (service.options && service.options.length > 0) {
      setSelectedOptions(service.options.filter(o => o.isActive));
    } else {
      // Otherwise fetch them separately
      setOptionsLoading(true);
      try {
        const options = await sessionTypesApi.getOptions(service.id);
        setSelectedOptions(options.filter(o => o.isActive));
      } catch (err) {
        console.error('Failed to fetch options:', err);
        setSelectedOptions([]);
      } finally {
        setOptionsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setSelectedOptions([]);
  };

  const formatPrice = (option: SessionTypeOptionResponse) => {
    const price = `$${option.price.toFixed(0)}`;
    if (option.pricingType === PricingType.SUBSCRIPTION && option.billingPeriodDays) {
      const weeks = Math.round(option.billingPeriodDays / 7);
      return `${price}/${weeks} weeks`;
    }
    return price;
  };

  const formatPricingType = (option: SessionTypeOptionResponse) => {
    switch (option.pricingType) {
      case PricingType.ONE_TIME:
        return 'One-time payment';
      case PricingType.SUBSCRIPTION:
        if (option.sessionsPerWeek) {
          return `${option.sessionsPerWeek}x per week`;
        }
        return 'Subscription';
      default:
        return '';
    }
  };

  const getLowestPrice = (options: SessionTypeOptionResponse[] | null) => {
    if (!options || options.length === 0) return null;
    const activeOptions = options.filter((o) => o.isActive);
    if (activeOptions.length === 0) return null;
    const lowest = activeOptions.reduce((min, o) => (o.price < min.price ? o : min));
    return lowest;
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <PageHeader
        title="Training Services"
        subtitle="Elite Programs for Every Athlete"
        backgroundImage="/images/training-bg.jpg"
      />

      {/* Services Grid Section */}
      <section ref={ref} className="py-20 bg-velo-dark">
        <div className="container-public px-4">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold font-medium uppercase tracking-wider mb-3">
              Our Programs
            </p>
            <h2 className="heading-display text-white mb-4">
              Choose Your Training Path
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From personalized one-on-one lessons to comprehensive development
              programs, we have the training solution for you.
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading services...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-velo-red text-lg mb-4">{error}</p>
              <button
                onClick={fetchSessionTypes}
                className="bg-gold text-velo-black px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Services Grid */}
          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessionTypes.map((service, index) => {
                const lowestPrice = getLowestPrice(service.options);
                const tagline = getServiceTagline(service.name, service.description?.slice(0, 100));

                return (
                  <motion.div
                    key={service.id}
                    className="group bg-velo-black rounded-xl border border-gray-800 p-6
                      hover:border-gold/50 hover:shadow-gold-glow transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {/* Service Name */}
                    <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-gold transition-colors">
                      {service.name}
                    </h3>

                    {/* Tagline */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {tagline}
                    </p>

                    {/* Duration & Price */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-gold font-medium">
                        {service.durationMinutes} min
                      </span>
                      {lowestPrice && (
                        <>
                          <span className="text-gray-600">|</span>
                          <span className="text-gray-400">
                            From{' '}
                            <span className="text-gold font-bold">
                              ${lowestPrice.price.toFixed(0)}
                            </span>
                          </span>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewDetails(service)}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gold text-gold font-medium
                          hover:bg-gold hover:text-velo-black transition-all duration-300"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleBookNow(lowestPrice)}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-velo-red text-white font-medium
                          hover:bg-velo-red-dark transition-colors text-center"
                      >
                        Book Now
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-velo-dark border border-gray-800 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-white text-3xl leading-none p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                &times;
              </button>

              {/* Header */}
              <div className="mb-6 pb-6 border-b border-gray-800">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 pr-10">
                  {selectedService.name}
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-gold font-medium">
                    {selectedService.durationMinutes} minutes
                  </span>
                  {selectedService.options && selectedService.options.length > 0 && (
                    <>
                      <span className="text-gray-600">|</span>
                      <span className="text-gray-400">
                        {selectedService.options.filter(o => o.isActive).length} pricing options
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedService.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-display font-bold text-white mb-3">
                    About This Program
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedService.description}
                  </p>
                </div>
              )}

              {/* Pricing Options */}
              <div className="mb-8">
                <h3 className="text-lg font-display font-bold text-white mb-4">
                  Pricing Options
                </h3>

                {optionsLoading ? (
                  <div className="text-center py-8">
                    <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Loading options...</p>
                  </div>
                ) : selectedOptions.length > 0 ? (
                  <div className="space-y-4">
                    {selectedOptions.map((option) => (
                      <div
                        key={option.id}
                        className="bg-velo-black rounded-xl p-5 border border-gray-800 hover:border-gold/30 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          {/* Option Details */}
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-lg mb-1">
                              {option.name}
                            </h4>
                            {option.description && (
                              <p className="text-gray-400 text-sm mb-3">
                                {option.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="inline-flex items-center gap-1 text-xs bg-gold/10 text-gold px-2 py-1 rounded">
                                {formatPricingType(option)}
                              </span>
                              {option.maxParticipants > 1 && (
                                <span className="inline-flex items-center gap-1 text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                                  Up to {option.maxParticipants} athletes
                                </span>
                              )}
                              {option.pricingType === PricingType.SUBSCRIPTION && option.autoRenew && (
                                <span className="inline-flex items-center gap-1 text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                                  Auto-renews
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price & Book Button */}
                          <div className="flex flex-col items-end gap-3">
                            <div className="text-right">
                              <span className="text-gold text-2xl font-bold">
                                {formatPrice(option)}
                              </span>
                              {option.pricingType === PricingType.SUBSCRIPTION && option.billingPeriodDays && (
                                <p className="text-gray-500 text-xs">
                                  Billed every {Math.round(option.billingPeriodDays / 7)} weeks
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleBookNow(option)}
                              className="px-5 py-2 rounded-lg bg-velo-red text-white font-medium text-sm
                                hover:bg-velo-red-dark transition-colors whitespace-nowrap"
                            >
                              {option.pricingType === PricingType.SUBSCRIPTION ? 'Subscribe' : 'Select & Book'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-velo-black rounded-xl border border-gray-800">
                    <p className="text-gray-500">No pricing options available</p>
                    <p className="text-gray-600 text-sm mt-1">Contact us for pricing information</p>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-800">
                <Link
                  to="/contact"
                  className="flex-1 px-6 py-3 rounded-lg border border-gray-700 text-gray-300 font-medium
                    hover:border-gold hover:text-gold transition-colors text-center"
                >
                  Have Questions?
                </Link>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 rounded-lg bg-gray-800 text-gray-300 font-medium
                    hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <CTASection
        title="Can't Find What You Need?"
        subtitle="We're Here to Help"
        description="Contact us and we'll help you find the perfect training program for your goals."
        primaryCTA={{ text: 'Contact Us', href: '/contact' }}
        variant="minimal"
      />
    </PublicLayout>
  );
}

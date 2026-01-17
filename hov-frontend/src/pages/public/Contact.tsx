import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PublicLayout } from '../../components/public/PublicLayout';
import { PageHeader } from '../../components/public/sections/HeroSection';

export function Contact() {
  return (
    <PublicLayout>
      {/* Hero */}
      <PageHeader
        title="Contact Us"
        subtitle="Get In Touch"
        backgroundImage="/images/contact-bg.jpg"
      />

      {/* Main Content */}
      <section className="py-24 bg-velo-dark">
        <div className="container-public px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <ContactInfo />

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <MapSection />
    </PublicLayout>
  );
}

function ContactInfo() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const contactDetails = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: 'Location',
      content: (
        <>
          <p className="font-medium text-white">Gary Bynon Athletic Center (GBAC)</p>
          <p>107 Pierce Rd</p>
          <p>Clifton Park, NY 12065</p>
        </>
      ),
      link: {
        href: 'https://maps.google.com/?q=107+Pierce+Rd,+Clifton+Park,+NY+12065',
        text: 'Get Directions',
      },
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: 'Email',
      content: <p>info@houseofvelo.com</p>,
      link: {
        href: 'mailto:info@houseofvelo.com',
        text: 'Send Email',
      },
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: 'Hours',
      content: (
        <>
          <p>
            <span className="text-gray-500">Mon-Fri:</span> 3PM - 9PM
          </p>
          <p>
            <span className="text-gray-500">Saturday:</span> 8AM - 2PM
          </p>
          <p>
            <span className="text-gray-500">Sunday:</span> By Appointment
          </p>
        </>
      ),
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <p className="text-gold font-medium uppercase tracking-wider mb-3">
        Contact Information
      </p>
      <h2 className="heading-display text-white mb-8">Let's Connect</h2>
      <p className="text-gray-300 text-lg leading-relaxed mb-10">
        Have questions about our training programs or 518 Velocity? We'd love to
        hear from you. Reach out and let's discuss how we can help you achieve
        your baseball goals.
      </p>

      {/* Contact Details */}
      <div className="space-y-8">
        {contactDetails.map((detail, index) => (
          <motion.div
            key={detail.title}
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
              {detail.icon}
            </div>
            <div>
              <h3 className="text-gold font-display font-bold mb-2">
                {detail.title}
              </h3>
              <div className="text-gray-400">{detail.content}</div>
              {detail.link && (
                <a
                  href={detail.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors mt-2 text-sm font-medium"
                >
                  {detail.link.text}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Social Links */}
      <div className="mt-10 pt-10 border-t border-gray-800">
        <h4 className="text-white font-display font-bold mb-4">Follow Us</h4>
        <div className="flex gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg bg-velo-black border border-gray-800 flex items-center justify-center
              text-gray-400 hover:text-gold hover:border-gold transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg bg-velo-black border border-gray-800 flex items-center justify-center
              text-gray-400 hover:text-gold hover:border-gold transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg bg-velo-black border border-gray-800 flex items-center justify-center
              text-gray-400 hover:text-gold hover:border-gold transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For now, just show success (would integrate with backend later)
    setSubmitStatus('success');
    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitStatus('idle');
    }, 3000);
  };

  return (
    <motion.div
      ref={ref}
      className="bg-velo-black rounded-2xl border border-gray-800 p-8"
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-2xl font-display font-bold text-white mb-6">
        Send Us a Message
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-velo-dark border border-gray-700 text-white
              placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
            placeholder="Your name"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-velo-dark border border-gray-700 text-white
                placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-velo-dark border border-gray-700 text-white
                placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
              placeholder="(123) 456-7890"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">
            Subject *
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-velo-dark border border-gray-700 text-white
              focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
          >
            <option value="">Select a topic</option>
            <option value="training">Training Programs</option>
            <option value="518-velocity">518 Velocity Tryouts</option>
            <option value="facility">Facility Rentals</option>
            <option value="general">General Inquiry</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-3 rounded-lg bg-velo-dark border border-gray-700 text-white
              placeholder-gray-500 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors resize-none"
            placeholder="How can we help you?"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-4 rounded-lg bg-velo-red text-white font-semibold
            hover:bg-velo-red-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Sending...
            </span>
          ) : submitStatus === 'success' ? (
            <span className="flex items-center justify-center gap-2 text-green-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Message Sent!
            </span>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </motion.div>
  );
}

function MapSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="py-20 bg-velo-black">
      <div className="container-public px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold font-medium uppercase tracking-wider mb-3">
            Find Us
          </p>
          <h2 className="heading-display text-white">Our Location</h2>
        </motion.div>

        <motion.div
          className="rounded-2xl overflow-hidden border border-gray-800 h-[400px] bg-velo-dark"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Map placeholder - would integrate Google Maps or similar */}
          <div className="w-full h-full flex items-center justify-center bg-velo-dark">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-gold/30 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-gray-500 mb-4">Gary Bynon Athletic Center</p>
              <a
                href="https://maps.google.com/?q=107+Pierce+Rd,+Clifton+Park,+NY+12065"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold text-velo-black font-semibold
                  hover:bg-gold-dark transition-colors"
              >
                Open in Google Maps
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

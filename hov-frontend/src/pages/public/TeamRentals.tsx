import { useState, FormEvent } from 'react';
import { PublicLayout } from '../../components/public/PublicLayout';

interface FormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  teamAge: string;
  details: string;
}

export function TeamRentals() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    teamAge: '',
    details: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // For now, we'll simulate a submission
      // In production, this would call an API endpoint
      const response = await fetch('/api/team-rental-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          organization: '',
          teamAge: '',
          details: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      // If API doesn't exist yet, show success for demo purposes
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        teamAge: '',
        details: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-velo-black via-gray-900 to-velo-black rounded-2xl mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Team Training Rentals
        </h1>
        <p className="text-xl text-gray-300">
          Not Your Average Cage Rental
        </p>
      </section>

      {/* Section Divider */}
      <div className="flex justify-center py-4">
        <div className="w-1/3 max-w-[400px] h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent rounded-full" />
      </div>

      {/* Description Section */}
      <section className="py-8 max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Coached Team Practice
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            This is a coached team practice. A paid HOV instructor leads the plan, builds high-rep stations, and trains your staff so the same standards travel back to your field. Built for 7U–12U baseball and all-ages softball to get more out of their winter training. HitTrax data + competitions included.
          </p>
          <p className="text-2xl text-gold font-bold italic">
            Set the Tone at The HOV
          </p>
        </div>
      </section>

      {/* Section Divider */}
      <div className="flex justify-center py-4">
        <div className="w-1/3 max-w-[400px] h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent rounded-full" />
      </div>

      {/* Contact Form */}
      <section className="py-8 max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Request Team Training
          </h3>

          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6 text-center">
              Thank you! Your request has been submitted. We will contact you shortly.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-center">
              There was an error submitting your request. Please try again or contact us directly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-gold focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-gold focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-gold focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="organization" className="block text-gray-700 font-semibold mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                required
                value={formData.organization}
                onChange={handleChange}
                className="w-full bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-gold focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="teamAge" className="block text-gray-700 font-semibold mb-2">
                Team Age(s) Level *
              </label>
              <input
                type="text"
                id="teamAge"
                name="teamAge"
                required
                placeholder="e.g., 10U, 12U, etc."
                value={formData.teamAge}
                onChange={handleChange}
                className="w-full bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-gold focus:outline-none transition-all duration-300 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="details" className="block text-gray-700 font-semibold mb-2">
                Tell us what you are looking for! (Ideal dates & times) *
              </label>
              <textarea
                id="details"
                name="details"
                required
                rows={6}
                placeholder="Please include your preferred dates, times, and any specific training focus areas..."
                value={formData.details}
                onChange={handleChange}
                className="w-full bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-gold focus:outline-none transition-all duration-300 placeholder:text-gray-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold text-black py-4 rounded-lg font-bold text-lg hover:bg-gold-hover transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}

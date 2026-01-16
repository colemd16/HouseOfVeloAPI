import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Role, Sport, Handedness } from '../types/enums';
import type { SignupRequest } from '../types';

type Step = 'role' | 'basic' | 'details';

const roleOptions = [
  { value: Role.PARENT, label: 'Parent', description: 'Register and manage players' },
  { value: Role.PLAYER, label: 'Player', description: 'Book sessions and track progress' },
  { value: Role.TRAINER, label: 'Trainer', description: 'Manage availability and sessions' },
];

const positions = [
  'Pitcher', 'Catcher', 'First Base', 'Second Base', 'Shortstop',
  'Third Base', 'Left Field', 'Center Field', 'Right Field', 'Utility'
];

export function Signup() {
  const [step, setStep] = useState<Step>('role');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState<SignupRequest>({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: Role.PARENT,
    // Player fields
    age: undefined,
    position: '',
    sport: 'BASEBALL',
    bats: undefined,
    throwingHand: undefined,
    // Trainer fields
    bio: '',
    sports: [Sport.BASEBALL],
  });

  const [confirmPassword, setConfirmPassword] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const updateField = <K extends keyof SignupRequest>(field: K, value: SignupRequest[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleSelect = (role: Role) => {
    updateField('role', role);
    setStep('basic');
  };

  const handleBasicSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Skip details for PARENT role
    if (formData.role === Role.PARENT) {
      handleFinalSubmit();
    } else {
      setStep('details');
    }
  };

  const handleFinalSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Clean up request based on role
      const request: SignupRequest = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || undefined,
        role: formData.role,
      };

      if (formData.role === Role.PLAYER) {
        request.age = formData.age;
        request.position = formData.position || undefined;
        request.sport = formData.sport || 'BASEBALL';
        request.bats = formData.bats;
        request.throwingHand = formData.throwingHand;
      } else if (formData.role === Role.TRAINER) {
        request.bio = formData.bio || undefined;
        request.sports = formData.sports;
      }

      await signup(request);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-velo-black via-velo-red/20 to-velo-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/images/mv.png"
            alt="House of Velo"
            className="h-24 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">
            {step === 'role' && 'Choose your account type'}
            {step === 'basic' && 'Enter your information'}
            {step === 'details' && 'Complete your profile'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-velo p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-velo-red px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {/* Step 1: Role Selection */}
          {step === 'role' && (
            <div className="space-y-4">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleRoleSelect(option.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl text-left transition-all hover:border-gold hover:bg-gold/5 group"
                >
                  <p className="font-semibold text-velo-black group-hover:text-gold">
                    {option.label}
                  </p>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Basic Info */}
          {step === 'basic' && (
            <form onSubmit={handleBasicSubmit} className="space-y-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
              />

              <Input
                label="Phone (optional)"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="Enter your phone number"
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="Create a password"
                required
                autoComplete="new-password"
              />

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('role')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" variant="secondary" className="flex-1" isLoading={formData.role === Role.PARENT && isLoading}>
                  {formData.role === Role.PARENT ? 'Create Account' : 'Next'}
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Role-specific Details */}
          {step === 'details' && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              {formData.role === Role.PLAYER && (
                <>
                  <Input
                    label="Age"
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => updateField('age', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Enter your age"
                    min={5}
                    max={99}
                  />

                  <div>
                    <label className="block mb-2 font-semibold text-velo-gray">
                      Position
                    </label>
                    <select
                      value={formData.position || ''}
                      onChange={(e) => updateField('position', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value="">Select position</option>
                      {positions.map((pos) => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold text-velo-gray">
                        Bats
                      </label>
                      <select
                        value={formData.bats || ''}
                        onChange={(e) => updateField('bats', e.target.value as Handedness || undefined)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      >
                        <option value="">Select</option>
                        <option value={Handedness.L}>Left</option>
                        <option value={Handedness.R}>Right</option>
                        <option value={Handedness.S}>Switch</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 font-semibold text-velo-gray">
                        Throws
                      </label>
                      <select
                        value={formData.throwingHand || ''}
                        onChange={(e) => updateField('throwingHand', e.target.value as Handedness || undefined)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      >
                        <option value="">Select</option>
                        <option value={Handedness.L}>Left</option>
                        <option value={Handedness.R}>Right</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {formData.role === Role.TRAINER && (
                <>
                  <div>
                    <label className="block mb-2 font-semibold text-velo-gray">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio || ''}
                      onChange={(e) => updateField('bio', e.target.value)}
                      placeholder="Tell us about your experience and coaching style"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-velo-gray">
                      Sports
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.sports?.includes(Sport.BASEBALL)}
                          onChange={(e) => {
                            const sports = formData.sports || [];
                            if (e.target.checked) {
                              updateField('sports', [...sports, Sport.BASEBALL]);
                            } else {
                              updateField('sports', sports.filter(s => s !== Sport.BASEBALL));
                            }
                          }}
                          className="w-5 h-5 text-gold rounded border-gray-300 focus:ring-gold"
                        />
                        <span>Baseball</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.sports?.includes(Sport.SOFTBALL)}
                          onChange={(e) => {
                            const sports = formData.sports || [];
                            if (e.target.checked) {
                              updateField('sports', [...sports, Sport.SOFTBALL]);
                            } else {
                              updateField('sports', sports.filter(s => s !== Sport.SOFTBALL));
                            }
                          }}
                          className="w-5 h-5 text-gold rounded border-gray-300 focus:ring-gold"
                        />
                        <span>Softball</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('basic')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" variant="secondary" className="flex-1" isLoading={isLoading}>
                  Create Account
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-gold hover:text-gold-hover font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

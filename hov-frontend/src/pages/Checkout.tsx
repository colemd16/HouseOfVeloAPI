import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { sessionTypesApi } from '../api/sessionTypes';
import { subscriptionsApi } from '../api/subscriptions';
import { PricingType } from '../types/enums';
import type { SessionTypeOptionResponse, SubscriptionResponse } from '../types';

type CheckoutStep = 'review' | 'processing' | 'success';

export function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const optionId = searchParams.get('optionId');

  const [step, setStep] = useState<CheckoutStep>('review');
  const [option, setOption] = useState<SessionTypeOptionResponse | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (optionId) {
      fetchOptionDetails(parseInt(optionId, 10));
    } else {
      setError('No subscription option selected');
      setIsLoading(false);
    }
  }, [optionId]);

  const fetchOptionDetails = async (id: number) => {
    try {
      setIsLoading(true);
      // Fetch all session types and find the option
      const sessionTypes = await sessionTypesApi.getAll();

      for (const sessionType of sessionTypes) {
        // Check if options are included
        if (sessionType.options) {
          const foundOption = sessionType.options.find(o => o.id === id);
          if (foundOption) {
            // Verify it's a subscription type
            if (foundOption.pricingType !== PricingType.SUBSCRIPTION) {
              setError('This option is not a subscription. Please use the booking page for one-time sessions.');
              return;
            }
            setOption(foundOption);
            return;
          }
        }

        // Fetch options separately if not included
        try {
          const options = await sessionTypesApi.getOptions(sessionType.id);
          const foundOption = options.find(o => o.id === id);
          if (foundOption) {
            if (foundOption.pricingType !== PricingType.SUBSCRIPTION) {
              setError('This option is not a subscription. Please use the booking page for one-time sessions.');
              return;
            }
            setOption(foundOption);
            return;
          }
        } catch {
          // Continue to next session type
        }
      }

      setError('Subscription option not found');
    } catch (err) {
      console.error('Failed to fetch option details:', err);
      setError('Failed to load subscription details');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTokens = (opt: SessionTypeOptionResponse): number => {
    // Calculate tokens based on sessions per week * weeks in billing period
    if (opt.sessionsPerWeek && opt.billingPeriodDays) {
      const weeks = Math.round(opt.billingPeriodDays / 7);
      return opt.sessionsPerWeek * weeks;
    }
    // Fallback: assume 1 token per week
    if (opt.billingPeriodDays) {
      return Math.round(opt.billingPeriodDays / 7);
    }
    return 4; // Default fallback
  };

  const handlePurchase = async () => {
    if (!option) return;

    setStep('processing');
    setError('');

    try {
      const tokensPerPeriod = calculateTokens(option);

      const response = await subscriptionsApi.create({
        sessionTypeOptionId: option.id,
        tokensPerPeriod,
        autoRenew: option.autoRenew ?? true,
      });

      setSubscription(response);
      setStep('success');
    } catch (err: unknown) {
      console.error('Failed to create subscription:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process subscription. Please try again.';
      // Check for specific error about existing subscription
      if (errorMessage.includes('already has an active subscription')) {
        setError('You already have an active subscription. Please manage your existing subscription from your dashboard.');
      } else {
        setError(errorMessage);
      }
      setStep('review');
    }
  };

  const formatBillingPeriod = (days: number): string => {
    const weeks = Math.round(days / 7);
    return weeks === 1 ? '1 week' : `${weeks} weeks`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !option) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-velo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-velo-black mb-2">Unable to Load</h2>
              <p className="text-gray-500 mb-6">{error}</p>
              <Button variant="secondary" onClick={() => navigate('/services')}>
                Back to Services
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success Step
  if (step === 'success' && subscription) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-velo-black mb-2">Subscription Activated!</h1>
              <p className="text-gray-500 mb-8">
                Your subscription is now active and ready to use.
              </p>

              {/* Subscription Details */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-velo-black mb-4">Subscription Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Plan</span>
                    <span className="font-medium text-velo-black">{option?.sessionTypeName} - {option?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sessions Available</span>
                    <span className="font-bold text-gold text-lg">{subscription.tokensRemaining} tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Billing Period</span>
                    <span className="font-medium text-velo-black">
                      {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </span>
                  </div>
                  {subscription.autoRenew && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Auto-Renewal</span>
                      <span className="text-green-600 font-medium">Enabled</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/bookings')}
                  className="flex-1"
                >
                  Book a Session Now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Review Step
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-velo-black">Complete Your Subscription</h1>
        <p className="text-gray-500">Review your subscription details and confirm</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-velo-red px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-velo-black mb-6">Subscription Summary</h2>

          {option && (
            <div className="space-y-4">
              {/* Session Type */}
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Program</span>
                <span className="font-medium text-velo-black">{option.sessionTypeName}</span>
              </div>

              {/* Option Name */}
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Plan</span>
                <span className="font-medium text-velo-black">{option.name}</span>
              </div>

              {/* Description */}
              {option.description && (
                <div className="py-3 border-b border-gray-100">
                  <span className="text-gray-500 block mb-1">Description</span>
                  <span className="text-gray-700">{option.description}</span>
                </div>
              )}

              {/* Sessions Per Week */}
              {option.sessionsPerWeek && (
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Sessions Per Week</span>
                  <span className="font-medium text-velo-black">{option.sessionsPerWeek}x per week</span>
                </div>
              )}

              {/* Billing Period */}
              {option.billingPeriodDays && (
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Billing Cycle</span>
                  <span className="font-medium text-velo-black">Every {formatBillingPeriod(option.billingPeriodDays)}</span>
                </div>
              )}

              {/* Tokens/Sessions Included */}
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Sessions Included</span>
                <span className="font-bold text-gold">{calculateTokens(option)} sessions</span>
              </div>

              {/* Auto-Renew */}
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Auto-Renewal</span>
                <span className="font-medium text-velo-black">{option.autoRenew ? 'Yes' : 'No'}</span>
              </div>

              {/* Price */}
              <div className="flex justify-between py-4 text-lg">
                <span className="font-semibold text-velo-black">Total</span>
                <span className="font-bold text-gold">${option.price.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Note about payment */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Payment processing will be available soon. For now, your subscription will be activated immediately.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/services')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handlePurchase}
              isLoading={step === 'processing'}
              className="flex-1"
            >
              {step === 'processing' ? 'Processing...' : 'Confirm Subscription'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { bookingsApi } from '../api/bookings';
import { trainersApi } from '../api/trainers';
import { sessionTypesApi } from '../api/sessionTypes';
import { playersApi } from '../api/players';
import { Role, BookingStatus } from '../types/enums';
import type {
  BookingResponse,
  SessionTypeResponse,
  SessionTypeOptionResponse,
  TrainerResponse,
  AvailabilityResponse,
  PlayerResponse,
  CreateBookingRequest,
} from '../types';

type BookingStep = 'list' | 'session' | 'trainer' | 'datetime' | 'confirm';

const statusColors: Record<string, string> = {
  UNPAID: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
  NO_SHOW: 'bg-gray-100 text-gray-700',
};

export function Bookings() {
  const { hasRole } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialOptionId] = useState(() => {
    const optionId = searchParams.get('optionId');
    return optionId ? parseInt(optionId, 10) : null;
  });

  // Booking flow state
  const [step, setStep] = useState<BookingStep>('list');
  const [sessionTypes, setSessionTypes] = useState<SessionTypeResponse[]>([]);
  const [trainers, setTrainers] = useState<TrainerResponse[]>([]);
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [trainerAvailability, setTrainerAvailability] = useState<AvailabilityResponse[]>([]);

  // Selected values
  const [selectedSessionType, setSelectedSessionType] = useState<SessionTypeResponse | null>(null);
  const [selectedOption, setSelectedOption] = useState<SessionTypeOptionResponse | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  // Loading states
  const [isBooking, setIsBooking] = useState(false);
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Cancel modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<BookingResponse | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Auto-start booking flow if optionId is provided in URL
  useEffect(() => {
    if (initialOptionId && !isLoading) {
      startBookingWithOption(initialOptionId);
      // Clear the URL param after processing
      setSearchParams({}, { replace: true });
    }
  }, [initialOptionId, isLoading]);

  const startBookingWithOption = async (optionId: number) => {
    setStep('session');
    try {
      const [types, playerList] = await Promise.all([
        sessionTypesApi.getAll(),
        hasRole(Role.PARENT) ? playersApi.getMyPlayers() : Promise.resolve([]),
      ]);
      const activeTypes = types.filter(t => t.isActive);
      const enrichedTypes = await enrichSessionTypesWithOptions(activeTypes);
      setSessionTypes(enrichedTypes);
      setPlayers(playerList);

      // Find the session type and option that matches the optionId
      for (const sessionType of enrichedTypes) {
        if (sessionType.options) {
          const option = sessionType.options.find(o => o.id === optionId && o.isActive);
          if (option) {
            // Auto-select this option and move to trainer selection
            selectSessionOption(sessionType, option);
            return;
          }
        }
      }
      // If option not found, just stay on session selection
    } catch (err) {
      console.error('Failed to load session types:', err);
      setError('Failed to load session types');
      setStep('list');
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await bookingsApi.getMyBookings();
      // Sort by date, newest first
      data.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to fetch options for session types that don't have them
  const enrichSessionTypesWithOptions = async (types: SessionTypeResponse[]): Promise<SessionTypeResponse[]> => {
    const enrichedTypes = await Promise.all(
      types.map(async (type) => {
        // If options are already loaded, use them
        if (type.options && type.options.length > 0) {
          return type;
        }
        // Otherwise fetch options separately
        try {
          const options = await sessionTypesApi.getOptions(type.id);
          return { ...type, options };
        } catch (err) {
          console.error(`Failed to fetch options for session type ${type.id}:`, err);
          return { ...type, options: [] };
        }
      })
    );
    return enrichedTypes;
  };

  const startBooking = async () => {
    setStep('session');
    try {
      const [types, playerList] = await Promise.all([
        sessionTypesApi.getAll(),
        hasRole(Role.PARENT) ? playersApi.getMyPlayers() : Promise.resolve([]),
      ]);
      const activeTypes = types.filter(t => t.isActive);
      const enrichedTypes = await enrichSessionTypesWithOptions(activeTypes);
      setSessionTypes(enrichedTypes);
      setPlayers(playerList);
    } catch (err) {
      console.error('Failed to load session types:', err);
      setError('Failed to load session types');
      setStep('list');
    }
  };

  const selectSessionOption = async (sessionType: SessionTypeResponse, option: SessionTypeOptionResponse) => {
    setSelectedSessionType(sessionType);
    setSelectedOption(option);
    setStep('trainer');
    setLoadingTrainers(true);
    try {
      const trainerList = await trainersApi.getAll();
      setTrainers(trainerList.filter(t => t.isActive));
    } catch (err) {
      console.error('Failed to load trainers:', err);
    } finally {
      setLoadingTrainers(false);
    }
  };

  const selectTrainer = async (trainer: TrainerResponse) => {
    setSelectedTrainer(trainer);
    setStep('datetime');
    setLoadingAvailability(true);
    try {
      const availability = await trainersApi.getAvailability(trainer.id);
      setTrainerAvailability(availability.filter(a => a.isAvailable));
    } catch (err) {
      console.error('Failed to load availability:', err);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const selectDateTime = () => {
    if (selectedDate && selectedTime) {
      setStep('confirm');
    }
  };

  const confirmBooking = async () => {
    if (!selectedOption || !selectedTrainer || !selectedDate || !selectedTime) return;

    setIsBooking(true);
    try {
      const scheduledAt = `${selectedDate}T${selectedTime}:00`;
      const request: CreateBookingRequest = {
        sessionTypeOptionId: selectedOption.id,
        trainerId: selectedTrainer.id,
        scheduledAt,
        playerId: selectedPlayer || undefined,
        notes: notes || undefined,
      };

      await bookingsApi.create(request);
      await fetchBookings();
      resetBookingFlow();
    } catch (err) {
      console.error('Failed to create booking:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const resetBookingFlow = () => {
    setStep('list');
    setSelectedSessionType(null);
    setSelectedOption(null);
    setSelectedTrainer(null);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedPlayer(null);
    setNotes('');
    setTrainerAvailability([]);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    setIsCancelling(true);
    try {
      await bookingsApi.cancel(bookingToCancel.id, cancelReason ? { reason: cancelReason } : undefined);
      await fetchBookings();
      setShowCancelModal(false);
      setBookingToCancel(null);
      setCancelReason('');
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    } finally {
      setIsCancelling(false);
    }
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate || trainerAvailability.length === 0) return [];

    const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const dayAvailability = trainerAvailability.filter(a => a.dayOfWeek === dayOfWeek);

    const slots: string[] = [];
    dayAvailability.forEach(avail => {
      const [startHour] = avail.startTime.split(':').map(Number);
      const [endHour] = avail.endTime.split(':').map(Number);

      for (let hour = startHour; hour < endHour; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    });

    return slots;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  // Booking List View
  if (step === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-velo-black">Bookings</h1>
            <p className="text-gray-500">Manage your training sessions</p>
          </div>
          <Button variant="secondary" onClick={startBooking}>
            + Book Session
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-velo-red px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-velo-black mb-2">No bookings yet</h3>
                <p className="text-gray-500 mb-4">Book your first training session</p>
                <Button variant="secondary" onClick={startBooking}>
                  Book a Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} hover={false}>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-velo-black">{booking.sessionTypeName}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[booking.status]}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {booking.sessionTypeOptionName} • {booking.durationMinutes} min
                      </p>
                      <p className="text-sm text-gray-500">
                        Trainer: {booking.trainerName}
                      </p>
                      {booking.playerName && (
                        <p className="text-sm text-gray-500">Player: {booking.playerName}</p>
                      )}
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-semibold text-gold">
                        {new Date(booking.scheduledAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-sm font-medium text-velo-black mt-1">
                        ${booking.pricePaid.toFixed(2)}
                      </p>
                    </div>
                    {(booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.UNPAID) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBookingToCancel(booking);
                          setShowCancelModal(true);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && bookingToCancel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-velo-black mb-4">Cancel Booking</h3>
              <p className="text-gray-500 mb-4">
                Are you sure you want to cancel your {bookingToCancel.sessionTypeName} session?
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-md mb-4 resize-none"
                rows={3}
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCancelModal(false);
                    setBookingToCancel(null);
                    setCancelReason('');
                  }}
                  className="flex-1"
                >
                  Keep Booking
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCancelBooking}
                  isLoading={isCancelling}
                  className="flex-1"
                >
                  Cancel Booking
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Session Type Selection
  if (step === 'session') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={resetBookingFlow} className="text-gray-500 hover:text-velo-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-velo-black">Select Session Type</h1>
            <p className="text-gray-500">Choose the type of training you want</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessionTypes.map((type) => (
            <Card key={type.id}>
              <CardContent>
                <h3 className="text-lg font-semibold text-velo-black mb-2">{type.name}</h3>
                {type.description && (
                  <p className="text-gray-500 text-sm mb-4">{type.description}</p>
                )}
                <p className="text-sm text-gray-400 mb-4">{type.durationMinutes} minutes</p>

                {type.options && type.options.length > 0 && (
                  <div className="space-y-2">
                    {type.options.filter(o => o.isActive).map((option) => (
                      <button
                        key={option.id}
                        onClick={() => selectSessionOption(type, option)}
                        className="w-full p-3 border border-gray-200 rounded-lg text-left hover:border-gold hover:bg-gold/5 transition-all"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-velo-black">{option.name}</span>
                          <span className="text-gold font-semibold">${option.price}</span>
                        </div>
                        {option.description && (
                          <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Trainer Selection
  if (step === 'trainer') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setStep('session')} className="text-gray-500 hover:text-velo-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-velo-black">Select Trainer</h1>
            <p className="text-gray-500">Choose your trainer for {selectedSessionType?.name}</p>
          </div>
        </div>

        {loadingTrainers ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <Card key={trainer.id}>
                <CardContent>
                  <button
                    onClick={() => selectTrainer(trainer)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center">
                        <span className="text-gold font-bold text-xl">
                          {trainer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-velo-black">{trainer.name}</h3>
                        <p className="text-sm text-gray-500">
                          {trainer.sports.map(s => s.charAt(0) + s.slice(1).toLowerCase()).join(', ')}
                        </p>
                      </div>
                    </div>
                    {trainer.bio && (
                      <p className="text-sm text-gray-500 line-clamp-2">{trainer.bio}</p>
                    )}
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Date/Time Selection
  if (step === 'datetime') {
    const timeSlots = getAvailableTimeSlots();
    const minDate = new Date().toISOString().split('T')[0];

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setStep('trainer')} className="text-gray-500 hover:text-velo-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-velo-black">Select Date & Time</h1>
            <p className="text-gray-500">Choose when to train with {selectedTrainer?.name}</p>
          </div>
        </div>

        {loadingAvailability ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent>
                <h3 className="font-semibold text-velo-black mb-4">Select Date</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime('');
                  }}
                  min={minDate}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                />

                {trainerAvailability.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Trainer's weekly availability:</p>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(trainerAvailability.map(a => a.dayOfWeek))].map(day => (
                        <span key={day} className="text-xs px-2 py-1 bg-gold/10 text-gold rounded">
                          {day.charAt(0) + day.slice(1).toLowerCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-semibold text-velo-black mb-4">Select Time</h3>
                {!selectedDate ? (
                  <p className="text-gray-500 text-center py-8">Select a date first</p>
                ) : timeSlots.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No available times on this day</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === time
                            ? 'bg-gold text-velo-black'
                            : 'bg-gray-100 text-gray-700 hover:bg-gold/20'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Player selection for parents */}
        {hasRole(Role.PARENT) && players.length > 0 && (
          <Card>
            <CardContent>
              <h3 className="font-semibold text-velo-black mb-4">Select Player (Optional)</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPlayer === null
                      ? 'bg-gold text-velo-black'
                      : 'bg-gray-100 text-gray-700 hover:bg-gold/20'
                  }`}
                >
                  Myself
                </button>
                {players.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => setSelectedPlayer(player.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedPlayer === player.id
                        ? 'bg-gold text-velo-black'
                        : 'bg-gray-100 text-gray-700 hover:bg-gold/20'
                    }`}
                  >
                    {player.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button
            variant="secondary"
            onClick={selectDateTime}
            disabled={!selectedDate || !selectedTime}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Confirmation
  if (step === 'confirm') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => setStep('datetime')} className="text-gray-500 hover:text-velo-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-velo-black">Confirm Booking</h1>
            <p className="text-gray-500">Review your booking details</p>
          </div>
        </div>

        <Card>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Session</span>
                <span className="font-medium text-velo-black">{selectedSessionType?.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Option</span>
                <span className="font-medium text-velo-black">{selectedOption?.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Trainer</span>
                <span className="font-medium text-velo-black">{selectedTrainer?.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-velo-black">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Time</span>
                <span className="font-medium text-velo-black">{selectedTime}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium text-velo-black">{selectedSessionType?.durationMinutes} minutes</span>
              </div>
              {selectedPlayer && (
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Player</span>
                  <span className="font-medium text-velo-black">
                    {players.find(p => p.id === selectedPlayer)?.name}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-3 text-lg">
                <span className="font-semibold text-velo-black">Total</span>
                <span className="font-bold text-gold">${selectedOption?.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              <label className="block mb-2 font-semibold text-velo-gray">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or notes for your trainer"
                className="w-full px-4 py-3 border border-gray-300 rounded-md resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={resetBookingFlow} className="flex-1">
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={confirmBooking}
                isLoading={isBooking}
                className="flex-1"
              >
                Confirm Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

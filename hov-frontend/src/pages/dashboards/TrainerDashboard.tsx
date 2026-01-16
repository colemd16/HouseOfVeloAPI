import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { bookingsApi } from '../../api/bookings';
import type { BookingResponse } from '../../types';

export function TrainerDashboard() {
  const { user } = useAuth();
  const [todayBookings, setTodayBookings] = useState<BookingResponse[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const upcoming = await bookingsApi.trainer.getMyUpcoming();

        // Filter for today's sessions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todaySessions = upcoming.filter((b) => {
          const bookingDate = new Date(b.scheduledAt);
          return bookingDate >= today && bookingDate < tomorrow;
        });

        setTodayBookings(todaySessions);
        setUpcomingBookings(upcoming);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gold to-gold-hover rounded-2xl p-8 text-velo-black">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, Coach {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-velo-black/70">
          Here's your schedule for today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Today's Sessions</p>
                <p className="text-3xl font-bold text-gold">{todayBookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">This Week</p>
                <p className="text-3xl font-bold text-gold">{upcomingBookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Manage</p>
                <Link to="/availability">
                  <Button variant="secondary" size="sm" className="mt-2">
                    Set Availability
                  </Button>
                </Link>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card className="border-l-4 border-l-velo-red">
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {todayBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No sessions scheduled for today</p>
              <p className="text-sm text-gray-400 mt-1">Enjoy your day off!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {todayBookings.map((booking) => (
                <li
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <p className="text-lg font-bold text-gold">
                        {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-velo-black">
                        {booking.sessionTypeName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.playerName || booking.userName} • {booking.durationMinutes} min
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    booking.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {booking.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming Sessions</CardTitle>
            <Link to="/schedule">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No upcoming sessions</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {upcomingBookings.slice(0, 5).map((booking) => (
                <li
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-velo-black">
                      {booking.sessionTypeName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.playerName || booking.userName} • {new Date(booking.scheduledAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gold">
                    {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { bookingsApi } from '../../api/bookings';
import type { BookingResponse } from '../../types';

export function PlayerDashboard() {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState<BookingResponse[]>([]);
  const [recentBookings, setRecentBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcoming, all] = await Promise.all([
          bookingsApi.getMyUpcoming(),
          bookingsApi.getMyBookings(),
        ]);
        setUpcomingBookings(upcoming);
        // Get completed sessions for history
        setRecentBookings(
          all.filter((b) => b.status === 'COMPLETED').slice(0, 5)
        );
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
      <div className="bg-gradient-to-r from-velo-red to-velo-black rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Let's train, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-200">
          Track your sessions and keep improving.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Upcoming Sessions</p>
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
                <p className="text-gray-500 text-sm">Completed Sessions</p>
                <p className="text-3xl font-bold text-gold">{recentBookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Quick Actions</p>
                <Link to="/bookings">
                  <Button variant="secondary" size="sm" className="mt-2">
                    View Schedule
                  </Button>
                </Link>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Session */}
      {upcomingBookings.length > 0 && (
        <Card className="border-l-4 border-l-gold">
          <CardHeader>
            <CardTitle>Next Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xl font-bold text-velo-black">
                  {upcomingBookings[0].sessionTypeName}
                </p>
                <p className="text-gray-500">
                  with {upcomingBookings[0].trainerName}
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-lg font-semibold text-gold">
                  {new Date(upcomingBookings[0].scheduledAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-gray-500">
                  {new Date(upcomingBookings[0].scheduledAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Training History</CardTitle>
            <Link to="/bookings">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No completed sessions yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Your training history will appear here
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentBookings.map((booking) => (
                <li
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-velo-black">
                      {booking.sessionTypeName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.scheduledAt).toLocaleDateString()} • {booking.trainerName}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    Completed
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

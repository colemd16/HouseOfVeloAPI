import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { bookingsApi } from '../../api/bookings';
import { sessionTypesApi } from '../../api/sessionTypes';
import type { BookingResponse, SessionTypeResponse } from '../../types';

export function AdminDashboard() {
  const { user } = useAuth();
  const [recentBookings, setRecentBookings] = useState<BookingResponse[]>([]);
  const [sessionTypes, setSessionTypes] = useState<SessionTypeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookings, types] = await Promise.all([
          bookingsApi.admin.getAll(),
          sessionTypesApi.getAll(),
        ]);
        setRecentBookings(bookings.slice(0, 10));
        setSessionTypes(types);
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

  const confirmedBookings = recentBookings.filter((b) => b.status === 'CONFIRMED').length;
  const pendingBookings = recentBookings.filter((b) => b.status === 'UNPAID').length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-velo-black via-velo-gray to-velo-black rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-300">
          Welcome back, {user?.name}. Here's your system overview.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gold">{recentBookings.length}</p>
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
                <p className="text-gray-500 text-sm">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">{confirmedBookings}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <p className="text-gray-500 text-sm">Pending Payment</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingBookings}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <p className="text-gray-500 text-sm">Session Types</p>
                <p className="text-3xl font-bold text-gold">{sessionTypes.length}</p>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/bookings">
              <Button variant="outline" className="w-full">
                Manage Bookings
              </Button>
            </Link>
            <Link to="/admin/session-types">
              <Button variant="outline" className="w-full">
                Session Types
              </Button>
            </Link>
            <Link to="/payments">
              <Button variant="outline" className="w-full">
                View Payments
              </Button>
            </Link>
            <Button
              variant="secondary"
              className="w-full"
              onClick={async () => {
                try {
                  await bookingsApi.admin.autoComplete();
                  window.location.reload();
                } catch (error) {
                  console.error('Failed to auto-complete bookings:', error);
                }
              }}
            >
              Auto-Complete Old
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Link to="/admin/bookings">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">User</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Session</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Trainer</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Date</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.slice(0, 5).map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <p className="font-medium text-velo-black">{booking.userName}</p>
                        {booking.playerName && (
                          <p className="text-xs text-gray-500">Player: {booking.playerName}</p>
                        )}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">
                        {booking.sessionTypeName}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">
                        {booking.trainerName}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">
                        {new Date(booking.scheduledAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-700'
                            : booking.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

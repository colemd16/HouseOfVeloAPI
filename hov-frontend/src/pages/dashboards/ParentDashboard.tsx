import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { playersApi } from '../../api/players';
import { bookingsApi } from '../../api/bookings';
import type { PlayerResponse, BookingResponse } from '../../types';

export function ParentDashboard() {
  const { user } = useAuth();
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersData, bookingsData] = await Promise.all([
          playersApi.getMyPlayers(),
          bookingsApi.getMyUpcoming(),
        ]);
        setPlayers(playersData);
        setUpcomingBookings(bookingsData);
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
      <div className="bg-gradient-to-r from-velo-black to-velo-gray rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-300">
          Manage your players and track their training sessions.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Players</p>
                <p className="text-3xl font-bold text-gold">{players.length}</p>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <p className="text-gray-500 text-sm">Quick Actions</p>
                <Link to="/bookings">
                  <Button variant="secondary" size="sm" className="mt-2">
                    Book Session
                  </Button>
                </Link>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Players Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Players</CardTitle>
              <Link to="/players">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {players.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No players added yet</p>
                <Link to="/players">
                  <Button variant="outline" size="sm">Add Player</Button>
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {players.slice(0, 3).map((player) => (
                  <li
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-velo-black">{player.name}</p>
                      <p className="text-sm text-gray-500">
                        {player.position || 'No position'} {player.age ? `• Age ${player.age}` : ''}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gold/10 text-gold rounded-full">
                      {player.bats ? `Bats ${player.bats}` : 'N/A'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Sessions</CardTitle>
              <Link to="/bookings">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No upcoming sessions</p>
                <Link to="/bookings">
                  <Button variant="outline" size="sm">Book Now</Button>
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {upcomingBookings.slice(0, 3).map((booking) => (
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
      </div>
    </div>
  );
}

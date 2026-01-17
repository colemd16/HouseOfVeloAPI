import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { FullPageSpinner } from './components/ui/Spinner';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Services } from './pages/public/Services';
import { Velocity518 } from './pages/public/Velocity518';
import { Contact } from './pages/public/Contact';

// Auth Pages
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

// Protected Pages
import { Dashboard } from './pages/Dashboard';
import { Players } from './pages/Players';
import { Bookings } from './pages/Bookings';
import { ComingSoon } from './pages/dashboards/ComingSoon';

function App() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <Routes>
      {/* Public Website Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/518-velocity" element={<Velocity518 />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Player Management */}
      <Route
        path="/players"
        element={
          <ProtectedRoute>
            <Layout>
              <Players />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Bookings */}
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <Layout>
              <Bookings />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Placeholder routes - Coming Soon */}
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <Layout>
              <ComingSoon feature="Payments" />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule"
        element={
          <ProtectedRoute>
            <Layout>
              <ComingSoon feature="Schedule" />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/availability"
        element={
          <ProtectedRoute>
            <Layout>
              <ComingSoon feature="Availability Management" />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/session-types"
        element={
          <ProtectedRoute>
            <Layout>
              <ComingSoon feature="Session Types Management" />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute>
            <Layout>
              <ComingSoon feature="Admin Bookings" />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

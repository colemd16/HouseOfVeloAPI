import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { FullPageSpinner } from './components/ui/Spinner';

// Pages
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { ComingSoon } from './pages/dashboards/ComingSoon';

function App() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <Routes>
      {/* Public routes */}
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

      {/* Placeholder routes - Coming Soon */}
      <Route
        path="/players"
        element={
          <ProtectedRoute>
            <Layout>
              <ComingSoon feature="Player Management" />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <Layout>
              <ComingSoon feature="Bookings" />
            </Layout>
          </ProtectedRoute>
        }
      />
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

      {/* Redirect root to dashboard or login */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;

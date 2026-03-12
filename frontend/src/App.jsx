import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

// Seller pages
import SellerDashboard from './pages/seller/SellerDashboard';
import MyListings from './pages/seller/MyListings';
import CreateListing from './pages/seller/CreateListing';
import MyPickups from './pages/seller/MyPickups';
import TrackPickup from './pages/seller/TrackPickup';
import SellerPayments from './pages/seller/SellerPayments';

// Collector pages
import CollectorDashboard from './pages/collector/CollectorDashboard';
import NearbyJobs from './pages/collector/NearbyJobs';
import JobDetails from './pages/collector/JobDetails';
import ActiveJob from './pages/collector/ActiveJob';

function HomeRedirect() {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'collector' ? '/collector' : '/seller'} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Home redirect */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Seller routes */}
          <Route path="/seller" element={<ProtectedRoute roles={['seller']}><SellerDashboard /></ProtectedRoute>} />
          <Route path="/seller/listings" element={<ProtectedRoute roles={['seller']}><MyListings /></ProtectedRoute>} />
          <Route path="/seller/listings/new" element={<ProtectedRoute roles={['seller']}><CreateListing /></ProtectedRoute>} />
          <Route path="/seller/pickups" element={<ProtectedRoute roles={['seller']}><MyPickups /></ProtectedRoute>} />
          <Route path="/seller/pickups/:id/track" element={<ProtectedRoute roles={['seller']}><TrackPickup /></ProtectedRoute>} />
          <Route path="/seller/payments" element={<ProtectedRoute roles={['seller']}><SellerPayments /></ProtectedRoute>} />

          {/* Collector routes */}
          <Route path="/collector" element={<ProtectedRoute roles={['collector']}><CollectorDashboard /></ProtectedRoute>} />
          <Route path="/collector/nearby" element={<ProtectedRoute roles={['collector']}><NearbyJobs /></ProtectedRoute>} />
          <Route path="/collector/jobs/:id" element={<ProtectedRoute roles={['collector']}><JobDetails /></ProtectedRoute>} />
          <Route path="/collector/active" element={<ProtectedRoute roles={['collector']}><ActiveJob /></ProtectedRoute>} />

          {/* Profile — any authenticated user */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

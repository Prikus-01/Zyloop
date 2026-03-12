import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Recycle, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" id="navbar-logo">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Recycle size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              RecycleHub
            </span>
          </Link>

          {/* Right side */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-100 transition-colors text-sm text-surface-600"
                id="navbar-profile-link"
              >
                <User size={16} />
                <span className="hidden sm:inline">{user.name}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 capitalize">
                  {user.role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 text-surface-500 hover:text-red-600 transition-colors"
                id="navbar-logout-btn"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary text-sm" id="navbar-login-btn">Log in</Link>
              <Link to="/signup" className="btn-primary text-sm" id="navbar-signup-btn">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

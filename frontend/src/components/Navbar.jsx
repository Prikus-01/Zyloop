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
    <nav
      className="sticky top-0 z-40 w-full"
      style={{
        background: 'linear-gradient(90deg, #0E2016 0%, #112A18 100%)',
        borderBottom: '1px solid rgba(52,211,153,0.12)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      }}
    >
      {/* Dot-grid texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.5,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-3">

            <Link
              to="/"
              className="group flex items-center gap-2.5"
              id="navbar-logo"
              style={{ textDecoration: 'none' }}
            >
              <div
                className="group-hover:scale-105 transition-transform duration-300"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #34d399, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(52,211,153,0.3)',
                  flexShrink: 0,
                }}
              >
                <Recycle size={18} color="white" className="group-hover:rotate-180 transition-transform duration-700" />
              </div>
              <span
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '-0.025em',
                }}
              >
                RecycleHub
              </span>
            </Link>
          </div>

          {/* Right side */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">

              {/* Profile pill */}
              <Link
                to="/profile"
                id="navbar-profile-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 12px 5px 6px',
                  borderRadius: 40,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.13)';
                  e.currentTarget.style.borderColor = 'rgba(52,211,153,0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #34d399, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <User size={14} color="white" />
                </div>
                <span
                  className="hidden sm:inline"
                  style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}
                >
                  {user.name}
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    background: 'rgba(52,211,153,0.18)',
                    color: '#34d399',
                    textTransform: 'capitalize',
                    letterSpacing: '0.03em',
                  }}
                >
                  {user.role}
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                id="navbar-logout-btn"
                title="Logout"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.07)',
                  border: 'none',
                  color: 'rgba(255,255,255,0.45)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
                  e.currentTarget.style.color = '#f87171';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                }}
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                id="navbar-login-btn"
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  background: 'rgba(255,255,255,0.07)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                }}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                id="navbar-signup-btn"
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'white',
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(16,185,129,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.3)';
                }}
              >
                Sign up
              </Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}

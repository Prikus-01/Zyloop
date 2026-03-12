import { NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Package, Plus, Truck, MapPin,
  CreditCard, User, Briefcase, Recycle,
} from 'lucide-react';

const sellerNav = [
  {
    section: 'Overview',
    links: [
      { to: '/seller', icon: LayoutDashboard, label: 'Dashboard', end: true },
    ],
  },
  {
    section: 'Manage',
    links: [
      { to: '/seller/listings', icon: Package, label: 'My Listings' },
      { to: '/seller/listings/new', icon: Plus, label: 'Create Listing' },
      { to: '/seller/pickups', icon: Truck, label: 'My Pickups' },
      { to: '/seller/payments', icon: CreditCard, label: 'Payments' },
    ],
  },
  {
    section: 'Account',
    links: [
      { to: '/profile', icon: User, label: 'Profile' },
    ],
  },
];

const collectorNav = [
  {
    section: 'Overview',
    links: [
      { to: '/collector', icon: LayoutDashboard, label: 'Dashboard', end: true },
    ],
  },
  {
    section: 'Jobs',
    links: [
      { to: '/collector/nearby', icon: MapPin, label: 'Nearby Jobs' },
      { to: '/collector/active', icon: Briefcase, label: 'My Jobs' },
    ],
  },
  {
    section: 'Account',
    links: [
      { to: '/profile', icon: User, label: 'Profile' },
    ],
  },
];

// Icon colors per route for personality
const iconAccents = {
  '/seller':           { bg: 'rgba(16,185,129,0.12)',  color: '#10b981' },
  '/seller/listings':  { bg: 'rgba(99,102,241,0.12)',  color: '#6366f1' },
  '/seller/listings/new': { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  '/seller/pickups':   { bg: 'rgba(249,115,22,0.12)',  color: '#f97316' },
  '/seller/payments':  { bg: 'rgba(52,211,153,0.12)',  color: '#34d399' },
  '/collector':        { bg: 'rgba(16,185,129,0.12)',  color: '#10b981' },
  '/collector/nearby': { bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6' },
  '/collector/active': { bg: 'rgba(249,115,22,0.12)',  color: '#f97316' },
  '/profile':          { bg: 'rgba(139,92,246,0.12)',  color: '#8b5cf6' },
};

function getInitials(name = '') {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function Sidebar() {
  const { user } = useAuth();
  const nav = user?.role === 'collector' ? collectorNav : sellerNav;
  const isSeller = user?.role !== 'collector';

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div
        className="sticky top-24 flex flex-col overflow-hidden"
        style={{
          borderRadius: 20,
          background: '#FDFCF9',
          border: '1.5px solid #E8E0D4',
          boxShadow: '0 8px 32px rgba(0,0,0,0.07)',
        }}
      >
        {/* Brand header */}
        <div
          style={{
            padding: '20px 20px 16px',
            background: 'linear-gradient(135deg, #0E2016, #142E1C)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #34d399, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(52,211,153,0.25)',
              flexShrink: 0,
            }}
          >
            <Recycle size={18} color="white" />
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: 'white',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              RecycleHub
            </p>
            <span
              style={{
                display: 'inline-block',
                marginTop: 3,
                padding: '2px 8px',
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                background: isSeller ? 'rgba(52,211,153,0.2)' : 'rgba(59,130,246,0.2)',
                color: isSeller ? '#34d399' : '#60a5fa',
              }}
            >
              {user?.role}
            </span>
          </div>
        </div>

        {/* Navigation sections */}
        <nav style={{ padding: '12px 10px', flex: 1 }}>
          {nav.map((group, gi) => (
            <div key={group.section} style={{ marginBottom: gi < nav.length - 1 ? 8 : 0 }}>
              {/* Section label */}
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#C4BAB0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '6px 12px 4px',
                }}
              >
                {group.section}
              </p>

              {group.links.map((link, i) => {
                const accent = iconAccents[link.to] || { bg: 'rgba(0,0,0,0.06)', color: '#9B8F80' };
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    id={`sidebar-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className="animate-fade-in"
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: 11,
                      padding: '9px 12px',
                      borderRadius: 11,
                      fontSize: 13.5,
                      fontWeight: isActive ? 650 : 500,
                      textDecoration: 'none',
                      marginBottom: 2,
                      transition: 'all 0.15s ease',
                      animationDelay: `${(gi * 3 + i) * 0.04}s`,
                      color: isActive ? '#0E2016' : '#6B5F52',
                      background: isActive ? 'white' : 'transparent',
                      boxShadow: isActive ? '0 2px 10px rgba(0,0,0,0.07), inset 3px 0 0 ' + accent.color : 'none',
                    })}
                    onMouseEnter={(e) => {
                      if (e.currentTarget.style.boxShadow.includes('inset')) return;
                      e.currentTarget.style.background = 'rgba(255,255,255,0.7)';
                      e.currentTarget.style.color = '#0E2016';
                    }}
                    onMouseLeave={(e) => {
                      if (e.currentTarget.style.boxShadow.includes('inset')) return;
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#6B5F52';
                    }}
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 9,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isActive ? accent.bg : 'rgba(0,0,0,0.04)',
                            flexShrink: 0,
                            transition: 'background 0.15s ease',
                          }}
                        >
                          <link.icon size={16} color={isActive ? accent.color : '#A89880'} />
                        </div>
                        <span style={{ flex: 1 }}>{link.label}</span>
                        {isActive && (
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: accent.color,
                              boxShadow: `0 0 6px ${accent.color}`,
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}

              {/* Section divider */}
              {gi < nav.length - 1 && (
                <div style={{ height: 1, background: '#EAE3D8', margin: '8px 12px 4px' }} />
              )}
            </div>
          ))}
        </nav>

        {/* User card footer */}
        <div
          style={{
            margin: '4px 10px 10px',
            padding: '12px 14px',
            borderRadius: 12,
            background: 'white',
            border: '1px solid #E8E0D4',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {/* Avatar with initials */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #112A18, #0E2016)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: '#34d399',
              letterSpacing: '-0.01em',
              border: '2px solid rgba(52,211,153,0.2)',
            }}
          >
            {getInitials(user?.name)}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 650,
                color: '#0E2016',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.3,
              }}
            >
              {user?.name}
            </p>
            <p
              style={{
                fontSize: 11,
                color: '#A89880',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.3,
              }}
            >
              {user?.email}
            </p>
          </div>
        </div>

      </div>
    </aside>
  );
}

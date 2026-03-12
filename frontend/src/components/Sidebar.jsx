import { NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Package, Plus, Truck, MapPin,
  CreditCard, User, Navigation, Briefcase
} from 'lucide-react';

const sellerLinks = [
  { to: '/seller', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/seller/listings', icon: Package, label: 'My Listings' },
  { to: '/seller/listings/new', icon: Plus, label: 'Create Listing' },
  { to: '/seller/pickups', icon: Truck, label: 'My Pickups' },
  { to: '/seller/payments', icon: CreditCard, label: 'Payments' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const collectorLinks = [
  { to: '/collector', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/collector/nearby', icon: MapPin, label: 'Nearby Jobs' },
  { to: '/collector/active', icon: Briefcase, label: 'My Jobs' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === 'collector' ? collectorLinks : sellerLinks;

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="glass-card p-4 sticky top-20" style={{ background: 'rgba(255,255,255,0.85)' }}>
        <div className="mb-4 px-3">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
            {user?.role === 'collector' ? 'Collector' : 'Seller'} Menu
          </p>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-surface-600 hover:bg-surface-50 hover:text-surface-800'
                }`
              }
              id={`sidebar-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { pickupsAPI } from '../../api/api';
import { MapPin, Truck, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function CollectorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ nearby: 0, active: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const nearbyRes = await pickupsAPI.getNearby(pos.coords.latitude, pos.coords.longitude);
            setStats((s) => ({ ...s, nearby: (nearbyRes.data.pickups || []).length }));
          } catch {}
          setLoading(false);
        },
        () => setLoading(false)
      );
    } else {
      setLoading(false);
    }
  }, []);

  const kpis = [
    { label: 'Nearby Jobs', value: stats.nearby, icon: MapPin, color: 'from-blue-400 to-blue-600', link: '/collector/nearby' },
    { label: 'Active Job', value: stats.active, icon: Truck, color: 'from-orange-400 to-orange-600', link: '/collector/active' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'from-emerald-400 to-emerald-600', link: '/collector/active' },
  ];

  return (
    <DashboardLayout>
      {/* Greeting */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-surface-800">
          {getGreeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-surface-500 text-sm mt-1">Find nearby pickups and manage your jobs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <Link
            to={kpi.link}
            key={kpi.label}
            className={`stat-card p-5 flex items-center gap-4 animate-fade-in-up stagger-${i + 1}`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shrink-0 shadow-md`}>
              <kpi.icon size={22} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-800">{loading ? '—' : kpi.value}</p>
              <p className="text-xs text-surface-500 font-medium">{kpi.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="glass-card-static p-8 text-center animate-fade-in-up stagger-4">
        <div className="empty-state-icon">
          <MapPin size={36} className="text-primary-400" />
        </div>
        <h3 className="text-lg font-semibold text-surface-700 mb-2">Ready to collect?</h3>
        <p className="text-surface-400 text-sm mb-5 max-w-sm mx-auto">
          Browse nearby pickup requests and start earning while helping the environment
        </p>
        <Link to="/collector/nearby" className="btn-primary text-base">
          <MapPin size={16} /> Find Nearby Jobs <ArrowRight size={14} />
        </Link>
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { pickupsAPI } from '../../api/api';
import { MapPin, Truck, CheckCircle } from 'lucide-react';

export default function CollectorDashboard() {
  const [stats, setStats] = useState({ nearby: 0, active: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get user location for nearby count
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
    { label: 'Nearby Jobs', value: stats.nearby, icon: MapPin, color: 'from-blue-400 to-blue-600' },
    { label: 'Active Job', value: stats.active, icon: Truck, color: 'from-orange-400 to-orange-600' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'from-emerald-400 to-emerald-600' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-800">Collector Dashboard</h1>
        <p className="text-surface-500 text-sm mt-1">Find nearby pickups and manage your jobs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="glass-card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shrink-0`}>
              <kpi.icon size={22} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-800">{loading ? '—' : kpi.value}</p>
              <p className="text-xs text-surface-500 font-medium">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 text-center">
        <MapPin size={48} className="mx-auto text-surface-300 mb-4" />
        <h3 className="text-lg font-semibold text-surface-600 mb-2">Ready to collect?</h3>
        <p className="text-surface-400 text-sm mb-4">Browse nearby pickup requests and start earning</p>
        <a href="/collector/nearby" className="btn-primary">
          <MapPin size={16} /> Find Nearby Jobs
        </a>
      </div>
    </DashboardLayout>
  );
}

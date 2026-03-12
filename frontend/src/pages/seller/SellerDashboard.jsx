import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { listingsAPI, pickupsAPI, paymentsAPI } from '../../api/api';
import { Package, Truck, CreditCard, TrendingUp } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

export default function SellerDashboard() {
  const [stats, setStats] = useState({ listings: 0, activePickups: 0, earnings: 0 });
  const [recentPickups, setRecentPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [listingsRes, pickupsRes, paymentsRes] = await Promise.all([
          listingsAPI.getByCurrentSeller(),
          pickupsAPI.getSellerPickups(),
          paymentsAPI.getHistory(),
        ]);
        const listings = listingsRes.data.listings || [];
        const pickups = pickupsRes.data.pickups || [];
        const payments = paymentsRes.data.payments || [];

        setStats({
          listings: listings.length,
          activePickups: pickups.filter((p) => !['completed', 'cancelled'].includes(p.status)).length,
          earnings: payments.filter((p) => p.status === 'succeeded').reduce((s, p) => s + parseFloat(p.amount || 0), 0),
        });
        setRecentPickups(pickups.slice(0, 5));
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, []);

  const kpis = [
    { label: 'Total Listings', value: stats.listings, icon: Package, color: 'from-blue-400 to-blue-600' },
    { label: 'Active Pickups', value: stats.activePickups, icon: Truck, color: 'from-amber-400 to-amber-600' },
    { label: 'Total Earnings', value: `₹${stats.earnings.toFixed(2)}`, icon: CreditCard, color: 'from-emerald-400 to-emerald-600' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-800">Seller Dashboard</h1>
        <p className="text-surface-500 text-sm mt-1">Overview of your recycling activity</p>
      </div>

      {/* KPI Cards */}
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

      {/* Recent Pickups */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-bold text-surface-800 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-primary-500" /> Recent Pickups
        </h2>
        {recentPickups.length === 0 ? (
          <p className="text-surface-400 text-sm py-6 text-center">No pickup requests yet</p>
        ) : (
          <div className="space-y-3">
            {recentPickups.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-50/60 hover:bg-surface-100/80 transition-colors">
                <div>
                  <p className="font-semibold text-sm text-surface-800">{p.material_name}</p>
                  <p className="text-xs text-surface-500">{p.quantity} {p.unit} · {p.pickup_address}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

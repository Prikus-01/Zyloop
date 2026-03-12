import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { listingsAPI, pickupsAPI, paymentsAPI } from '../../api/api';
import { Package, Truck, CreditCard, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function SellerDashboard() {
  const { user } = useAuth();
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
    { label: 'Active Listings', value: stats.listings, icon: Package, bgColor: '#10b981', link: '/seller/listings' },
    { label: 'In Progress', value: stats.activePickups, icon: Truck, bgColor: '#f59e0b', link: '/seller/pickups' },
    { label: 'Total Earnings', value: `₹${stats.earnings.toFixed(2)}`, icon: CreditCard, bgColor: '#059669', link: '/seller/payments' },
  ];

  return (
    <DashboardLayout>
      {/* Greeting Section */}
      <div className="mb-10 animate-fade-in">
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, color: '#0E2016', letterSpacing: '-0.02em', marginBottom: 6, overflow: 'visible' }}>
          {getGreeting()}, <span style={{ color: '#34d399' }}>{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p style={{ color: '#9B8F80', fontSize: 15 }}>Here's an overview of your recycling activity today</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {kpis.map((kpi, i) => (
          <Link
            to={kpi.link}
            key={kpi.label}
            className="animate-fade-in-up transition-transform hover:scale-105 cursor-pointer"
            style={{
              animationDelay: `${0.05 + i * 0.1}s`,
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, ${kpi.bgColor}, ${kpi.bgColor}dd)`,
                borderRadius: 18,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                boxShadow: `0 12px 32px -6px ${kpi.bgColor}40`,
                transition: 'box-shadow 0.3s ease, transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 18px 48px -8px ${kpi.bgColor}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 12px 32px -6px ${kpi.bgColor}40`;
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                    {kpi.label}
                  </div>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: loading ? 24 : 32, fontWeight: 800, color: 'white', letterSpacing: '-0.02em', whiteSpace: 'nowrap', display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    {loading ? '—' : (
                      typeof kpi.value === 'string' && kpi.value.startsWith('₹')
                        ? <><span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75em', fontWeight: 700, lineHeight: 1 }}>₹</span><span>{kpi.value.slice(1)}</span></>
                        : kpi.value
                    )}
                  </div>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <kpi.icon size={22} color="white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Pickups Section */}
      <div
        style={{
          borderRadius: 18,
          background: '#F8F5EE',
          padding: '28px 32px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          border: '1px solid rgba(16,185,129,0.1)',
          animation: 'fade-in-up 0.6s ease-out both',
          animationDelay: '0.3s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #34d399, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(52,211,153,0.3)',
              }}
            >
              <TrendingUp size={20} color="white" />
            </div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700, color: '#0E2016', letterSpacing: '-0.01em' }}>
              Recent Pickups
            </h2>
          </div>
          {recentPickups.length > 0 && (
            <Link
              to="/seller/pickups"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                color: '#059669',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#047857')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#059669')}
            >
              View all <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {recentPickups.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 40, paddingBottom: 40 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(52,211,153,0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Truck size={36} color="#9B8F80" />
            </div>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, color: '#5C5244', marginBottom: 8 }}>
              No pickups yet
            </h3>
            <p style={{ color: '#9B8F80', fontSize: 14, marginBottom: 20 }}>
              Create your first listing to get pickup requests
            </p>
            <Link
              to="/seller/listings/new"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
              }}
            >
              Create Listing
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentPickups.map((p, i) => (
              <div
                key={p.id}
                className="animate-fade-in"
                style={{
                  padding: '16px 20px',
                  borderRadius: 14,
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #E2D9CC',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  animationDelay: `${0.05 + i * 0.08}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(52,211,153,0.03)';
                  e.currentTarget.style.borderColor = '#34d399';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#E2D9CC';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'rgba(245,158,11,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Truck size={18} color="#f59e0b" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0E2016', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.material_name}
                    </p>
                    <p style={{ fontSize: 12, color: '#9B8F80', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.quantity} {p.unit} · {p.pickup_address}
                    </p>
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

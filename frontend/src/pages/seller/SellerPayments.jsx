import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { paymentsAPI } from '../../api/api';
import { CreditCard, IndianRupee, TrendingUp } from 'lucide-react';

export default function SellerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentsAPI.getHistory()
      .then((res) => setPayments(res.data.payments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = payments.filter((p) => p.status === 'succeeded').reduce((s, p) => s + parseFloat(p.amount || 0), 0);

  return (
    <DashboardLayout>
      <div className="mb-10 animate-fade-in">
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, color: '#0E2016', letterSpacing: '-0.02em', marginBottom: 4 }}>
          Payments & Earnings
        </h1>
        <p style={{ color: '#9B8F80', fontSize: 14 }}>Your payment history and total earnings</p>
      </div>

      {/* Total Earnings Card */}
      <div
        className="animate-fade-in-up mb-10"
        style={{
          borderRadius: 18,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          padding: '32px 36px',
          boxShadow: '0 12px 32px -6px rgba(16,185,129,0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            flexShrink: 0,
          }}
        >
          <IndianRupee size={28} color="white" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <TrendingUp size={16} color="rgba(255,255,255,0.7)" />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Total Earnings
            </span>
          </div>
          <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 40, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
            ₹{total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payment History */}
      {loading ? (
        <LoadingSpinner />
      ) : payments.length === 0 ? (
        <div
          style={{
            borderRadius: 18,
            background: '#F8F5EE',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            border: '1px solid #E2D9CC',
            animation: 'fade-in-up 0.6s ease-out both',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(52,211,153,0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <CreditCard size={40} color="#9B8F80" />
          </div>
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700, color: '#0E2016', marginBottom: 8 }}>
            No payments yet
          </h3>
          <p style={{ color: '#9B8F80', fontSize: 14 }}>
            Your payment history will appear here once you complete pickups
          </p>
        </div>
      ) : (
        <div
          className="animate-fade-in-up"
          style={{
            borderRadius: 18,
            background: '#F8F5EE',
            border: '1px solid #E2D9CC',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #E2D9CC' }}>
                  <th style={{ textAlign: 'left', padding: '18px 24px', fontWeight: 700, color: '#5C5244', fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Material
                  </th>
                  <th style={{ textAlign: 'left', padding: '18px 24px', fontWeight: 700, color: '#5C5244', fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Amount
                  </th>
                  <th style={{ textAlign: 'left', padding: '18px 24px', fontWeight: 700, color: '#5C5244', fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'none' }}
                      className="sm:table-cell">
                    Status
                  </th>
                  <th style={{ textAlign: 'left', padding: '18px 24px', fontWeight: 700, color: '#5C5244', fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'none' }}
                      className="sm:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: i < payments.length - 1 ? '1px solid #EAE3D8' : 'none',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(16,185,129,0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: '#0E2016' }}>
                      {p.material_name}
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: 700, color: '#34d399', fontSize: 15 }}>
                      ₹{parseFloat(p.amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 24px', display: 'none' }} className="sm:table-cell">
                      <StatusBadge status={p.status} />
                    </td>
                    <td style={{ padding: '16px 24px', color: '#9B8F80', fontSize: 13, display: 'none' }} className="sm:table-cell">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

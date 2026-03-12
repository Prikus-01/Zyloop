import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { paymentsAPI } from '../../api/api';
import { CreditCard, IndianRupee } from 'lucide-react';

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-800">Payments</h1>
        <p className="text-surface-500 text-sm mt-1">Your payment history and earnings</p>
      </div>

      {/* Total Earnings Card */}
      <div className="glass-card p-6 mb-6 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(59,130,246,0.05) 100%)' }}>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
          <IndianRupee size={24} className="text-white" />
        </div>
        <div>
          <p className="text-xs text-surface-500 font-medium uppercase tracking-wider">Total Earnings</p>
          <p className="text-3xl font-bold text-surface-800">₹{total.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : payments.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <CreditCard size={48} className="mx-auto text-surface-300 mb-4" />
          <p className="text-surface-500">No payments yet</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100">
                <th className="text-left p-4 font-semibold text-surface-600">Material</th>
                <th className="text-left p-4 font-semibold text-surface-600">Amount</th>
                <th className="text-left p-4 font-semibold text-surface-600">Status</th>
                <th className="text-left p-4 font-semibold text-surface-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                  <td className="p-4 font-medium text-surface-800">{p.material_name}</td>
                  <td className="p-4 font-bold text-surface-800">₹{parseFloat(p.amount).toFixed(2)}</td>
                  <td className="p-4"><StatusBadge status={p.status} /></td>
                  <td className="p-4 text-surface-500">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

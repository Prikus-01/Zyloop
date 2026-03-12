import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { pickupsAPI } from '../../api/api';
import { ArrowLeft, MapPin, Clock, User, Package, Recycle } from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const load = () => {
    pickupsAPI.track(id)
      .then((res) => setPickup(res.data.tracking))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleStart = async () => {
    setActionLoading(true);
    try {
      await pickupsAPI.start(id);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed');
    }
    setActionLoading(false);
  };

  const handleComplete = async () => {
    setActionLoading(true);
    try {
      await pickupsAPI.complete(id, {});
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed');
    }
    setActionLoading(false);
  };

  return (
    <DashboardLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-surface-500 hover:text-surface-700 mb-4 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      {loading ? (
        <LoadingSpinner />
      ) : !pickup ? (
        <div className="glass-card-static p-8 text-center">
          <p className="text-surface-500">Job not found</p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card-static p-6">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-xl font-bold text-surface-800">Job Details</h1>
              <StatusBadge status={pickup.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-50 transition-colors hover:bg-surface-100">
                <MapPin size={18} className="text-surface-400 shrink-0" />
                <div>
                  <p className="text-xs text-surface-400 font-medium">Address</p>
                  <p className="text-sm text-surface-700">{pickup.pickup_address || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-50 transition-colors hover:bg-surface-100">
                <Clock size={18} className="text-surface-400 shrink-0" />
                <div>
                  <p className="text-xs text-surface-400 font-medium">Scheduled</p>
                  <p className="text-sm text-surface-700">{pickup.scheduled_at ? new Date(pickup.scheduled_at).toLocaleString() : '—'}</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-surface-100">
              {pickup.status === 'assigned' && (
                <button onClick={handleStart} disabled={actionLoading} className="btn-primary flex-1 justify-center" id="start-job-btn">
                  {actionLoading ? (
                    <span className="flex items-center gap-2"><Recycle size={16} className="animate-spin" /> Starting…</span>
                  ) : (
                    '🚀 Start Pickup'
                  )}
                </button>
              )}
              {pickup.status === 'in_progress' && (
                <button onClick={handleComplete} disabled={actionLoading} className="btn-primary flex-1 justify-center" id="complete-job-btn"
                  style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                  {actionLoading ? (
                    <span className="flex items-center gap-2"><Recycle size={16} className="animate-spin" /> Completing…</span>
                  ) : (
                    '✅ Complete Pickup'
                  )}
                </button>
              )}
              {pickup.status === 'completed' && (
                <div className="flex-1 text-center p-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold animate-scale-in">
                  ✅ Job completed!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

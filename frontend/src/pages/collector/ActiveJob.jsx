import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { pickupsAPI, collectorsAPI } from '../../api/api';
import { Truck, MapPin, Clock, User, Phone, Play, CheckCircle, Navigation } from 'lucide-react';

export default function ActiveJob() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [sharing, setSharing] = useState(false);
  const navigate = useNavigate();

  const loadJobs = () => {
    pickupsAPI.getCollectorJobs()
      .then((res) => setJobs(res.data.pickups || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadJobs(); }, []);

  // Auto-share location while on this page
  useEffect(() => {
    let interval;
    if (sharing && navigator.geolocation) {
      const send = () => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            collectorsAPI.updateLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }).catch(() => {});
          },
          () => {}
        );
      };
      send();
      interval = setInterval(send, 15000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [sharing]);

  const handleStart = async (id) => {
    setActionLoading(id);
    try {
      await pickupsAPI.start(id);
      setSharing(true); // Start location sharing when job starts
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to start');
    }
    setActionLoading(null);
  };

  const handleComplete = async (id) => {
    setActionLoading(id);
    try {
      await pickupsAPI.complete(id, {});
      setSharing(false);
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to complete');
    }
    setActionLoading(null);
  };

  const activeJobs = jobs.filter((j) => ['assigned', 'in_progress'].includes(j.status));
  const completedJobs = jobs.filter((j) => j.status === 'completed');

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-800">My Jobs</h1>
        <p className="text-surface-500 text-sm mt-1">Manage your accepted pickups</p>
      </div>

      {/* Location sharing indicator */}
      {sharing && (
        <div className="mb-4 p-3 rounded-xl bg-primary-50 border border-primary-100 flex items-center gap-2 text-primary-700 text-sm font-medium">
          <Navigation size={16} className="animate-pulse" /> Sharing your location every 15s…
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : activeJobs.length === 0 && completedJobs.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Truck size={48} className="mx-auto text-surface-300 mb-4" />
          <h3 className="text-lg font-semibold text-surface-600 mb-2">No jobs yet</h3>
          <p className="text-surface-400 text-sm mb-4">Accept a pickup from Nearby Jobs to get started</p>
          <button onClick={() => navigate('/collector/nearby')} className="btn-primary">
            <MapPin size={16} /> Find Nearby Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Jobs */}
          {activeJobs.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-surface-800 mb-3">Active Jobs</h2>
              <div className="grid gap-4">
                {activeJobs.map((job) => (
                  <div key={job.id} className="glass-card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          job.status === 'in_progress' ? 'bg-orange-100' : 'bg-blue-100'
                        }`}>
                          <Truck size={20} className={job.status === 'in_progress' ? 'text-orange-600' : 'text-blue-600'} />
                        </div>
                        <div>
                          <p className="font-semibold text-surface-800">{job.material_name}</p>
                          <p className="text-xs text-surface-500 mt-0.5">
                            {job.quantity} {job.unit} · Est. ₹{parseFloat(job.estimated_price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-surface-500 p-2 rounded-lg bg-surface-50">
                        <MapPin size={14} /> {job.pickup_address || 'No address'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-surface-500 p-2 rounded-lg bg-surface-50">
                        <Clock size={14} /> {job.scheduled_at ? new Date(job.scheduled_at).toLocaleString() : '—'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-surface-500 p-2 rounded-lg bg-surface-50">
                        <User size={14} /> Seller: {job.seller_name}
                      </div>
                      {job.seller_phone && (
                        <div className="flex items-center gap-2 text-xs text-surface-500 p-2 rounded-lg bg-surface-50">
                          <Phone size={14} /> {job.seller_phone}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-3 border-t border-surface-100">
                      {job.status === 'assigned' && (
                        <button
                          onClick={() => handleStart(job.id)}
                          disabled={actionLoading === job.id}
                          className="btn-primary flex-1 justify-center"
                          id={`start-job-${job.id}`}
                        >
                          <Play size={16} /> {actionLoading === job.id ? 'Starting…' : 'Start Pickup'}
                        </button>
                      )}
                      {job.status === 'in_progress' && (
                        <button
                          onClick={() => handleComplete(job.id)}
                          disabled={actionLoading === job.id}
                          className="btn-primary flex-1 justify-center"
                          id={`complete-job-${job.id}`}
                          style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                        >
                          <CheckCircle size={16} /> {actionLoading === job.id ? 'Completing…' : 'Complete Pickup'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Jobs */}
          {completedJobs.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-surface-800 mb-3">Completed ({completedJobs.length})</h2>
              <div className="grid gap-3">
                {completedJobs.slice(0, 10).map((job) => (
                  <div key={job.id} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <CheckCircle size={16} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-surface-800 text-sm">{job.material_name}</p>
                        <p className="text-xs text-surface-500">{job.quantity} {job.unit} · {job.seller_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-surface-800 text-sm">₹{parseFloat(job.estimated_price || 0).toFixed(2)}</p>
                      <p className="text-xs text-surface-400">{new Date(job.completed_at || job.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

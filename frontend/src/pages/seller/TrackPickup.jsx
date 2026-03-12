import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { pickupsAPI } from '../../api/api';
import { ArrowLeft, MapPin, Navigation, Clock, User } from 'lucide-react';

export default function TrackPickup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTracking = () => {
    pickupsAPI.track(id)
      .then((res) => setTracking(res.data.tracking))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTracking();
    const interval = setInterval(loadTracking, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [id]);

  return (
    <DashboardLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-surface-500 hover:text-surface-700 mb-4">
        <ArrowLeft size={16} /> Back to Pickups
      </button>

      {loading ? (
        <LoadingSpinner />
      ) : !tracking ? (
        <div className="glass-card p-8 text-center">
          <p className="text-surface-500">Pickup not found</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-surface-800">Pickup Tracking</h1>
              <StatusBadge status={tracking.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50">
                <MapPin size={18} className="text-surface-400" />
                <div>
                  <p className="text-xs text-surface-400 font-medium">Pickup Address</p>
                  <p className="text-sm text-surface-700">{tracking.pickup_address || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50">
                <Clock size={18} className="text-surface-400" />
                <div>
                  <p className="text-xs text-surface-400 font-medium">Scheduled</p>
                  <p className="text-sm text-surface-700">{tracking.scheduled_at ? new Date(tracking.scheduled_at).toLocaleString() : '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Collector info */}
          {tracking.collector_name && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-surface-800 mb-3 flex items-center gap-2">
                <User size={18} className="text-primary-500" /> Collector
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User size={18} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-surface-800">{tracking.collector_name}</p>
                  {tracking.collector_lat && tracking.collector_lon && (
                    <p className="text-xs text-surface-500 flex items-center gap-1 mt-0.5">
                      <Navigation size={10} /> Location: {tracking.collector_lat.toFixed(4)}, {tracking.collector_lon.toFixed(4)}
                      {tracking.location_updated_at && (
                        <span className="ml-2">· Updated {new Date(tracking.location_updated_at).toLocaleTimeString()}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-surface-800 mb-4">Status Timeline</h2>
            <div className="space-y-4">
              {['requested', 'assigned', 'in_progress', 'completed'].map((step, i) => {
                const statuses = ['requested', 'assigned', 'in_progress', 'completed'];
                const currentIdx = statuses.indexOf(tracking.status);
                const isComplete = i <= currentIdx;
                const isCurrent = i === currentIdx;

                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                      ${isComplete ? 'bg-primary-500 text-white' : 'bg-surface-200 text-surface-400'}
                      ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}>
                      {isComplete ? '✓' : i + 1}
                    </div>
                    <p className={`text-sm font-medium capitalize ${isComplete ? 'text-surface-800' : 'text-surface-400'}`}>
                      {step.replace('_', ' ')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

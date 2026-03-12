import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { pickupsAPI } from '../../api/api';
import { MapPin, Navigation, Clock, Package } from 'lucide-react';

export default function NearbyJobs() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(null);
  const navigate = useNavigate();

  const loadNearby = (lat, lon) => {
    pickupsAPI.getNearby(lat, lon)
      .then((res) => setPickups(res.data.pickups || []))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load nearby pickups'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadNearby(pos.coords.latitude, pos.coords.longitude),
        () => {
          setError('Location access needed. Using default location.');
          loadNearby(12.9716, 77.5946);
        }
      );
    } else {
      loadNearby(12.9716, 77.5946);
    }
  }, []);

  const handleAccept = async (id) => {
    setAccepting(id);
    try {
      await pickupsAPI.accept(id);
      navigate('/collector/active');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to accept');
      setAccepting(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-surface-800">Nearby Jobs</h1>
        <p className="text-surface-500 text-sm mt-1">Pickup requests near your location</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-sm animate-fade-in">{error}</div>
      )}

      {loading ? (
        <LoadingSpinner text="Finding nearby pickups..." />
      ) : pickups.length === 0 ? (
        <div className="glass-card-static p-12 text-center animate-fade-in-up">
          <div className="empty-state-icon">
            <MapPin size={36} className="text-surface-300" />
          </div>
          <h3 className="text-lg font-semibold text-surface-600 mb-2">No nearby pickups</h3>
          <p className="text-surface-400 text-sm">Check back later for new pickup requests</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {pickups.map((p, i) => (
            <div key={p.id} className={`glass-card p-5 animate-fade-in stagger-${Math.min(i + 1, 8)}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Package size={20} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-surface-800">{p.material_name}</p>
                    <p className="text-xs text-surface-500 mt-0.5">
                      {p.quantity} {p.unit} · Est. ₹{parseFloat(p.estimated_price || 0).toFixed(2)}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-surface-400">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {p.pickup_address || `${p.lat?.toFixed(3)}, ${p.lon?.toFixed(3)}`}</span>
                      {p.distance_km && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 font-semibold">
                          <Navigation size={10} /> {parseFloat(p.distance_km).toFixed(1)} km
                        </span>
                      )}
                      <span className="flex items-center gap-1"><Clock size={12} /> {p.scheduled_at ? new Date(p.scheduled_at).toLocaleDateString() : '—'}</span>
                    </div>
                    <p className="text-xs text-surface-500 mt-1.5">Seller: {p.seller_name}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAccept(p.id)}
                  disabled={accepting === p.id}
                  className="btn-primary shrink-0"
                  id={`accept-job-${p.id}`}
                >
                  {accepting === p.id ? 'Accepting…' : 'Accept'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

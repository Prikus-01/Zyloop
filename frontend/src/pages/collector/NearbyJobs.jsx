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
      // Redirect to active jobs page after accepting
      navigate('/collector/active');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to accept');
      setAccepting(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-800">Nearby Jobs</h1>
        <p className="text-surface-500 text-sm mt-1">Pickup requests near your location</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-sm">{error}</div>
      )}

      {loading ? (
        <LoadingSpinner text="Finding nearby pickups..." />
      ) : pickups.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <MapPin size={48} className="mx-auto text-surface-300 mb-4" />
          <h3 className="text-lg font-semibold text-surface-600 mb-2">No nearby pickups</h3>
          <p className="text-surface-400 text-sm">Check back later for new pickup requests</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pickups.map((p) => (
            <div key={p.id} className="glass-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Package size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-surface-800">{p.material_name}</p>
                    <p className="text-xs text-surface-500 mt-0.5">
                      {p.quantity} {p.unit} · Est. ₹{parseFloat(p.estimated_price || 0).toFixed(2)}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-surface-400">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {p.pickup_address || `${p.lat?.toFixed(3)}, ${p.lon?.toFixed(3)}`}</span>
                      {p.distance_km && (
                        <span className="flex items-center gap-1 text-primary-600 font-medium">
                          <Navigation size={12} /> {parseFloat(p.distance_km).toFixed(1)} km away
                        </span>
                      )}
                      <span className="flex items-center gap-1"><Clock size={12} /> {p.scheduled_at ? new Date(p.scheduled_at).toLocaleDateString() : '—'}</span>
                    </div>
                    <p className="text-xs text-surface-500 mt-1">Seller: {p.seller_name}</p>
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

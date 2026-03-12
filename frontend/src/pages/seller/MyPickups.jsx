import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { pickupsAPI, listingsAPI } from '../../api/api';
import { useForm } from 'react-hook-form';
import { Truck, Plus, MapPin, Clock, Loader2 } from 'lucide-react';

export default function MyPickups() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);
  const [listings, setListings] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [geoStatus, setGeoStatus] = useState('idle');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const loadPickups = () => {
    pickupsAPI.getSellerPickups()
      .then((res) => setPickups(res.data.pickups || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPickups();
    listingsAPI.getByCurrentSeller()
      .then((res) => setListings((res.data.listings || []).filter((l) => l.status === 'open')))
      .catch(() => {});
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setGeoStatus('success');
      },
      () => setGeoStatus('error')
    );
  };

  // Auto-detect when modal opens
  useEffect(() => {
    if (showSchedule && geoStatus === 'idle') {
      detectLocation();
    }
  }, [showSchedule]);

  const onSchedule = async (data) => {
    setSubmitLoading(true);
    try {
      await pickupsAPI.create({
        listing_id: data.listing_id,
        scheduled_at: new Date(data.scheduled_at).toISOString(),
        pickup_address: data.pickup_address,
        ...(coords.lat && coords.lon ? { lat: coords.lat, lon: coords.lon } : {}),
      });
      setShowSchedule(false);
      reset();
      loadPickups();
    } catch {}
    setSubmitLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-800">My Pickups</h1>
          <p className="text-surface-500 text-sm mt-1">Track your scheduled pickups</p>
        </div>
        <button onClick={() => setShowSchedule(true)} className="btn-primary" id="schedule-pickup-btn">
          <Plus size={16} /> Schedule Pickup
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : pickups.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Truck size={48} className="mx-auto text-surface-300 mb-4" />
          <h3 className="text-lg font-semibold text-surface-600 mb-2">No pickups yet</h3>
          <p className="text-surface-400 text-sm">Schedule a pickup from your listings</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pickups.map((p) => (
            <div key={p.id} className="glass-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Truck size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-surface-800">{p.material_name}</p>
                    <p className="text-xs text-surface-500 mt-0.5">
                      {p.quantity} {p.unit} · Est. ₹{parseFloat(p.estimated_price || 0).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-surface-400">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {p.pickup_address}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {p.scheduled_at ? new Date(p.scheduled_at).toLocaleDateString() : '—'}</span>
                    </div>
                    {p.collector_name && (
                      <p className="text-xs text-primary-600 font-medium mt-1">Collector: {p.collector_name}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={p.status} />
                  {['assigned', 'in_progress'].includes(p.status) && (
                    <Link to={`/seller/pickups/${p.id}/track`} className="text-xs font-semibold text-primary-600 hover:text-primary-700" id={`track-${p.id}`}>
                      Track →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Pickup Modal */}
      <Modal isOpen={showSchedule} onClose={() => setShowSchedule(false)} title="Schedule Pickup">
        <form onSubmit={handleSubmit(onSchedule)} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="pickup-listing">Listing</label>
            <select id="pickup-listing" className="input-field" {...register('listing_id', { required: 'Select a listing' })}>
              <option value="">Select listing…</option>
              {listings.map((l) => (
                <option key={l.id} value={l.id}>{l.material_name} — {l.quantity} {l.unit}</option>
              ))}
            </select>
            {errors.listing_id && <p className="text-red-500 text-xs mt-1">{errors.listing_id.message}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="pickup-date">Pickup Date & Time</label>
            <input id="pickup-date" type="datetime-local" className="input-field"
              {...register('scheduled_at', { required: 'Select date/time' })} />
            {errors.scheduled_at && <p className="text-red-500 text-xs mt-1">{errors.scheduled_at.message}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="pickup-address">Pickup Address</label>
            <input id="pickup-address" type="text" className="input-field" placeholder="Full address"
              {...register('pickup_address', { required: 'Address is required' })} />
            {errors.pickup_address && <p className="text-red-500 text-xs mt-1">{errors.pickup_address.message}</p>}
          </div>

          {/* Location status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-surface-100">
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className={geoStatus === 'success' ? 'text-primary-500' : 'text-surface-400'} />
              {geoStatus === 'loading' && (
                <span className="text-surface-500 flex items-center gap-1">
                  <Loader2 size={14} className="animate-spin" /> Detecting…
                </span>
              )}
              {geoStatus === 'success' && (
                <span className="text-primary-600 font-medium">
                  📍 {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}
                </span>
              )}
              {geoStatus === 'error' && <span className="text-amber-600">Location unavailable</span>}
              {geoStatus === 'idle' && <span className="text-surface-500">No location</span>}
            </div>
            {geoStatus !== 'loading' && (
              <button type="button" onClick={detectLocation} className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                {geoStatus === 'success' ? 'Refresh' : 'Detect'}
              </button>
            )}
          </div>

          <button type="submit" disabled={submitLoading} className="btn-primary w-full justify-center py-3" id="schedule-pickup-submit">
            {submitLoading ? 'Scheduling…' : 'Schedule Pickup'}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

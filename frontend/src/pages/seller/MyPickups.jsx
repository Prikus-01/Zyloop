import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { pickupsAPI, listingsAPI } from '../../api/api';
import { useForm } from 'react-hook-form';
import { Truck, Plus, MapPin, Clock, Loader2, Recycle, ArrowRight } from 'lucide-react';
import Pagination from '../../components/Pagination';

const PAGE_SIZE = 4;

export default function MyPickups() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
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

  useEffect(() => {
    if (showSchedule && geoStatus === 'idle') {
      detectLocation();
    }
  }, [showSchedule]);

  const totalPages = Math.ceil(pickups.length / PAGE_SIZE);
  const paginated = pickups.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
      {/* Header */}
      <div className="flex items-center justify-between mb-10 animate-fade-in">
        <div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, color: '#0E2016', letterSpacing: '-0.02em', marginBottom: 4 }}>
            My Pickups
          </h1>
          <p style={{ color: '#9B8F80', fontSize: 14 }}>Track your scheduled pickups and assignments</p>
        </div>
        <button
          onClick={() => setShowSchedule(true)}
          id="schedule-pickup-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 20px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(16,185,129,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.3)';
          }}
        >
          <Plus size={16} /> Schedule Pickup
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : pickups.length === 0 ? (
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
              background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Truck size={40} color="#f59e0b" />
          </div>
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700, color: '#0E2016', marginBottom: 10 }}>
            No pickups yet
          </h3>
          <p style={{ color: '#9B8F80', fontSize: 14, marginBottom: 28 }}>
            Schedule a pickup from your open listings
          </p>
          <button
            onClick={() => setShowSchedule(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
            }}
          >
            <Plus size={16} /> Schedule Now
          </button>
        </div>
      ) : (
        <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {paginated.map((p, i) => (
            <div
              key={p.id}
              className="animate-fade-in"
              style={{
                borderRadius: 14,
                background: '#F8F5EE',
                padding: '20px 24px',
                border: '1.5px solid #E2D9CC',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                animationDelay: `${Math.min(i * 0.06, 0.3)}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFFBF6';
                e.currentTarget.style.borderColor = '#34d399';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(52,211,153,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F8F5EE';
                e.currentTarget.style.borderColor = '#E2D9CC';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(245,158,11,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Truck size={20} color="#f59e0b" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#0E2016', marginBottom: 6 }}>
                    {p.material_name}
                  </p>
                  <p style={{ fontSize: 13, color: '#9B8F80', marginBottom: 10 }}>
                    {p.quantity} {p.unit} · Est. ₹{parseFloat(p.estimated_price || 0).toFixed(2)}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: '#9B8F80' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={13} /> {p.pickup_address}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={13} /> {p.scheduled_at ? new Date(p.scheduled_at).toLocaleDateString() : '—'}
                    </span>
                  </div>
                  {p.collector_name && (
                    <p style={{ fontSize: 12, color: '#34d399', fontWeight: 600, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399' }} />
                      {p.collector_name}
                    </p>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <StatusBadge status={p.status} />
                {['assigned', 'in_progress'].includes(p.status) && (
                  <Link
                    to={`/seller/pickups/${p.id}/track`}
                    id={`track-${p.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#059669',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#047857')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#059669')}
                  >
                    Track <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Schedule Pickup Modal */}
      <Modal isOpen={showSchedule} onClose={() => setShowSchedule(false)} title="Schedule a Pickup">
        <form onSubmit={handleSubmit(onSchedule)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Listing */}
          <div>
            <label className="auth-label" htmlFor="pickup-listing">Select Listing</label>
            <select
              id="pickup-listing"
              className="auth-input"
              style={{ background: 'white' }}
              {...register('listing_id', { required: 'Select a listing' })}
            >
              <option value="">Choose a listing…</option>
              {listings.map((l) => (
                <option key={l.id} value={l.id}>{l.material_name} — {l.quantity} {l.unit}</option>
              ))}
            </select>
            {errors.listing_id && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 5 }}>{errors.listing_id.message}</p>}
          </div>

          {/* Date & Address side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="auth-label" htmlFor="pickup-date">Date & Time</label>
              <input
                id="pickup-date"
                type="datetime-local"
                className="auth-input"
                style={{ background: 'white' }}
                {...register('scheduled_at', { required: 'Select date/time' })}
              />
              {errors.scheduled_at && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 5 }}>{errors.scheduled_at.message}</p>}
            </div>
            <div>
              <label className="auth-label" htmlFor="pickup-address">Pickup Address</label>
              <input
                id="pickup-address"
                type="text"
                className="auth-input"
                placeholder="Full address"
                {...register('pickup_address', { required: 'Address is required' })}
              />
              {errors.pickup_address && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 5 }}>{errors.pickup_address.message}</p>}
            </div>
          </div>

          {/* GPS Location */}
          <div
            style={{
              borderRadius: 14,
              border: `1.5px solid ${geoStatus === 'success' ? 'rgba(52,211,153,0.4)' : geoStatus === 'error' ? 'rgba(239,68,68,0.25)' : '#E2D9CC'}`,
              background: geoStatus === 'success' ? 'rgba(52,211,153,0.06)' : geoStatus === 'error' ? 'rgba(239,68,68,0.04)' : 'white',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: geoStatus === 'success' ? 'rgba(52,211,153,0.15)' : 'rgba(0,0,0,0.05)',
              }}>
                {geoStatus === 'loading'
                  ? <Loader2 size={16} color="#34d399" className="animate-spin" />
                  : <MapPin size={16} color={geoStatus === 'success' ? '#34d399' : geoStatus === 'error' ? '#f87171' : '#9B8F80'} />
                }
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9B8F80', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                  GPS Location
                </p>
                {geoStatus === 'idle' && <p style={{ fontSize: 13, color: '#9B8F80' }}>Not detected yet</p>}
                {geoStatus === 'loading' && <p style={{ fontSize: 13, color: '#9B8F80' }}>Detecting your location…</p>}
                {geoStatus === 'success' && (
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#059669' }}>
                    {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}
                  </p>
                )}
                {geoStatus === 'error' && <p style={{ fontSize: 13, color: '#f87171' }}>Could not detect location</p>}
              </div>
            </div>
            {geoStatus !== 'loading' && (
              <button
                type="button"
                onClick={detectLocation}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  border: '1.5px solid',
                  borderColor: geoStatus === 'success' ? 'rgba(52,211,153,0.4)' : '#E2D9CC',
                  background: 'white',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#059669',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(16,185,129,0.06)';
                  e.currentTarget.style.borderColor = '#34d399';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = geoStatus === 'success' ? 'rgba(52,211,153,0.4)' : '#E2D9CC';
                }}
              >
                {geoStatus === 'success' ? 'Refresh' : 'Detect'}
              </button>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#EAE3D8', margin: '0 -4px' }} />

          {/* Submit */}
          <button type="submit" disabled={submitLoading} className="auth-submit-btn" id="schedule-pickup-submit">
            {submitLoading ? (
              <><Recycle size={16} className="animate-spin" /><span>Scheduling…</span></>
            ) : (
              <><Truck size={16} /><span>Schedule Pickup</span></>
            )}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

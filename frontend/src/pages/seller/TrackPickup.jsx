import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { pickupsAPI } from '../../api/api';
import { ArrowLeft, MapPin, Navigation, Clock, User, CheckCircle2 } from 'lucide-react';

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
    const interval = setInterval(loadTracking, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const steps = ['requested', 'assigned', 'in_progress', 'completed'];

  return (
    <DashboardLayout>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: '#9B8F80',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginBottom: 32,
          padding: '6px 0',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#5C5244')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#9B8F80')}
      >
        <ArrowLeft size={16} /> Back to Pickups
      </button>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : !tracking ? (
        <div
          style={{
            borderRadius: 18,
            background: '#F8F5EE',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            border: '1px solid #E2D9CC',
          }}
        >
          <p style={{ color: '#9B8F80' }}>Pickup not found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fade-in 0.5s ease-out' }}>
          {/* Header Card */}
          <div
            style={{
              borderRadius: 18,
              background: '#F8F5EE',
              padding: '28px 32px',
              border: '1px solid #E2D9CC',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 700, color: '#0E2016', letterSpacing: '-0.01em' }}>
              Pickup Tracking
            </h1>
            <StatusBadge status={tracking.status} />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Pickup Address */}
            <div
              style={{
                borderRadius: 14,
                background: '#F8F5EE',
                padding: '20px 24px',
                border: '1.5px solid #E2D9CC',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#34d399';
                e.currentTarget.style.background = '#FFFBF6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2D9CC';
                e.currentTarget.style.background = '#F8F5EE';
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(16,185,129,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MapPin size={18} color="#34d399" />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#9B8F80', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  Pickup Address
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0E2016' }}>
                  {tracking.pickup_address || '—'}
                </p>
              </div>
            </div>

            {/* Scheduled Time */}
            <div
              style={{
                borderRadius: 14,
                background: '#F8F5EE',
                padding: '20px 24px',
                border: '1.5px solid #E2D9CC',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#34d399';
                e.currentTarget.style.background = '#FFFBF6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2D9CC';
                e.currentTarget.style.background = '#F8F5EE';
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(16,185,129,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Clock size={18} color="#34d399" />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#9B8F80', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  Scheduled
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0E2016' }}>
                  {tracking.scheduled_at ? new Date(tracking.scheduled_at).toLocaleString() : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Collector Info */}
          {tracking.collector_name && (
            <div
              style={{
                borderRadius: 18,
                background: 'linear-gradient(135deg, rgba(52,211,153,0.06), rgba(16,185,129,0.06))',
                padding: '24px 28px',
                border: '1.5px solid rgba(16,185,129,0.15)',
                animation: 'fade-in-up 0.5s ease-out both',
                animationDelay: '0.1s',
              }}
            >
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, color: '#0E2016', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={18} color="#34d399" /> Assigned Collector
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #34d399, #10b981)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(52,211,153,0.2)',
                  }}
                >
                  <User size={20} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#0E2016', marginBottom: 4 }}>
                    {tracking.collector_name}
                  </p>
                  {tracking.collector_lat && tracking.collector_lon && (
                    <p style={{ fontSize: 12, color: '#9B8F80', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Navigation size={12} color="#34d399" /> {tracking.collector_lat.toFixed(4)}, {tracking.collector_lon.toFixed(4)}
                      {tracking.location_updated_at && (
                        <span style={{ marginLeft: 8, color: '#C4BAB0' }}>
                          · Updated {new Date(tracking.location_updated_at).toLocaleTimeString()}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div
            style={{
              borderRadius: 18,
              background: '#F8F5EE',
              padding: '28px 32px',
              border: '1px solid #E2D9CC',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              animation: 'fade-in-up 0.5s ease-out both',
              animationDelay: '0.2s',
            }}
          >
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700, color: '#0E2016', marginBottom: 28 }}>
              Status Timeline
            </h2>
            <div style={{ position: 'relative', paddingLeft: 32 }}>
              {steps.map((step, i) => {
                const currentIdx = steps.indexOf(tracking.status);
                const isComplete = i <= currentIdx;
                const isCurrent = i === currentIdx;
                const isLast = i === steps.length - 1;

                return (
                  <div
                    key={step}
                    className="animate-fade-in"
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      paddingBottom: 28,
                      animationDelay: `${0.05 + i * 0.08}s`,
                    }}
                  >
                    {/* Connector line */}
                    {!isLast && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 14,
                          top: 36,
                          width: 2,
                          height: 'calc(100% + 28px)',
                          background: isComplete
                            ? 'linear-gradient(to bottom, #34d399, #10b981)'
                            : '#E2D9CC',
                          transition: 'background 0.3s ease',
                        }}
                      />
                    )}
                    {/* Status dot */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 10,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                        transition: 'all 0.3s ease',
                        background: isComplete ? '#34d399' : '#E2D9CC',
                        color: isComplete ? 'white' : '#9B8F80',
                        boxShadow: isCurrent ? '0 0 0 8px rgba(52,211,153,0.15)' : 'none',
                        transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {isComplete ? <CheckCircle2 size={16} /> : i + 1}
                    </div>
                    {/* Label */}
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: isComplete ? 600 : 500,
                        color: isComplete ? '#0E2016' : '#9B8F80',
                        textTransform: 'capitalize',
                        transition: 'all 0.3s ease',
                      }}
                    >
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

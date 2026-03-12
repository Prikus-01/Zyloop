import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Recycle, Eye, EyeOff, Package, Truck, ArrowRight } from 'lucide-react';

/* Botanical mandala — mirrored from LoginPage */
function BotanicalDecor() {
  const leaves = [0, 60, 120, 180, 240, 300];
  return (
    <svg
      viewBox="0 0 300 300"
      className="absolute pointer-events-none select-none"
      style={{ width: 340, height: 340, top: '-6%', right: '-14%', opacity: 0.07 }}
      aria-hidden
    >
      <circle cx="150" cy="150" r="128" fill="none" stroke="#4ade80" strokeWidth="0.7" />
      <circle cx="150" cy="150" r="96"  fill="none" stroke="#4ade80" strokeWidth="0.5" />
      <circle cx="150" cy="150" r="64"  fill="none" stroke="#4ade80" strokeWidth="0.4" />
      <circle cx="150" cy="150" r="32"  fill="none" stroke="#4ade80" strokeWidth="0.4" />
      {leaves.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = 150 + 128 * Math.cos(rad);
        const y2 = 150 + 128 * Math.sin(rad);
        return (
          <g key={angle}>
            <line x1="150" y1="150" x2={x2} y2={y2} stroke="#4ade80" strokeWidth="0.4" />
            <path
              d="M150,22 C168,52 168,92 150,112 C132,92 132,52 150,22 Z"
              fill="none"
              stroke="#4ade80"
              strokeWidth="0.7"
              transform={`rotate(${angle + 90}, 150, 150)`}
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: 'seller' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const user = await signup(data);
      navigate(user.role === 'collector' ? '/collector' : '/seller');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{ background: '#0C1B10', fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 720, height: 720,
            top: '-18%', left: '-12%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 65%)',
            animation: 'orb-float-1 28s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 480, height: 480,
            bottom: '-12%', right: '-8%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%)',
            animation: 'orb-float-2 34s ease-in-out infinite',
          }}
        />
      </div>

      {/* Main card */}
      <div
        className="w-full max-w-[1080px] flex flex-col lg:flex-row relative z-10 animate-slide-up"
        style={{
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >

        {/* ── LEFT PANEL ─────────────────────────────────────── */}
        <div
          className="lg:w-1/2 p-10 lg:p-14 flex flex-col relative overflow-hidden"
          style={{ background: 'linear-gradient(155deg, #112A18 0%, #091608 100%)' }}
        >
          {/* Dot-grid texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
              opacity: 0.35,
            }}
          />
          {/* Corner accent */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: 0, left: 0, width: 200, height: 200,
              background: 'radial-gradient(circle at 0% 0%, rgba(52,211,153,0.12) 0%, transparent 70%)',
            }}
          />

          <BotanicalDecor />

          {/* Top section */}
          <div className="relative z-10">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 group mb-8 block" style={{ textDecoration: 'none' }}>
              <div
                className="group-hover:scale-105 transition-transform duration-300"
                style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'linear-gradient(135deg, #34d399, #059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(52,211,153,0.28)',
                  flexShrink: 0,
                }}
              >
                <Recycle size={22} color="white" className="group-hover:rotate-180 transition-transform duration-700" />
              </div>
              <span
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 20, fontWeight: 700, color: 'white', letterSpacing: '-0.025em',
                }}
              >
                RecycleHub
              </span>
            </Link>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 'clamp(34px, 3.5vw, 44px)',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                marginBottom: 16,
              }}
            >
              Join the<br />
              <span style={{ color: '#34d399' }}>green</span>
              <br />
              movement
            </h1>

            <p
              className="hidden lg:block"
              style={{
                color: 'rgba(255,255,255,0.48)',
                fontSize: 14.5, lineHeight: 1.75,
                marginBottom: 28, maxWidth: 264,
              }}
            >
              Complete your profile, choose your role, and start making an impact from day one.
            </p>

            {/* Feature bullets */}
            <div className="flex flex-col" style={{ gap: 15 }}>
              {[
                'List recyclable materials',
                'Schedule door-step pickups',
                'Get paid for every batch',
              ].map((label, i) => (
                <div
                  key={label}
                  className="animate-fade-in flex items-center"
                  style={{ gap: 13, animationDelay: `${0.35 + i * 0.12}s` }}
                >
                  <div
                    style={{
                      width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                      background: '#34d399',
                      boxShadow: '0 0 9px rgba(52,211,153,0.65)',
                    }}
                  />
                  <span style={{ color: 'rgba(255,255,255,0.62)', fontSize: 14, fontWeight: 500 }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div
            className="relative z-10 flex mt-auto"
            style={{
              gap: 44, marginTop: 32,
              paddingTop: 24,
              borderTop: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {[
              { val: '10K+', label: 'Members' },
              { val: '98%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.val}>
                <div
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 30, fontWeight: 800,
                    color: '#FCD34D',
                    letterSpacing: '-0.025em', lineHeight: 1,
                  }}
                >
                  {stat.val}
                </div>
                <div
                  style={{
                    fontSize: 10.5, fontWeight: 700,
                    color: 'rgba(255,255,255,0.32)',
                    textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 5,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────── */}
        <div
          className="w-full lg:w-1/2 flex items-center justify-center p-10 sm:p-14 lg:p-16"
          style={{ background: '#F8F5EE' }}
        >
          <div className="w-full max-w-lg">

            {/* Heading */}
            <div style={{ marginBottom: 32 }}>
              <h2
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 30, fontWeight: 700,
                  color: '#0E2016',
                  letterSpacing: '-0.025em', marginBottom: 8,
                }}
              >
                Create an account
              </h2>
              <p style={{ color: '#9B8F80', fontSize: 14, lineHeight: 1.65 }}>
                Join RecycleHub today to start recycling and earning.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                className="animate-fade-in"
                style={{
                  marginBottom: 24, padding: '13px 16px', borderRadius: 10,
                  background: '#FEF2F2', border: '1px solid #FECACA',
                  color: '#DC2626', fontSize: 13,
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}
              >
                <div style={{ marginTop: 4, width: 6, height: 6, borderRadius: '50%', background: '#DC2626', flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Role selector */}
              <div className="animate-fade-in stagger-1">
                <label className="auth-label">Choose Account Type</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      value: 'seller',
                      Icon: Package,
                      label: 'Seller',
                      desc: 'List & get paid',
                      selectedClass: 'selected-seller',
                      iconColor: '#059669',
                      iconBg: 'rgba(16,185,129,0.12)',
                    },
                    {
                      value: 'collector',
                      Icon: Truck,
                      label: 'Collector',
                      desc: 'Collect & earn',
                      selectedClass: 'selected-collector',
                      iconColor: '#2563eb',
                      iconBg: 'rgba(59,130,246,0.12)',
                    },
                  ].map((opt) => {
                    const isSelected = selectedRole === opt.value;
                    return (
                      <label key={opt.value} className="cursor-pointer">
                        <input
                          type="radio"
                          value={opt.value}
                          {...register('role', { required: true })}
                          className="sr-only"
                        />
                        <div
                          className={`auth-role-card ${isSelected ? opt.selectedClass : ''}`}
                          style={{ flexDirection: 'row', padding: '13px 16px', gap: 12, alignItems: 'center' }}
                        >
                          <div
                            style={{
                              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                              background: isSelected ? opt.iconBg : 'rgba(0,0,0,0.05)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'background 0.2s ease',
                            }}
                          >
                            <opt.Icon
                              size={18}
                              color={isSelected ? opt.iconColor : '#9B8F80'}
                              style={{ transition: 'color 0.2s ease' }}
                            />
                          </div>
                          <div style={{ textAlign: 'left' }}>
                            <span
                              style={{
                                display: 'block',
                                fontFamily: "'Bricolage Grotesque', sans-serif",
                                fontSize: 13.5, fontWeight: 700,
                                color: isSelected ? '#0E2016' : '#5C5244',
                                letterSpacing: '-0.01em',
                                marginBottom: 1,
                              }}
                            >
                              {opt.label}
                            </span>
                            <span style={{ fontSize: 11.5, color: '#9B8F80', fontWeight: 500 }}>
                              {opt.desc}
                            </span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="animate-fade-in stagger-2">
                  <label className="auth-label" htmlFor="signup-name">Full Name</label>
                  <input
                    id="signup-name"
                    type="text"
                    className="auth-input"
                    placeholder="Jane Smith"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && (
                    <p style={{ color: '#DC2626', fontSize: 12, marginTop: 5, fontWeight: 500 }}>
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="animate-fade-in stagger-3">
                  <label className="auth-label" htmlFor="signup-email">Email Address</label>
                  <input
                    id="signup-email"
                    type="email"
                    className="auth-input"
                    placeholder="you@example.com"
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && (
                    <p style={{ color: '#DC2626', fontSize: 12, marginTop: 5, fontWeight: 500 }}>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone + Password row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="animate-fade-in stagger-4">
                  <label className="auth-label" htmlFor="signup-phone">Phone Number</label>
                  <input
                    id="signup-phone"
                    type="tel"
                    className="auth-input"
                    placeholder="+91 98765 43210"
                    {...register('phone')}
                  />
                </div>
                <div className="animate-fade-in stagger-5">
                  <label className="auth-label" htmlFor="signup-password">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="signup-password"
                      type={showPass ? 'text' : 'password'}
                      className="auth-input"
                      style={{ paddingRight: 44 }}
                      placeholder="Min 6 characters"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Min 6 characters' },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#C4BAB0', padding: 4, display: 'flex',
                      }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p style={{ color: '#DC2626', fontSize: 12, marginTop: 5, fontWeight: 500 }}>
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="animate-fade-in stagger-6" style={{ paddingTop: 6 }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="auth-submit-btn"
                  id="signup-submit-btn"
                >
                  {loading ? (
                    <><Recycle size={16} className="animate-spin" /><span>Creating account…</span></>
                  ) : (
                    <><span>Create your account</span><ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </form>

            {/* Sign in link */}
            <div
              className="animate-fade-in stagger-7"
              style={{
                marginTop: 24, textAlign: 'center',
                paddingTop: 22, borderTop: '1px solid #EAE3D8',
              }}
            >
              <p style={{ fontSize: 14, color: '#9B8F80' }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{ fontWeight: 700, color: '#0E2016', textDecoration: 'none' }}
                  id="signup-to-login"
                >
                  Sign in
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

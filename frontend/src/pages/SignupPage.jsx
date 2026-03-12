import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Recycle, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { role: 'seller' },
  });

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
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="glass-card w-full max-w-md p-8 animate-fade-in" style={{ background: 'rgba(255,255,255,0.9)' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Recycle size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-surface-800">Create your account</h1>
          <p className="text-surface-500 mt-1 text-sm">Join RecycleHub and start recycling</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm" id="signup-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role selector */}
          <div>
            <label className="form-label">I want to</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'seller', label: '♻️ Sell materials', desc: 'List items & get paid' },
                { value: 'collector', label: '🚚 Collect materials', desc: 'Pick up & earn' },
              ].map((option) => (
                <label
                  key={option.value}
                  className="relative cursor-pointer"
                  id={`signup-role-${option.value}`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    {...register('role', { required: true })}
                    className="peer sr-only"
                  />
                  <div className="p-3 rounded-xl border-2 border-surface-200 peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-all text-center">
                    <span className="text-sm font-semibold block">{option.label}</span>
                    <span className="text-xs text-surface-500 block mt-0.5">{option.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              type="text"
              className="input-field"
              placeholder="John Doe"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              className="input-field"
              placeholder="you@example.com"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="signup-phone">Phone (optional)</label>
            <input
              id="signup-phone"
              type="tel"
              className="input-field"
              placeholder="+91 98765 43210"
              {...register('phone')}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="signup-password">Password</label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPass ? 'text' : 'password'}
                className="input-field pr-10"
                placeholder="Min 6 characters"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3"
            id="signup-submit-btn"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-surface-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700" id="signup-to-login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

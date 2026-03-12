import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { profileAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { User, Save, CheckCircle, Recycle } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    profileAPI.get()
      .then((res) => {
        setProfile(res.data.profile);
        reset(res.data.profile);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    setSuccess('');
    try {
      if (navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
          );
          data.lat = pos.coords.latitude;
          data.lon = pos.coords.longitude;
        } catch {
          // Location denied or unavailable — skip silently
        }
      }
      const res = await profileAPI.update(data);
      setProfile(res.data.profile);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {}
    setSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-surface-800">Profile</h1>
        <p className="text-surface-500 text-sm mt-1">Manage your account information</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="glass-card-static p-6 max-w-xl animate-slide-up">
          {/* Avatar & role */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-surface-100">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <User size={28} className="text-white" />
              </div>
              {/* Gradient ring on hover */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 opacity-0 group-hover:opacity-30 blur-sm transition-opacity animate-gradient" />
            </div>
            <div>
              <p className="text-lg font-bold text-surface-800">{user?.name}</p>
              <p className="text-sm text-surface-500">{user?.email}</p>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 capitalize">
                {user?.role}
              </span>
            </div>
          </div>

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm flex items-center gap-2 animate-slide-up">
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4 animate-fade-in stagger-1">
              <div>
                <label className="form-label" htmlFor="profile-name">Full Name</label>
                <input id="profile-name" type="text" className="input-field" {...register('name')} />
              </div>
              <div>
                <label className="form-label" htmlFor="profile-phone">Phone</label>
                <input id="profile-phone" type="tel" className="input-field" {...register('phone')} />
              </div>
            </div>

            <div className="animate-fade-in stagger-2">
              <label className="form-label" htmlFor="profile-address">Address</label>
              <input id="profile-address" type="text" className="input-field" {...register('address')} />
            </div>

            <div className="grid grid-cols-3 gap-4 animate-fade-in stagger-3">
              <div>
                <label className="form-label" htmlFor="profile-city">City</label>
                <input id="profile-city" type="text" className="input-field" {...register('city')} />
              </div>
              <div>
                <label className="form-label" htmlFor="profile-state">State</label>
                <input id="profile-state" type="text" className="input-field" {...register('state')} />
              </div>
              <div>
                <label className="form-label" htmlFor="profile-pincode">Pincode</label>
                <input id="profile-pincode" type="text" className="input-field" {...register('pincode')} />
              </div>
            </div>

            <div className="animate-fade-in stagger-4 pt-2">
              <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-3" id="profile-save-btn">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Recycle size={16} className="animate-spin" /> Saving…
                  </span>
                ) : (
                  <><Save size={16} /> Save Profile</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}

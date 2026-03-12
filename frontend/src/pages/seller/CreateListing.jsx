import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../../components/DashboardLayout';
import { materialsAPI, listingsAPI } from '../../api/api';
import { Package, ArrowLeft, Recycle, Check } from 'lucide-react';

export default function CreateListing() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    materialsAPI.list()
      .then((res) => setMaterials(res.data.materials || []))
      .catch(() => {});
  }, []);

  const selectedMaterial = materials.find((m) => m.id === parseInt(watch('material_id')));
  const quantity = parseFloat(watch('quantity')) || 0;
  const estimatedPrice = selectedMaterial?.rate_per_unit ? (parseFloat(selectedMaterial.rate_per_unit) * quantity).toFixed(2) : '—';

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await listingsAPI.create({
        material_id: parseInt(data.material_id),
        quantity: parseFloat(data.quantity),
        unit: data.unit || 'kg',
        notes: data.notes,
        pickup_address: data.pickup_address,
      });
      navigate('/seller/listings');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

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
        <ArrowLeft size={16} /> Back
      </button>

      {/* Form Container */}
      <div
        style={{
          borderRadius: 18,
          background: '#F8F5EE',
          padding: '36px 40px',
          maxWidth: 520,
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          border: '1px solid #E2D9CC',
          animation: 'slide-up 0.5s ease-out',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16,185,129,0.25)',
            }}
          >
            <Package size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 700, color: '#0E2016', letterSpacing: '-0.01em' }}>
              Create Listing
            </h1>
            <p style={{ fontSize: 13, color: '#9B8F80', marginTop: 2 }}>
              List your recyclables for pickup
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="animate-fade-in"
            style={{
              marginBottom: 20,
              padding: '13px 16px',
              borderRadius: 12,
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626', flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Material Select */}
          <div className="animate-fade-in stagger-1">
            <label className="auth-label" htmlFor="material-select">Material Type</label>
            <select
              id="material-select"
              className="auth-input"
              style={{ background: 'white' }}
              {...register('material_id', { required: 'Select a material' })}
            >
              <option value="">Select a material…</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — ₹{parseFloat(m.rate_per_unit || 0).toFixed(2)}/{m.unit}
                </option>
              ))}
            </select>
            {errors.material_id && (
              <p style={{ color: '#DC2626', fontSize: 12, marginTop: 5, fontWeight: 500 }}>
                {errors.material_id.message}
              </p>
            )}
          </div>

          {/* Quantity & Unit Grid */}
          <div className="grid grid-cols-2 gap-5 animate-fade-in stagger-2">
            <div>
              <label className="auth-label" htmlFor="quantity-input">Quantity</label>
              <input
                id="quantity-input"
                type="number"
                step="0.1"
                min="0.1"
                className="auth-input"
                placeholder="e.g. 5"
                {...register('quantity', { required: 'Required', min: { value: 0.1, message: 'Min 0.1' } })}
              />
              {errors.quantity && (
                <p style={{ color: '#DC2626', fontSize: 12, marginTop: 5, fontWeight: 500 }}>
                  {errors.quantity.message}
                </p>
              )}
            </div>
            <div>
              <label className="auth-label" htmlFor="unit-input">Unit</label>
              <select id="unit-input" className="auth-input" style={{ background: 'white' }} {...register('unit')}>
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
                <option value="pieces">pieces</option>
              </select>
            </div>
          </div>

          {/* Estimated Price Preview */}
          {selectedMaterial && quantity > 0 && (
            <div
              className="animate-scale-in"
              style={{
                padding: '18px 20px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(52,211,153,0.08))',
                border: '1.5px solid rgba(16,185,129,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p style={{ fontSize: 12, color: '#9B8F80', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Estimated Price
                </p>
                <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, color: '#34d399', letterSpacing: '-0.02em' }}>
                  ₹{estimatedPrice}
                </p>
                <p style={{ fontSize: 12, color: '#9B8F80', marginTop: 4 }}>
                  @ ₹{parseFloat(selectedMaterial.rate_per_unit).toFixed(2)}/{selectedMaterial.unit}
                </p>
              </div>
              <div style={{ fontSize: 40, color: '#34d39920' }}>
                <Check size={32} color="#34d399" />
              </div>
            </div>
          )}

          {/* Pickup Address */}
          <div className="animate-fade-in stagger-3">
            <label className="auth-label" htmlFor="address-input">Pickup Address</label>
            <input
              id="address-input"
              type="text"
              className="auth-input"
              placeholder="123 MG Road, Bangalore"
              {...register('pickup_address')}
            />
          </div>

          {/* Notes */}
          <div className="animate-fade-in stagger-4">
            <label className="auth-label" htmlFor="notes-input">Notes (optional)</label>
            <textarea
              id="notes-input"
              rows={3}
              className="auth-input"
              style={{ resize: 'none', padding: '13px 16px' }}
              placeholder="Any details about the material quality..."
              {...register('notes')}
            />
          </div>

          {/* Submit Button */}
          <div className="animate-fade-in stagger-5">
            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn w-full"
              id="create-listing-submit"
            >
              {loading ? (
                <>
                  <Recycle size={16} className="animate-spin" />
                  <span>Creating…</span>
                </>
              ) : (
                <>
                  <span>Create Listing</span>
                  <Package size={16} />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}

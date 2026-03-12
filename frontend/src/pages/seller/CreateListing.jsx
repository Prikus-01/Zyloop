import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../../components/DashboardLayout';
import { materialsAPI, listingsAPI } from '../../api/api';
import { Package, ArrowLeft } from 'lucide-react';

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
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-surface-500 hover:text-surface-700 mb-4">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-card p-6 max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-surface-800">Create Listing</h1>
            <p className="text-surface-500 text-sm">List your recyclable materials for pickup</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="material-select">Material</label>
            <select id="material-select" className="input-field" {...register('material_id', { required: 'Select a material' })}>
              <option value="">Select material…</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — ₹{parseFloat(m.rate_per_unit || 0).toFixed(2)}/{m.unit}
                </option>
              ))}
            </select>
            {errors.material_id && <p className="text-red-500 text-xs mt-1">{errors.material_id.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="quantity-input">Quantity</label>
              <input
                id="quantity-input"
                type="number"
                step="0.1"
                min="0.1"
                className="input-field"
                placeholder="e.g. 5"
                {...register('quantity', { required: 'Required', min: { value: 0.1, message: 'Min 0.1' } })}
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
            </div>
            <div>
              <label className="form-label" htmlFor="unit-input">Unit</label>
              <select id="unit-input" className="input-field" {...register('unit')}>
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
                <option value="pieces">pieces</option>
              </select>
            </div>
          </div>

          {/* Estimated price */}
          {selectedMaterial && quantity > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary-50 to-emerald-50 border border-primary-100">
              <p className="text-xs text-surface-500 font-medium">Estimated Price</p>
              <p className="text-2xl font-bold text-primary-700">₹{estimatedPrice}</p>
              <p className="text-xs text-surface-400 mt-1">Based on current rate: ₹{parseFloat(selectedMaterial.rate_per_unit).toFixed(2)}/{selectedMaterial.unit}</p>
            </div>
          )}

          <div>
            <label className="form-label" htmlFor="address-input">Pickup Address</label>
            <input id="address-input" type="text" className="input-field" placeholder="123 MG Road, Bangalore"
              {...register('pickup_address')} />
          </div>

          <div>
            <label className="form-label" htmlFor="notes-input">Notes (optional)</label>
            <textarea id="notes-input" rows={3} className="input-field resize-none" placeholder="Any details about the material..." {...register('notes')} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3" id="create-listing-submit">
            {loading ? 'Creating…' : 'Create Listing'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

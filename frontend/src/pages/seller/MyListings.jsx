import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { listingsAPI } from '../../api/api';
import { Plus, Package } from 'lucide-react';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listingsAPI.getByCurrentSeller()
      .then((res) => setListings(res.data.listings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    try {
      await listingsAPI.update(id, { status: 'cancelled' });
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: 'cancelled' } : l));
    } catch {}
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-800">My Listings</h1>
          <p className="text-surface-500 text-sm mt-1">Manage your recyclable material listings</p>
        </div>
        <Link to="/seller/listings/new" className="btn-primary" id="new-listing-btn">
          <Plus size={16} /> New Listing
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : listings.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Package size={48} className="mx-auto text-surface-300 mb-4" />
          <h3 className="text-lg font-semibold text-surface-600 mb-2">No listings yet</h3>
          <p className="text-surface-400 text-sm mb-4">Create your first listing to get started</p>
          <Link to="/seller/listings/new" className="btn-primary" id="new-listing-empty-btn">
            <Plus size={16} /> Create Listing
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing) => (
            <div key={listing.id} className="glass-card p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Package size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-surface-800">{listing.material_name}</p>
                  <p className="text-xs text-surface-500">
                    {listing.quantity} {listing.unit} · Est. ₹{parseFloat(listing.estimated_price || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={listing.status} />
                {listing.status === 'open' && (
                  <button
                    onClick={() => handleCancel(listing.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                    id={`cancel-listing-${listing.id}`}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { listingsAPI } from '../../api/api';
import { Plus, Package, Trash2 } from 'lucide-react';
import Pagination from '../../components/Pagination';

const PAGE_SIZE = 5;

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

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

  const totalPages = Math.ceil(listings.length / PAGE_SIZE);
  const paginated = listings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-10 animate-fade-in">
        <div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, color: '#0E2016', letterSpacing: '-0.02em', marginBottom: 4 }}>
            My Listings
          </h1>
          <p style={{ color: '#9B8F80', fontSize: 14 }}>Manage your recyclable material listings</p>
        </div>
        <Link
          to="/seller/listings/new"
          id="new-listing-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 20px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
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
          <Plus size={16} /> New Listing
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : listings.length === 0 ? (
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
              background: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(16,185,129,0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Package size={40} color="#9B8F80" />
          </div>
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700, color: '#0E2016', marginBottom: 10 }}>
            No listings yet
          </h3>
          <p style={{ color: '#9B8F80', fontSize: 14, marginBottom: 28, maxWidth: 320, margin: '0 auto 28px' }}>
            Create your first listing to get started and start earning from your recyclables
          </p>
          <Link
            to="/seller/listings/new"
            id="new-listing-empty-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
            }}
          >
            <Plus size={16} /> Create Listing
          </Link>
        </div>
      ) : (
        <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {paginated.map((listing, i) => (
            <div
              key={listing.id}
              className="animate-fade-in"
              style={{
                borderRadius: 14,
                background: '#F8F5EE',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1.5px solid #E2D9CC',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(52,211,153,0.12))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Package size={20} color="#34d399" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#0E2016', marginBottom: 4 }}>
                    {listing.material_name}
                  </p>
                  <p style={{ fontSize: 13, color: '#9B8F80' }}>
                    {listing.quantity} {listing.unit} · Est. ₹{parseFloat(listing.estimated_price || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <StatusBadge status={listing.status} />
                {listing.status === 'open' && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleCancel(listing.id);
                    }}
                    id={`cancel-listing-${listing.id}`}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      background: 'rgba(220, 38, 38, 0.08)',
                      border: 'none',
                      color: '#DC2626',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(220, 38, 38, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(220, 38, 38, 0.08)';
                    }}
                  >
                    <Trash2 size={12} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </DashboardLayout>
  );
}

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const btnBase = {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    transition: 'all 0.15s ease',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24 }}>

      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={{
          ...btnBase,
          background: page === 1 ? 'rgba(0,0,0,0.04)' : '#F8F5EE',
          color: page === 1 ? '#C4BAB0' : '#5C5244',
          cursor: page === 1 ? 'not-allowed' : 'pointer',
          border: '1px solid',
          borderColor: page === 1 ? '#EAE3D8' : '#E2D9CC',
        }}
        onMouseEnter={(e) => { if (page !== 1) e.currentTarget.style.borderColor = '#34d399'; }}
        onMouseLeave={(e) => { if (page !== 1) e.currentTarget.style.borderColor = '#E2D9CC'; }}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            ...btnBase,
            background: p === page ? 'linear-gradient(135deg, #10b981, #059669)' : '#F8F5EE',
            color: p === page ? 'white' : '#5C5244',
            border: '1px solid',
            borderColor: p === page ? 'transparent' : '#E2D9CC',
            boxShadow: p === page ? '0 4px 10px rgba(16,185,129,0.3)' : 'none',
          }}
          onMouseEnter={(e) => { if (p !== page) e.currentTarget.style.borderColor = '#34d399'; }}
          onMouseLeave={(e) => { if (p !== page) e.currentTarget.style.borderColor = '#E2D9CC'; }}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        style={{
          ...btnBase,
          background: page === totalPages ? 'rgba(0,0,0,0.04)' : '#F8F5EE',
          color: page === totalPages ? '#C4BAB0' : '#5C5244',
          cursor: page === totalPages ? 'not-allowed' : 'pointer',
          border: '1px solid',
          borderColor: page === totalPages ? '#EAE3D8' : '#E2D9CC',
        }}
        onMouseEnter={(e) => { if (page !== totalPages) e.currentTarget.style.borderColor = '#34d399'; }}
        onMouseLeave={(e) => { if (page !== totalPages) e.currentTarget.style.borderColor = '#E2D9CC'; }}
      >
        <ChevronRight size={16} />
      </button>

    </div>
  );
}

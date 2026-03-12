import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card relative z-10 w-full max-w-lg p-6 animate-fade-in max-h-[90vh] overflow-y-auto" style={{ background: 'rgba(255,255,255,0.95)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-surface-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-100 transition-colors"
            id="modal-close-btn"
          >
            <X size={20} className="text-surface-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

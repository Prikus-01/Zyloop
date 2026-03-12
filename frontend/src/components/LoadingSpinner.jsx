import { Recycle } from 'lucide-react';

export default function LoadingSpinner({ size = 28, text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 opacity-20 blur-md animate-pulse-ring" />
        {/* Spinning icon */}
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
          <Recycle size={size} className="text-white animate-spin" />
        </div>
      </div>
      {text && <p className="text-sm text-surface-500 font-medium animate-pulse">{text}</p>}
    </div>
  );
}

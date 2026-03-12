import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 24, text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
      <Loader2 size={size} className="animate-spin text-primary-500" />
      {text && <p className="text-sm text-surface-500">{text}</p>}
    </div>
  );
}

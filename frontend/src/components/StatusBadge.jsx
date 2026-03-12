const statusConfig = {
  open: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Open' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Cancelled' },
  collected: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Collected' },
  requested: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Requested', pulse: true },
  assigned: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500', label: 'Assigned', pulse: true },
  in_progress: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', label: 'In Progress', pulse: true },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Completed' },
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Pending', pulse: true },
  succeeded: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Succeeded' },
  failed: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Failed' },
  refunded: { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500', label: 'Refunded' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400', label: status };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} transition-all`}>
      <span className={`relative w-1.5 h-1.5 rounded-full ${config.dot}`}>
        {config.pulse && (
          <span className={`absolute inset-0 rounded-full ${config.dot} animate-ping opacity-75`} />
        )}
      </span>
      {config.label}
    </span>
  );
}

import { CLAIM_STATUS_LABELS, CLAIM_STATUS_COLORS } from '../constants/enums';

export default function StatusBadge({ status }) {
  const label = CLAIM_STATUS_LABELS[status] || status;
  const colors = CLAIM_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors}`}>
      {label}
    </span>
  );
}

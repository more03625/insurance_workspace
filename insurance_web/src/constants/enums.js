export const USER_ROLES = {
  POLICYHOLDER: 'policyholder',
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
};

export const CLAIM_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  VERIFIED: 'verified',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SETTLED: 'settled',
};

export const CLAIM_STATUS_LABELS = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  verified: 'Verified',
  approved: 'Approved',
  rejected: 'Rejected',
  settled: 'Settled',
};

export const CLAIM_STATUS_COLORS = {
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  verified: 'bg-indigo-100 text-indigo-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  settled: 'bg-emerald-100 text-emerald-800',
};

export const LOSS_TYPES = [
  'Accident',
  'Theft',
  'Natural Disaster',
  'Fire',
  'Medical',
  'Property Damage',
  'Other',
];

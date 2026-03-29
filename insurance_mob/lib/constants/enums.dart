class UserRoles {
  static const policyholder = 'policyholder';
  static const employee = 'employee';
  static const admin = 'admin';
}

class ClaimStatuses {
  static const submitted = 'submitted';
  static const submittedTitle = 'Submitted';
  static const underReview = 'under_review';
  static const verified = 'verified';
  static const approved = 'approved';
  static const rejected = 'rejected';
  static const settled = 'settled';

  static const surveyorOptions = [
    underReview,
    verified,
    approved,
    rejected,
    settled,
  ];
}

String claimStatusLabel(String raw) {
  final s = raw.toLowerCase().replaceAll(' ', '_');
  switch (s) {
    case 'submitted':
      return 'Submitted';
    case 'under_review':
      return 'Under Review';
    case 'verified':
      return 'Verified';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'settled':
      return 'Settled';
    default:
      return raw;
  }
}

const lossTypes = [
  'Accident',
  'Theft',
  'Natural Disaster',
  'Fire',
  'Medical',
  'Property Damage',
  'Other',
];

const docTypes = [
  'Photo',
  'Invoice',
  'ID Proof',
  'FIR Copy',
  'Medical Report',
  'Repair Estimate',
  'Other',
];

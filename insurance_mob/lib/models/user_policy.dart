class UserPolicy {
  final String id;
  final String policyNumber;
  final DateTime startDate;
  final DateTime endDate;
  final double premiumPaid;
  final String status;
  final String userId;
  final String policyMasterId;

  UserPolicy({
    required this.id,
    required this.policyNumber,
    required this.startDate,
    required this.endDate,
    required this.premiumPaid,
    required this.status,
    required this.userId,
    required this.policyMasterId,
  });

  factory UserPolicy.fromJson(Map<String, dynamic> json) {
    return UserPolicy(
      id: json['id']?.toString() ?? '',
      policyNumber: json['policy_number'] as String? ?? '',
      startDate: DateTime.parse(json['start_date'].toString()),
      endDate: DateTime.parse(json['end_date'].toString()),
      premiumPaid: (json['premium_paid'] as num?)?.toDouble() ?? 0,
      status: json['status'] as String? ?? '',
      userId: json['user_id']?.toString() ?? '',
      policyMasterId: json['policy_master_id']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toCreateJson() => {
        'policy_number': policyNumber,
        'start_date': startDate.toIso8601String(),
        'end_date': endDate.toIso8601String(),
        'premium_paid': premiumPaid,
        'user_id': userId,
        'policy_master_id': policyMasterId,
      };
}

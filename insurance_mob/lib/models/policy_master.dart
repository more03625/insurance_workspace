class PolicyMaster {
  final String id;
  final String name;
  final String description;
  final String policyType;
  final double basePremium;
  final String coverageDetails;

  PolicyMaster({
    required this.id,
    required this.name,
    required this.description,
    required this.policyType,
    required this.basePremium,
    required this.coverageDetails,
  });

  factory PolicyMaster.fromJson(Map<String, dynamic> json) {
    return PolicyMaster(
      id: json['id']?.toString() ?? '',
      name: json['name'] as String? ?? '',
      description: json['description'] as String? ?? '',
      policyType: json['policy_type'] as String? ?? '',
      basePremium: (json['base_premium'] as num?)?.toDouble() ?? 0,
      coverageDetails: json['coverage_details'] as String? ?? '',
    );
  }
}

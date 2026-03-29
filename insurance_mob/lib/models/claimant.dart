class Claimant {
  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String phone;
  final String relationshipToInsured;

  Claimant({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.phone,
    required this.relationshipToInsured,
  });

  factory Claimant.fromJson(Map<String, dynamic> json) {
    return Claimant(
      id: json['id']?.toString() ?? '',
      firstName: json['first_name'] as String? ?? '',
      lastName: json['last_name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      relationshipToInsured: json['relationship_to_insured'] as String? ?? '',
    );
  }

  Map<String, dynamic> toCreateJson() => {
        'first_name': firstName,
        'last_name': lastName,
        'email': email,
        'phone': phone,
        'relationship_to_insured': relationshipToInsured,
      };

  String get fullName => '$firstName $lastName'.trim();
}

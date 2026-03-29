class Loss {
  final String? id;
  final DateTime lossDate;
  final String lossType;
  final String lossCause;
  final String lossLocation;
  final String lossDescription;

  Loss({
    this.id,
    required this.lossDate,
    required this.lossType,
    required this.lossCause,
    required this.lossLocation,
    required this.lossDescription,
  });

  factory Loss.fromJson(Map<String, dynamic> json) {
    return Loss(
      id: json['id']?.toString(),
      lossDate: DateTime.parse(json['loss_date'].toString()),
      lossType: json['loss_type'] as String? ?? '',
      lossCause: json['loss_cause'] as String? ?? '',
      lossLocation: json['loss_location'] as String? ?? '',
      lossDescription: json['loss_description'] as String? ?? '',
    );
  }

  Map<String, dynamic> toCreateJson() => {
        'loss_date': lossDate.toIso8601String(),
        'loss_type': lossType,
        'loss_cause': lossCause,
        'loss_location': lossLocation,
        'loss_description': lossDescription,
      };
}

import 'claimant.dart';
import 'loss.dart';

class Claim {
  final String id;
  final String claimNumber;
  final String claimStatus;
  final double estimatedLossAmount;
  final String userPolicyId;
  final String claimantId;
  final String? lossId;
  final DateTime? verifiedAt;
  final String? verifiedById;
  final DateTime createdAt;
  final Claimant? claimant;
  final Loss? loss;

  Claim({
    required this.id,
    required this.claimNumber,
    required this.claimStatus,
    required this.estimatedLossAmount,
    required this.userPolicyId,
    required this.claimantId,
    this.lossId,
    this.verifiedAt,
    this.verifiedById,
    required this.createdAt,
    this.claimant,
    this.loss,
  });

  factory Claim.fromJson(Map<String, dynamic> json) {
    return Claim(
      id: json['id']?.toString() ?? '',
      claimNumber: json['claim_number'] as String? ?? '',
      claimStatus: json['claim_status'] as String? ?? '',
      estimatedLossAmount:
          (json['estimated_loss_amount'] as num?)?.toDouble() ?? 0,
      userPolicyId: json['user_policy_id']?.toString() ?? '',
      claimantId: json['claimant_id']?.toString() ?? '',
      lossId: json['loss_id']?.toString(),
      verifiedAt: json['verified_at'] != null
          ? DateTime.tryParse(json['verified_at'].toString())
          : null,
      verifiedById: json['verified_by_id']?.toString(),
      createdAt: DateTime.parse(json['created_at'].toString()),
      claimant: json['claimant'] != null
          ? Claimant.fromJson(json['claimant'] as Map<String, dynamic>)
          : null,
      loss: json['loss'] != null
          ? Loss.fromJson(json['loss'] as Map<String, dynamic>)
          : null,
    );
  }
}

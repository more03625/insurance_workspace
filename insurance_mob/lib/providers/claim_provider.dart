import 'package:flutter/foundation.dart';
import 'package:insurance_mob/models/claim.dart';
import 'package:insurance_mob/services/claim_service.dart';

class ClaimProvider extends ChangeNotifier {
  final _service = ClaimService();

  List<Claim> claims = [];
  bool loading = false;
  String? error;

  Future<void> loadClaims() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      claims = await _service.listClaims();
    } catch (e) {
      error = e.toString();
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<Claim> createClaim(Map<String, dynamic> body) =>
      _service.createClaim(body);

  Future<Claim> verifyClaim(String claimId, String employeeId, String status) =>
      _service.verifyClaim(claimId, employeeId, status);

  List<Claim> filterByPolicyIds(Set<String> policyIds) {
    return claims.where((c) => policyIds.contains(c.userPolicyId)).toList();
  }
}

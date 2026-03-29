import 'package:flutter/foundation.dart';
import 'package:insurance_mob/models/policy_master.dart';
import 'package:insurance_mob/models/user_policy.dart';
import 'package:insurance_mob/services/policy_service.dart';

class PolicyProvider extends ChangeNotifier {
  final _service = PolicyService();

  List<PolicyMaster> masters = [];
  List<UserPolicy> userPolicies = [];
  bool loading = false;
  String? error;

  Future<void> loadMasters() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      masters = await _service.listPolicyMasters();
    } catch (e) {
      error = e.toString();
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> loadUserPolicies(String userId) async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      userPolicies = await _service.getUserPolicies(userId);
    } catch (e) {
      error = e.toString();
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<UserPolicy> purchase(Map<String, dynamic> body) =>
      _service.purchasePolicy(body);

  Future<PolicyMaster> createMaster(Map<String, dynamic> body) =>
      _service.createPolicyMaster(body);
}

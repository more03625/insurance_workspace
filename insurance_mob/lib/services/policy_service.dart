import 'package:dio/dio.dart';
import 'package:insurance_mob/constants/api_constants.dart';
import 'package:insurance_mob/models/policy_master.dart';
import 'package:insurance_mob/models/user_policy.dart';
import 'package:insurance_mob/services/api_client.dart';
import 'package:insurance_mob/services/api_exception.dart';

class PolicyService {
  final _client = ApiClient.instance;

  Future<List<PolicyMaster>> listPolicyMasters() async {
    try {
      final data = await _client.get(ApiEndpoints.policyMaster);
      if (data is! List) return [];
      return data
          .map((e) => PolicyMaster.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _fe(e);
    }
  }

  Future<List<UserPolicy>> getUserPolicies(String userId) async {
    try {
      final data = await _client.get(ApiEndpoints.userPoliciesFor(userId));
      if (data is! List) return [];
      return data
          .map((e) => UserPolicy.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _fe(e);
    }
  }

  Future<UserPolicy> purchasePolicy(Map<String, dynamic> body) async {
    try {
      final data = await _client.post(ApiEndpoints.userPolicies, data: body);
      return UserPolicy.fromJson(data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _fe(e);
    }
  }

  Future<PolicyMaster> createPolicyMaster(Map<String, dynamic> body) async {
    try {
      final data = await _client.post(ApiEndpoints.policyMaster, data: body);
      return PolicyMaster.fromJson(data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _fe(e);
    }
  }
}

ApiException _fe(DioException e) {
  if (e.error is ApiException) return e.error as ApiException;
  return ApiException(e.message ?? 'Request failed');
}

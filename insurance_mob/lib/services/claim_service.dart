import 'package:dio/dio.dart';
import 'package:insurance_mob/constants/api_constants.dart';
import 'package:insurance_mob/models/claim.dart';
import 'package:insurance_mob/services/api_client.dart';
import 'package:insurance_mob/services/api_exception.dart';

class ClaimService {
  final _client = ApiClient.instance;

  Future<List<Claim>> listClaims({int offset = 0, int limit = 100}) async {
    try {
      final data = await _client.get(
        ApiEndpoints.claims,
        queryParameters: {'offset': offset, 'limit': limit},
      );
      if (data is! List) return [];
      return data
          .map((e) => Claim.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _fe(e);
    }
  }

  Future<Claim> createClaim(Map<String, dynamic> body) async {
    try {
      final data = await _client.post(ApiEndpoints.claims, data: body);
      return Claim.fromJson(data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _fe(e);
    }
  }

  Future<Claim> verifyClaim(
    String claimId,
    String employeeId,
    String status,
  ) async {
    try {
      final data = await _client.post(
        ApiEndpoints.verifyClaim(claimId),
        data: {'employee_id': employeeId, 'status': status},
      );
      return Claim.fromJson(data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _fe(e);
    }
  }
}

ApiException _fe(DioException e) {
  if (e.error is ApiException) return e.error as ApiException;
  return ApiException(e.message ?? 'Request failed');
}

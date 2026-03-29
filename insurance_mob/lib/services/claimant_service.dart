import 'package:dio/dio.dart';
import 'package:insurance_mob/constants/api_constants.dart';
import 'package:insurance_mob/models/claimant.dart';
import 'package:insurance_mob/services/api_client.dart';
import 'package:insurance_mob/services/api_exception.dart';

class ClaimantService {
  final _client = ApiClient.instance;

  Future<Claimant> createClaimant(Map<String, dynamic> body) async {
    try {
      final data = await _client.post(ApiEndpoints.claimants, data: body);
      return Claimant.fromJson(data as Map<String, dynamic>);
    } on DioException catch (e) {
      if (e.error is ApiException) throw e.error as ApiException;
      throw ApiException(e.message ?? 'Request failed');
    }
  }
}

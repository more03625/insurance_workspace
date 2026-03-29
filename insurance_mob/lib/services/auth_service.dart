import 'package:dio/dio.dart';
import 'package:insurance_mob/constants/api_constants.dart';
import 'package:insurance_mob/services/api_client.dart';
import 'package:insurance_mob/services/api_exception.dart';

class AuthService {
  final _client = ApiClient.instance;

  /// Returns map with token + user fields (LoginResponse).
  Future<Map<String, dynamic>> login(String username, String password) async {
    try {
      final data = await _client.post(
        ApiEndpoints.login,
        data: {'username': username, 'password': password},
      );
      if (data is! Map<String, dynamic>) {
        throw ApiException('Invalid login response');
      }
      return data;
    } on DioException catch (e) {
      throw _fromDio(e);
    }
  }
}

ApiException _fromDio(DioException e) {
  if (e.error is ApiException) return e.error as ApiException;
  final msg = e.response?.data?.toString() ?? e.message ?? 'Network error';
  return ApiException(msg);
}

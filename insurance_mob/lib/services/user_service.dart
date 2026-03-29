import 'package:dio/dio.dart';
import 'package:insurance_mob/constants/api_constants.dart';
import 'package:insurance_mob/models/user.dart';
import 'package:insurance_mob/services/api_client.dart';
import 'package:insurance_mob/services/api_exception.dart';

class UserService {
  final _client = ApiClient.instance;

  Future<List<User>> listUsers() async {
    try {
      final data = await _client.get(ApiEndpoints.users);
      if (data is! List) return [];
      return data
          .map((e) => User.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _fe(e);
    }
  }

  Future<User> createUser(Map<String, dynamic> body) async {
    try {
      final data = await _client.post(ApiEndpoints.users, data: body);
      return User.fromJson(data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _fe(e);
    }
  }
}

ApiException _fe(DioException e) {
  if (e.error is ApiException) return e.error as ApiException;
  return ApiException(e.message ?? 'Request failed');
}

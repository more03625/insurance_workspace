import 'package:dio/dio.dart';
import 'package:insurance_mob/constants/api_constants.dart';
import 'package:insurance_mob/services/api_exception.dart';

typedef TokenGetter = String? Function();
typedef UnauthorizedCallback = void Function();

/// Dio singleton: envelope unwrap, JWT Bearer, 401 → callback.
class ApiClient {
  ApiClient._();

  static final ApiClient instance = ApiClient._();

  late final Dio dio;
  TokenGetter? tokenGetter;
  UnauthorizedCallback? onUnauthorized;

  void init({String? baseUrl}) {
    dio = Dio(
      BaseOptions(
        baseUrl: baseUrl ?? kDefaultApiBaseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 60),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final t = tokenGetter?.call();
          if (t != null && t.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $t';
          }
          handler.next(options);
        },
        onResponse: (response, handler) {
          final data = response.data;
          if (data is Map<String, dynamic>) {
            if (data['success'] == false) {
              final err = data['error'];
              String msg = 'Something went wrong';
              int? code;
              if (err is Map) {
                msg = err['message']?.toString() ?? msg;
                final c = err['code'];
                if (c is int) code = c;
              }
              handler.reject(
                DioException(
                  requestOptions: response.requestOptions,
                  response: response,
                  error: ApiException(msg, code: code),
                ),
              );
              return;
            }
          }
          handler.next(response);
        },
        onError: (err, handler) {
          if (err.response?.statusCode == 401) {
            onUnauthorized?.call();
          }
          handler.next(err);
        },
      ),
    );
  }

  dynamic unwrap(Response response) {
    final data = response.data;
    if (data is Map<String, dynamic>) {
      return data['data'];
    }
    return data;
  }

  Future<dynamic> get(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    final res = await dio.get(path, queryParameters: queryParameters);
    return unwrap(res);
  }

  Future<dynamic> post(String path, {dynamic data}) async {
    final res = await dio.post(path, data: data);
    return unwrap(res);
  }
}

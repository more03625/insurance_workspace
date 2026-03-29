class ApiException implements Exception {
  final int? code;
  final String message;

  ApiException(this.message, {this.code});

  @override
  String toString() => message;
}

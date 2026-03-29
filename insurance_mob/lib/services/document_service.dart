import 'package:dio/dio.dart';
import 'package:insurance_mob/constants/api_constants.dart';
import 'package:insurance_mob/models/document.dart';
import 'package:insurance_mob/services/api_client.dart';
import 'package:insurance_mob/services/api_exception.dart';

class DocumentService {
  final _client = ApiClient.instance;

  Future<List<DocumentModel>> getDocumentsByClaim(String claimId) async {
    try {
      final data = await _client.get(ApiEndpoints.documentsForClaim(claimId));
      if (data is! List) return [];
      return data
          .map((e) => DocumentModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      if (e.error is ApiException) throw e.error as ApiException;
      throw ApiException(e.message ?? 'Request failed');
    }
  }

  Future<DocumentModel> uploadDocument(Map<String, dynamic> body) async {
    try {
      final data = await _client.post(ApiEndpoints.documents, data: body);
      return DocumentModel.fromJson(data as Map<String, dynamic>);
    } on DioException catch (e) {
      if (e.error is ApiException) throw e.error as ApiException;
      throw ApiException(e.message ?? 'Request failed');
    }
  }
}

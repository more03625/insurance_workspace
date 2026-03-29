import 'package:flutter/foundation.dart';
import 'package:insurance_mob/models/document.dart';
import 'package:insurance_mob/services/document_service.dart';

class DocumentProvider extends ChangeNotifier {
  final _service = DocumentService();

  Future<List<DocumentModel>> getByClaim(String claimId) =>
      _service.getDocumentsByClaim(claimId);

  Future<DocumentModel> upload(Map<String, dynamic> body) =>
      _service.uploadDocument(body);
}

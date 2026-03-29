class DocumentModel {
  final String id;
  final String documentName;
  final String documentType;
  final String filePath;
  final String fileFormat;
  final String claimId;

  DocumentModel({
    required this.id,
    required this.documentName,
    required this.documentType,
    required this.filePath,
    required this.fileFormat,
    required this.claimId,
  });

  factory DocumentModel.fromJson(Map<String, dynamic> json) {
    return DocumentModel(
      id: json['id']?.toString() ?? '',
      documentName: json['document_name'] as String? ?? '',
      documentType: json['document_type'] as String? ?? '',
      filePath: json['file_path'] as String? ?? '',
      fileFormat: json['file_format'] as String? ?? '',
      claimId: json['claim_id']?.toString() ?? '',
    );
  }
}

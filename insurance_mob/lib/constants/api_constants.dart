/// Backend base URL — no `/api` prefix (use 10.0.2.2 for Android emulator → host machine).
const String kDefaultApiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://10.0.2.2:8000',
);

class ApiEndpoints {
  static const login = '/login';
  static const users = '/users/';
  static const policyMaster = '/policy-master/';
  static const userPolicies = '/user-policies/';
  static const claimants = '/claimants/';
  static const claims = '/claims/';
  static const documents = '/documents/';
  static String userPoliciesFor(String userId) => '/user-policies/$userId';
  static String documentsForClaim(String claimId) => '/documents/claim/$claimId';
  static String verifyClaim(String claimId) => '/claims/$claimId/verify';
}

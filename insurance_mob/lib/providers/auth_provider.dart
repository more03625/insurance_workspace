import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:insurance_mob/constants/enums.dart';
import 'package:insurance_mob/models/user.dart';
import 'package:insurance_mob/services/api_client.dart';
import 'package:insurance_mob/services/api_exception.dart';
import 'package:insurance_mob/services/auth_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

const _kUserJson = 'insurance_user';

class AuthProvider extends ChangeNotifier {
  AuthProvider();

  final _secure = const FlutterSecureStorage();
  final _authService = AuthService();

  User? _user;
  String? _token;

  User? get user => _user;
  String? get token => _token;
  bool get isLoggedIn => _token != null && _token!.isNotEmpty && _user != null;
  bool get isPolicyholder => _user?.role == UserRoles.policyholder;
  bool get isAdmin =>
      _user?.role == UserRoles.admin || _user?.role == UserRoles.employee;

  Future<void> loadSession() async {
    final t = await _secure.read(key: 'insurance_token');
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_kUserJson);
    _token = t;
    if (raw != null) {
      try {
        _user = User.fromJson(jsonDecode(raw) as Map<String, dynamic>);
      } catch (_) {
        _user = null;
      }
    }
    notifyListeners();
  }

  void registerApiHooks() {
    final api = ApiClient.instance;
    api.tokenGetter = () => _token;
    api.onUnauthorized = () {
      logout();
    };
  }

  Future<User> login(String username, String password) async {
    final data = await _authService.login(username, password);
    final tok = data['token'] as String?;
    if (tok == null || tok.isEmpty) {
      throw ApiException('No token in response');
    }
    _token = tok;
    await _secure.write(key: 'insurance_token', value: tok);
    _user = data.toUserWithoutToken();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kUserJson, jsonEncode(_user!.toJson()));
    notifyListeners();
    return _user!;
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    await _secure.delete(key: 'insurance_token');
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kUserJson);
    notifyListeners();
  }
}

extension on Map<String, dynamic> {
  User toUserWithoutToken() {
    final copy = Map<String, dynamic>.from(this)..remove('token');
    return User.fromJson(copy);
  }
}

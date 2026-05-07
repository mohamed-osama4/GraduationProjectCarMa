import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:graduation_project/core/network/api_client.dart';
import 'package:graduation_project/data/models/user_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider extends ChangeNotifier {
  // Call once in main.dart / SplashScreen to restore session from saved token
  Future<void> loadCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token == null) return;

    try {
      final response = await _apiClient.dio.get('/admin/me');
      if (response.statusCode == 200) {
        final data = response.data as Map<String, dynamic>;
        data['token'] = token;
        _currentUser = UserModel.fromJson(data);
        notifyListeners();
      }
    } catch (_) {
      // Token expired or server down — silently ignore, user stays logged out
    }
  }

  final ApiClient _apiClient = ApiClient();
  UserModel? _currentUser;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _currentUser != null;

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200) {
        final data = response.data;
        // The token is at the root level based on AuthController
        final token = data['token'] as String?;
        final userMap = data['user'] as Map<String, dynamic>?;

        if (token != null && userMap != null) {
          userMap['token'] = token;
          _currentUser = UserModel.fromJson(userMap);
          
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('auth_token', token);
          
          _isLoading = false;
          notifyListeners();
          return true;
        }
      }
      _errorMessage = 'Invalid response format';
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        _errorMessage = e.response?.data['message'] ?? 'Invalid credentials';
      } else {
        _errorMessage = e.message ?? 'Login failed';
      }
    } catch (e) {
      _errorMessage = e.toString();
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    _currentUser = null;
    notifyListeners();
    return true;
  }

  Future<bool> register({
    required String name,
    required String email,
    required String phoneNumber,
    required String password,
    required String confirmPassword,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.dio.post('/auth/register', data: {
        'name': name,
        'email': email,
        'phoneNumber': phoneNumber,
        'password': password,
        'confirmPassword': confirmPassword,
      });

      if (response.statusCode == 200) {
        final data = response.data;
        final token = data['token'] as String?;
        final userMap = data['user'] as Map<String, dynamic>?;

        if (token != null && userMap != null) {
          userMap['token'] = token;
          _currentUser = UserModel.fromJson(userMap);

          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('auth_token', token);

          _isLoading = false;
          notifyListeners();
          return true;
        }
      }
      _errorMessage = 'Invalid response format';
    } on DioException catch (e) {
      if (e.response?.statusCode == 400) {
        _errorMessage = e.response?.data['message'] ?? 'Registration failed';
      } else {
        _errorMessage = e.message ?? 'Registration failed';
      }
    } catch (e) {
      _errorMessage = e.toString();
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> updateProfile({
    required String name,
    required String phoneNumber,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.dio.put('/auth/profile', data: {
        'name': name,
        'phoneNumber': phoneNumber,
      });

      if (response.statusCode == 200) {
        // Update local user model with new data
        _currentUser = _currentUser?.copyWith(
          name: name,
          phoneNumber: phoneNumber,
        );
        _isLoading = false;
        notifyListeners();
        return true;
      }
      _errorMessage = 'فشل تحديث البيانات';
    } on DioException catch (e) {
      _errorMessage = e.response?.data['message'] ?? e.message ?? 'فشل تحديث البيانات';
    } catch (e) {
      _errorMessage = e.toString();
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }
}

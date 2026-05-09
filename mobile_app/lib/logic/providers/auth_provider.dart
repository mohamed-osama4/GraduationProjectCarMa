import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:graduation_project/core/network/api_client.dart';
import 'package:graduation_project/data/models/user_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  UserModel? _currentUser;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _currentUser != null;

  // ─── Restore session from SharedPreferences (no API call) ──────────────────
  // New backend JWT uses ClaimTypes.NameIdentifier (userId) not email,
  // so we cache user data locally instead of calling /admin/me
  Future<void> loadCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    final userJson = prefs.getString('user_data');
    if (token == null || userJson == null) return;

    try {
      final userMap = jsonDecode(userJson) as Map<String, dynamic>;
      userMap['token'] = token;
      _currentUser = UserModel.fromJson(userMap);
      notifyListeners();
    } catch (_) {
      // Corrupt cached data — clear it so user logs in again
      await prefs.remove('auth_token');
      await prefs.remove('user_data');
    }
  }

  // ─── LOGIN ─────────────────────────────────────────────────────────────────
  // Backend: POST /api/auth/login
  // Response: { message, token, user: { Id, Name, Email, Role } }
  // Errors (401): "User not found" | "Wrong password"
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
        final token = data['token'] as String?;
        final userMap = data['user'] as Map<String, dynamic>?;

        if (token != null && userMap != null) {
          userMap['token'] = token;
          _currentUser = UserModel.fromJson(userMap);

          // Persist token and user data for session restoration
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('auth_token', token);
          final cacheMap = Map<String, dynamic>.from(userMap)..remove('token');
          await prefs.setString('user_data', jsonEncode(cacheMap));

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

  // ─── LOGOUT ────────────────────────────────────────────────────────────────
  Future<bool> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('user_data');
    _currentUser = null;
    notifyListeners();
    return true;
  }

  // ─── REGISTER ──────────────────────────────────────────────────────────────
  // Backend: POST /api/auth/register
  // New response: { message: "User registered successfully", userId }
  // (No token or user object returned — auto-login after success)
  // Errors (400): "Email already exists"
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
      final response = await _apiClient.dio.post('/Auth/register', data: {
        'name': name,
        'email': email,
        'phoneNumber': phoneNumber,
        'password': password,
        // confirmPassword is validated locally; backend no longer requires it
      });

      if (response.statusCode == 200) {
        // New backend returns { message, userId } only — auto login to get token
        _isLoading = false;
        notifyListeners();
        return await login(email, password);
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

  // ─── UPDATE PROFILE ────────────────────────────────────────────────────────
  // Backend: PUT /api/admin/profile
  // DTO: { fullName, email, phoneNumber }
  Future<bool> updateProfile({
    required String name,
    required String phoneNumber,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.dio.put('/admin/profile', data: {
        'fullName': name,
        'email': _currentUser?.email ?? '',
        'phoneNumber': phoneNumber,
      });

      if (response.statusCode == 200) {
        _currentUser = _currentUser?.copyWith(
          name: name,
          phoneNumber: phoneNumber,
        );
        // Update cached user data
        final prefs = await SharedPreferences.getInstance();
        if (_currentUser != null) {
          await prefs.setString(
            'user_data',
            jsonEncode({
              'id': _currentUser!.id,
              'name': _currentUser!.name,
              'email': _currentUser!.email,
              'role': _currentUser!.role,
              'phoneNumber': _currentUser!.phoneNumber,
            }),
          );
        }
        _isLoading = false;
        notifyListeners();
        return true;
      }
      _errorMessage = 'فشل تحديث البيانات';
    } on DioException catch (e) {
      _errorMessage =
          e.response?.data['message'] ?? e.message ?? 'فشل تحديث البيانات';
    } catch (e) {
      _errorMessage = e.toString();
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }
}

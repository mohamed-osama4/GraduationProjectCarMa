import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:graduation_project/core/network/api_client.dart';

/// Syncs user settings with the backend:
///   GET  /api/Settings/MySettings
///   PUT  /api/Settings/Update-Settings
class SettingsProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();

  bool _isLoading = false;
  String? _errorMessage;
  bool _hasFetched = false;

  // Settings fields (defaults match backend model)
  bool _emailNotifications = true;
  bool _smsNotifications = true;
  bool _promotionalOffers = false;
  bool _twoFactorEnabled = false;
  bool _biometricsEnabled = false;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get hasFetched => _hasFetched;

  bool get emailNotifications => _emailNotifications;
  bool get smsNotifications => _smsNotifications;
  bool get promotionalOffers => _promotionalOffers;
  bool get twoFactorEnabled => _twoFactorEnabled;
  bool get biometricsEnabled => _biometricsEnabled;

  /// Combined "notifications on" = email OR sms
  bool get notificationsEnabled => _emailNotifications || _smsNotifications;

  // ── Fetch settings from backend ──────────────────────────────
  Future<void> fetchSettings() async {
    if (_isLoading) return;
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.dio.get('/Settings/MySettings');

      if (response.statusCode == 200 && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        _emailNotifications = data['emailNotifications'] as bool? ?? true;
        _smsNotifications = data['smsNotifications'] as bool? ?? true;
        _promotionalOffers = data['promotionalOffers'] as bool? ?? false;
        _twoFactorEnabled = data['twoFactorEnabled'] as bool? ?? false;
        _biometricsEnabled = data['biometricsEnabled'] as bool? ?? false;
        _hasFetched = true;
      }
    } on DioException catch (e) {
      // 404 means no settings record yet — use defaults
      if (e.response?.statusCode == 404) {
        _hasFetched = true;
      } else {
        _errorMessage = e.message ?? 'Failed to load settings';
      }
    } catch (e) {
      _errorMessage = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  // ── Update settings on backend ───────────────────────────────
  Future<bool> updateSettings({
    bool? emailNotifications,
    bool? smsNotifications,
    bool? promotionalOffers,
    bool? twoFactorEnabled,
    bool? biometricsEnabled,
  }) async {
    // Optimistic update
    if (emailNotifications != null) _emailNotifications = emailNotifications;
    if (smsNotifications != null) _smsNotifications = smsNotifications;
    if (promotionalOffers != null) _promotionalOffers = promotionalOffers;
    if (twoFactorEnabled != null) _twoFactorEnabled = twoFactorEnabled;
    if (biometricsEnabled != null) _biometricsEnabled = biometricsEnabled;
    notifyListeners();

    try {
      final response = await _apiClient.dio.put(
        '/Settings/Update-Settings',
        data: {
          'emailNotifications': _emailNotifications,
          'smsNotifications': _smsNotifications,
          'promotionalOffers': _promotionalOffers,
          'twoFactorEnabled': _twoFactorEnabled,
          'biometricsEnabled': _biometricsEnabled,
        },
      );

      if (response.statusCode == 200) {
        return true;
      }
    } catch (e) {
      // Revert on failure — re-fetch from server
      await fetchSettings();
      return false;
    }
    return false;
  }

  /// Toggle notifications (sets both email & sms)
  Future<bool> setNotificationsEnabled(bool value) {
    return updateSettings(
      emailNotifications: value,
      smsNotifications: value,
    );
  }
}

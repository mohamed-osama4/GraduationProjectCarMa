import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:graduation_project/core/network/api_client.dart';
import 'package:graduation_project/data/models/service_model.dart';

/// Fetches the list of services (with prices) from the backend.
/// Usage:
///   context.read<ServicesProvider>().fetchServices();
///   context.watch<ServicesProvider>().priceFor(serviceId: 4)
class ServicesProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();

  List<ServiceModel> _services = [];
  bool _isLoading = false;
  String? _errorMessage;
  bool _hasFetched = false;

  List<ServiceModel> get services     => _services;
  bool               get isLoading    => _isLoading;
  String?            get errorMessage => _errorMessage;
  bool               get hasFetched   => _hasFetched;

  // ── Fetch all services from GET /api/admin/services ──────────
  // AdminController exposes this endpoint with [AllowAnonymous],
  // so no auth token is required. It returns a plain JSON array.
  Future<void> fetchServices() async {
    if (_isLoading) return; // prevent concurrent calls
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.dio.get('/admin/services');

      if (response.statusCode == 200) {
        // Response is a plain JSON array (not wrapped in {data:[...]})
        final list = response.data as List<dynamic>? ?? [];
        _services = list
            .map((e) => ServiceModel.fromJson(e as Map<String, dynamic>))
            .toList();
        _hasFetched = true;
      }
    } on DioException catch (e) {
      _errorMessage = e.message ?? 'Failed to load services';
    } catch (e) {
      _errorMessage = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  /// Returns the [ServiceModel] for the given [serviceId], or null if not found.
  ServiceModel? serviceById(int serviceId) {
    try {
      return _services.firstWhere((s) => s.id == serviceId);
    } catch (_) {
      return null;
    }
  }

  /// Returns a formatted price string for the given [serviceId].
  /// Falls back to [fallback] if the service is not loaded yet.
  String priceFor({
    required int serviceId,
    required bool isArabic,
    String fallback = '—',
  }) {
    final svc = serviceById(serviceId);
    return svc?.formattedPrice(isArabic) ?? fallback;
  }
}

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:graduation_project/core/network/api_client.dart';
import 'package:graduation_project/data/models/car_model.dart';

/// Manages the user's cars via:
///   GET    /api/cars         → fetch user's cars
///   POST   /api/cars         → add a new car
///   DELETE /api/cars/{id}    → delete a car
class CarsProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();

  List<CarModel> _cars = [];
  bool _isLoading = false;
  String? _errorMessage;
  bool _hasFetched = false;

  List<CarModel> get cars => _cars;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get hasFetched => _hasFetched;

  /// The primary car (or first car if none is marked primary)
  CarModel? get primaryCar {
    if (_cars.isEmpty) return null;
    try {
      return _cars.firstWhere((c) => c.isPrimary);
    } catch (_) {
      return _cars.first;
    }
  }

  // ── Fetch all user's cars ───────────────────────────────────────
  Future<void> fetchCars() async {
    if (_isLoading) return;
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.dio.get('/cars');

      if (response.statusCode == 200) {
        final list = response.data as List<dynamic>? ?? [];
        _cars = list
            .map((e) => CarModel.fromJson(e as Map<String, dynamic>))
            .toList();
        _hasFetched = true;
      }
    } on DioException catch (e) {
      _errorMessage = e.message ?? 'Failed to load cars';
    } catch (e) {
      _errorMessage = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  // ── Add a new car ──────────────────────────────────────────────
  Future<CarModel?> addCar({
    required String brand,
    required String model,
    required int year,
    required String plateNumber,
    required String color,
    bool isPrimary = false,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.dio.post(
        '/cars',
        data: {
          'brand': brand,
          'model': model,
          'year': year,
          'plateNumber': plateNumber,
          'color': color,
          'isPrimary': isPrimary,
        },
      );

      if (response.statusCode == 200 && response.data != null) {
        final newCar = CarModel.fromJson(response.data as Map<String, dynamic>);
        _cars.add(newCar);
        _isLoading = false;
        notifyListeners();
        return newCar;
      }
    } on DioException catch (e) {
      _errorMessage = e.message ?? 'Failed to add car';
    } catch (e) {
      _errorMessage = e.toString();
    }

    _isLoading = false;
    notifyListeners();
    return null;
  }

  // ── Delete a car ───────────────────────────────────────────────
  Future<bool> deleteCar(int carId) async {
    // Optimistic remove
    final removed = _cars.where((c) => c.id == carId).toList();
    _cars.removeWhere((c) => c.id == carId);
    notifyListeners();

    try {
      final response = await _apiClient.dio.delete('/cars/$carId');
      if (response.statusCode == 200) {
        return true;
      }
    } catch (_) {
      // Revert on failure
      _cars.addAll(removed);
      notifyListeners();
    }
    return false;
  }
}

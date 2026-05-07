import 'dart:async';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:graduation_project/core/network/api_client.dart';
import 'package:graduation_project/core/network/api_response.dart';
import 'package:graduation_project/data/models/order_model.dart';

class OrdersProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();

  List<OrderModel> _orders = [];
  bool _isLoading = false;
  String? _errorMessage;

  // Local metadata (not stored on server)
  final Map<int, String> _orderImagePaths = {}; // orderId → local image path
  final Map<int, String> _orderServiceNames = {}; // orderId → service name
  final Map<int, String> _orderNotes = {}; // orderId → notes

  // Polling state
  Timer? _pollingTimer;
  OrderStatus? _lastKnownStatus;

  // Callback fired when order is accepted (status = OnTheWay)
  void Function(OrderModel order)? onOrderAccepted;

  List<OrderModel> get orders => _orders;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  String? imagePathForOrder(int orderId) => _orderImagePaths[orderId];
  String? serviceNameForOrder(int orderId) => _orderServiceNames[orderId];
  String? notesForOrder(int orderId) => _orderNotes[orderId];

  // ── Fetch all orders for a user ──────────────────────────────
  Future<void> fetchOrders({int? userId}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final path = userId != null ? '/orders/user/$userId' : '/orders';
      final response = await _apiClient.dio.get(path);

      if (response.statusCode == 200) {
        final apiResponse = ApiResponse<List<OrderModel>>.fromJson(
          response.data,
          (json) => (json as List<dynamic>)
              .map((e) => OrderModel.fromJson(e as Map<String, dynamic>))
              .toList(),
        );

        if (apiResponse.success) {
          _orders = apiResponse.data ?? [];
        } else {
          _errorMessage = apiResponse.message;
        }
      }
    } on DioException catch (e) {
      _errorMessage = e.message ?? 'Failed to load orders';
    } catch (e) {
      _errorMessage = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  // ── Create order then start polling ──────────────────────────
  Future<OrderModel?> createOrder(CreateOrderDto dto) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.dio.post('/orders', data: dto.toJson());

      if (response.statusCode == 200) {
        final apiResponse = ApiResponse<OrderModel>.fromJson(
          response.data,
          (json) => OrderModel.fromJson(json as Map<String, dynamic>),
        );

        if (apiResponse.success && apiResponse.data != null) {
          final newOrder = apiResponse.data!;
          _orders.insert(0, newOrder);

          // Store local metadata
          if (dto.carImagePath != null) {
            _orderImagePaths[newOrder.id] = dto.carImagePath!;
          }
          if (dto.serviceName != null) {
            _orderServiceNames[newOrder.id] = dto.serviceName!;
          }
          if (dto.notes != null) {
            _orderNotes[newOrder.id] = dto.notes!;
          }

          _isLoading = false;
          notifyListeners();

          // Start polling for this order
          startPolling(newOrder.id);
          return newOrder;
        } else {
          _errorMessage = apiResponse.message;
        }
      }
    } on DioException catch (e) {
      _errorMessage = e.message ?? 'Failed to create order';
    } catch (e) {
      _errorMessage = e.toString();
    }

    _isLoading = false;
    notifyListeners();
    return null;
  }

  // ── Polling: check order status every 5 seconds ───────────────
  void startPolling(int orderId) {
    stopPolling(); // cancel any existing timer
    _lastKnownStatus = OrderStatus.pending;

    _pollingTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      _checkOrderStatus(orderId);
    });
  }

  void stopPolling() {
    _pollingTimer?.cancel();
    _pollingTimer = null;
  }

  Future<void> _checkOrderStatus(int orderId) async {
    try {
      final response = await _apiClient.dio.get('/orders/$orderId');
      if (response.statusCode == 200) {
        final apiResponse = ApiResponse<OrderModel>.fromJson(
          response.data,
          (json) => OrderModel.fromJson(json as Map<String, dynamic>),
        );

        if (apiResponse.success && apiResponse.data != null) {
          final updatedOrder = apiResponse.data!;

          // Update the order in the local list
          final idx = _orders.indexWhere((o) => o.id == orderId);
          if (idx != -1) {
            _orders[idx] = updatedOrder;
          }

          // If status just changed to Accepted — fire callback!
          if (_lastKnownStatus != OrderStatus.accepted &&
              updatedOrder.orderStatus == OrderStatus.accepted) {
            onOrderAccepted?.call(updatedOrder);
            stopPolling(); // stop after accepted
          }

          // Stop polling if terminal status
          if (updatedOrder.isCompleted || updatedOrder.isRejected) {
            stopPolling();
          }

          _lastKnownStatus = updatedOrder.orderStatus;
          notifyListeners();
        }
      }
    } catch (_) {
      // silently ignore polling errors
    }
  }

  @override
  void dispose() {
    stopPolling();
    super.dispose();
  }
}

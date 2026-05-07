import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  // ✅ Android Emulator  → use: http://10.0.2.2:5000/api
  // ✅ Real Device (WiFi) → use: http://192.168.1.8:5000/api
  // ✅ iOS Simulator     → use: http://localhost:5000/api
  static const String _baseUrl = 'http://192.168.1.8:5000/api'; // Real Device (WiFi)

  final Dio _dio;

  ApiClient() : _dio = Dio(BaseOptions(
    baseUrl: _baseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  )) {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('auth_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException e, handler) {
        // Here we could handle global errors (e.g. 401 Unauthorized)
        return handler.next(e);
      },
    ));
  }

  Dio get dio => _dio;
}

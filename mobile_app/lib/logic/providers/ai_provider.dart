import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:graduation_project/core/network/api_client.dart';
import 'package:graduation_project/data/models/chat_request.dart';

class AiProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  
  final List<Map<String, String>> _messages = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<Map<String, String>> get messages => _messages;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> sendMessage(String text) async {
    _messages.add({'sender': 'user', 'text': text});
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final request = ChatRequest(message: text);
      final response = await _apiClient.dio.post('/ai/chat', data: request.toJson());
      
      if (response.statusCode == 200 && response.data['success'] == true) {
        final reply = response.data['data'] as String;
        _messages.add({'sender': 'bot', 'text': reply});
      } else {
        _errorMessage = 'Failed to get response';
      }
    } on DioException catch (e) {
      _errorMessage = e.message ?? 'Network error occurred';
    } catch (e) {
      _errorMessage = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }
}

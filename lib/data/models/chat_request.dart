class ChatRequest {
  final String message;

  ChatRequest({required this.message});

  Map<String, dynamic> toJson() {
    return {
      'message': message,
    };
  }
}

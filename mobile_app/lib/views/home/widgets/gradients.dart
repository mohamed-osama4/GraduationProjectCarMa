import 'package:flutter/material.dart';

class AppGradients {
  static const List<Color> gradient1 = [Color(0xFF51A2FF), Color(0xFF155DFC)];
  static const List<Color> gradient2 = [Color(0xFFFDC700), Color(0xFFFF6900)];
  static const List<Color> gradient3 = [Color(0xFF00D3F3), Color(0xFF2B7FFF)];
  static const List<Color> gradient4 = [Color(0xFF90A1B9), Color(0xFF45556C)];
  static const List<Color> gradient5 = [Color(0xFF1C398E), Color(0xFF1447E6)];
  static LinearGradient getGradient(List<Color> colors) {
    return LinearGradient(
      colors: colors,
      begin: Alignment.centerLeft,
      end: Alignment.centerRight,
    );
  }
}

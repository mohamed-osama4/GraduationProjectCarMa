import 'package:flutter/material.dart';
import 'package:graduation_project/core/theme/app_theme.dart';

class AppGradients {
  // ── CarMa gold gradients (dark-mode primary) ──────────────────
  static const List<Color> gradient1 = [Color(0xFFE8C98A), Color(0xFFD9B07C)]; // gold light→gold
  static const List<Color> gradient2 = [Color(0xFFD9B07C), Color(0xFFBF8C4E)]; // gold→darker gold
  static const List<Color> gradient3 = [Color(0xFFBF9B6E), Color(0xFF8B6734)]; // warm amber
  static const List<Color> gradient4 = [Color(0xFF8B6734), Color(0xFF5C4220)]; // deep amber
  static const List<Color> gradient5 = [Color(0xFF1A1A1A), Color(0xFF050505)]; // dark (drawer header)

  static LinearGradient getGradient(List<Color> colors) {
    return LinearGradient(
      colors: colors,
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    );
  }

  /// Returns a gold gradient for selected/focused states
  static LinearGradient get goldGradient => const LinearGradient(
        colors: [AppTheme.carmaGold, AppTheme.carmaGoldDim],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      );

  /// Dark surface gradient (used for icon boxes in dark mode)
  static LinearGradient get darkSurfaceGradient => const LinearGradient(
        colors: [AppTheme.carmaSurface, AppTheme.carmaCardFocus],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      );
}

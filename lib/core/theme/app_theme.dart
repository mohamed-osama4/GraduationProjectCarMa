import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // ── Light theme colors ─────────────────────────────────────────
  static const Color primaryColor = Color(0xff1D4ED8);
  static const Color secondaryColor = Color(0xffF97316);
  static const Color errorColor = Color(0xffEF4444);
  static const Color successColor = Color(0xff27AE60);
  static const Color backgroundColor = Color(0xffF9FAFB);
  static const Color textColor = Color(0xff1F2937);
  static const Color subtleTextColor = Color(0xff62748E);
  static const Color borderColor = Color(0xffE2E8F0);
  static const Color warningColor = Color(0xffFFA726);

  // ── CarMa brand / dark theme colors (matches website) ──────────
  static const Color carmaGold = Color(0xFFD9B07C);       // #D9B07C – primary gold
  static const Color carmaDark = Color(0xFF121212);        // #121212 – main background
  static const Color carmaDeepDark = Color(0xFF050505);   // #050505 – deepest bg
  static const Color carmaSurface = Color(0xFF1A1A1A);    // card / surface
  static const Color carmaCardFocus = Color(0xFF232323);  // focused / selected card
  static const Color carmaOutline = Color(0xFF2A2A2A);    // card border
  static const Color carmaGoldDim = Color(0xFFBF8C4E);    // darker gold accent
  static const Color carmaSubtleText = Color(0xFF9A9A9A); // muted text

  static final ValueNotifier<ThemeMode> themeNotifier = ValueNotifier(
    ThemeMode.dark,
  );

  /// Arabic UI: Tajawal — modern, clean, iOS-like for Arabic
  /// English UI: Inter — closest to SF Pro (Apple's system font)
  static String get arabicFont => GoogleFonts.tajawal().fontFamily!;
  static String get englishFont => GoogleFonts.almarai().fontFamily!;

  // ══════════════════════════════════════════════════════════════
  //  LIGHT THEME
  // ══════════════════════════════════════════════════════════════
  static ThemeData get lightTheme {
    return ThemeData(
      primaryColor: primaryColor,
      scaffoldBackgroundColor: backgroundColor,
      fontFamily: arabicFont,
      colorScheme: ColorScheme.light(
        primary: primaryColor,
        secondary: secondaryColor,
        error: errorColor,
        surface: Colors.white,
        onSurface: textColor,
        onSurfaceVariant: subtleTextColor,
        outline: borderColor,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: backgroundColor,
        elevation: 0,
        centerTitle: true,
        surfaceTintColor: Colors.white,
        iconTheme: const IconThemeData(color: textColor),
        titleTextStyle: TextStyle(
          color: textColor,
          fontSize: 20,
          fontWeight: FontWeight.w700,
          fontFamily: GoogleFonts.tajawal().fontFamily,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            fontFamily: GoogleFonts.tajawal().fontFamily,
          ),
          minimumSize: const Size(double.infinity, 48),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: subtleTextColor,
          side: const BorderSide(color: borderColor),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            fontFamily: GoogleFonts.tajawal().fontFamily,
          ),
          minimumSize: const Size(double.infinity, 48),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: borderColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: borderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primaryColor),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: errorColor),
        ),
        hintStyle: TextStyle(
          color: const Color(0xff94A3B8),
          fontSize: 14,
          fontWeight: FontWeight.w400,
          fontFamily: GoogleFonts.tajawal().fontFamily,
        ),
      ),
    );
  }

  // ══════════════════════════════════════════════════════════════
  //  DARK THEME  – matches CarMa website exactly
  //  Colors: #D9B07C (gold) · #121212 (bg) · #050505 (deep bg)
  // ══════════════════════════════════════════════════════════════
  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: carmaGold,
      scaffoldBackgroundColor: carmaDark,
      fontFamily: GoogleFonts.tajawal().fontFamily,
      colorScheme: const ColorScheme.dark(
        primary: carmaGold,           // gold accent – used for selected states
        secondary: carmaGoldDim,      // darker gold
        error: Color(0xffEF4444),
        surface: carmaSurface,        // #1A1A1A – cards / drawers
        onSurface: Colors.white,
        onSurfaceVariant: carmaSubtleText,   // muted text
        outline: carmaOutline,        // #2A2A2A – card borders
        primaryContainer: carmaCardFocus,    // focused/selected card bg
        onPrimary: carmaDark,         // text on gold buttons
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: carmaSurface,
        elevation: 0,
        centerTitle: true,
        surfaceTintColor: Colors.transparent,
        iconTheme: const IconThemeData(color: carmaGold),
        titleTextStyle: TextStyle(
          color: Colors.white,
          fontSize: 20,
          fontWeight: FontWeight.w700,
          fontFamily: GoogleFonts.tajawal().fontFamily,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: carmaGold,
          foregroundColor: carmaDark,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            fontFamily: GoogleFonts.tajawal().fontFamily,
          ),
          minimumSize: const Size(double.infinity, 48),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: carmaGold,
          side: const BorderSide(color: carmaOutline),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            fontFamily: GoogleFonts.tajawal().fontFamily,
          ),
          minimumSize: const Size(double.infinity, 48),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: carmaSurface,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: carmaOutline),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: carmaOutline),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: carmaGold, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xffEF4444)),
        ),
        hintStyle: TextStyle(
          color: carmaSubtleText,
          fontSize: 14,
          fontWeight: FontWeight.w400,
          fontFamily: GoogleFonts.tajawal().fontFamily,
        ),
        labelStyle: const TextStyle(color: carmaSubtleText),
        floatingLabelStyle: const TextStyle(color: carmaGold),
      ),
      dividerColor: carmaOutline,
      cardColor: carmaSurface,
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: carmaSurface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
      ), dialogTheme: DialogThemeData(backgroundColor: carmaSurface),
    );
  }
}

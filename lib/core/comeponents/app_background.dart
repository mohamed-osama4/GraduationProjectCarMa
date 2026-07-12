import 'package:flutter/material.dart';
import 'package:graduation_project/core/theme/app_theme.dart';

class AppBackground extends StatelessWidget {
  final Widget child;

  const AppBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: Theme.of(context).brightness == Brightness.dark
            ? const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppTheme.carmaDeepDark,
                  Color(0xFF1C1F24), // A darker charcoal/grayish "farani" break
                ],
              )
            : null,
        color: Theme.of(context).brightness != Brightness.dark
            ? Theme.of(context).scaffoldBackgroundColor
            : null,
      ),
      child: child,
    );
  }
}

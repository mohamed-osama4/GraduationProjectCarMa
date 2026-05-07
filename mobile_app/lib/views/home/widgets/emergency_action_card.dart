import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:provider/provider.dart';

class EmergencyActionCard extends StatelessWidget {
  final String title;
  final String svg;
  final Color color;
  final Color borderColor;
  final Color backgroundColor;
  final Color actionColor;
  final VoidCallback onTap;

  const EmergencyActionCard({
    super.key,
    required this.title,
    required this.svg,
    required this.color,
    required this.borderColor,
    required this.backgroundColor,
    required this.actionColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: borderColor),
          boxShadow: [
            BoxShadow(
              color: const Color(0xff000000).withValues(alpha: 0.10),
              offset: const Offset(0, 1),
              blurRadius: 2,
            ),
            BoxShadow(
              color: const Color(0xff000000).withValues(alpha: 0.10),
              offset: const Offset(0, 1),
              blurRadius: 3,
            ),
          ],
        ),
        child: Column(
          children: [
            const SizedBox(height: 8),
            CircleAvatar(
              radius: 22,
              backgroundColor: backgroundColor,
              child: SvgPicture.asset(svg),
            ),
            const SizedBox(height: 16),
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                title,
                style: const TextStyle(
                  color: Colors.black,
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: actionColor,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                appStrings(context.watch<LocaleProvider>().isArabic).orderNow,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

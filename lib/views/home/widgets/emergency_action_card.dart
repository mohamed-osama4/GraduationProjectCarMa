import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:provider/provider.dart';

class EmergencyActionCard extends StatefulWidget {
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
  State<EmergencyActionCard> createState() => _EmergencyActionCardState();
}

class _EmergencyActionCardState extends State<EmergencyActionCard> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // In dark mode override colors to match the CarMa website palette
    final Color cardBg = isDark ? AppTheme.carmaSurface : widget.color;
    final Color cardBorder = isDark
        ? (_isPressed ? AppTheme.carmaGold : AppTheme.carmaOutline)
        : widget.borderColor;
    final Color iconBg = isDark
        ? AppTheme.carmaGold.withAlpha(25)
        : widget.backgroundColor;
    final Color actionColor = isDark ? AppTheme.carmaGold : widget.actionColor;
    final Color textColor = isDark ? Colors.white : Colors.black;

    return InkWell(
      onTap: widget.onTap,
      onHighlightChanged: (v) => setState(() => _isPressed = v),
      borderRadius: BorderRadius.circular(16),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
        decoration: BoxDecoration(
          color: _isPressed && isDark ? AppTheme.carmaCardFocus : cardBg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: cardBorder,
            width: _isPressed && isDark ? 1.5 : 1.0,
          ),
          boxShadow: [
            if (_isPressed && isDark)
              BoxShadow(
                color: AppTheme.carmaGold.withAlpha(45),
                blurRadius: 14,
                spreadRadius: 1,
                offset: const Offset(0, 2),
              )
            else
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.10),
                offset: const Offset(0, 1),
                blurRadius: isDark ? 6 : 2,
              ),
          ],
        ),
        child: Column(
          children: [
            const SizedBox(height: 8),
            CircleAvatar(
              radius: 22,
              backgroundColor: iconBg,
              child: SvgPicture.asset(
                widget.svg,
                // SVGs are now gold; in dark mode show as-is, light mode keep original color
                colorFilter: isDark
                    ? null
                    : ColorFilter.mode(widget.actionColor, BlendMode.srcIn),
              ),
            ),
            const SizedBox(height: 16),
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                widget.title,
                style: TextStyle(
                  color: textColor,
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
                style: TextStyle(
                  color: isDark ? AppTheme.carmaDark : Colors.white,
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

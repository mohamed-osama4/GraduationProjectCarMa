import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:provider/provider.dart';
import 'package:graduation_project/views/home/widgets/gradients.dart';

class ServiceCard extends StatefulWidget {
  final String title;
  final String svg;
  final VoidCallback onTap;
  final Color? color;
  final List<Color>? gradientColors;

  const ServiceCard({
    super.key,
    this.gradientColors,
    required this.title,
    required this.svg,
    required this.onTap,
    this.color,
  });

  @override
  State<ServiceCard> createState() => _ServiceCardState();
}

class _ServiceCardState extends State<ServiceCard> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final List<Color> colorsToUse =
        widget.gradientColors ?? AppGradients.gradient1;

    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) {
        setState(() => _isPressed = false);
        widget.onTap();
      },
      onTapCancel: () => setState(() => _isPressed = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        curve: Curves.easeOut,
        decoration: BoxDecoration(
          color:
              _isPressed && isDark
                  ? AppTheme.carmaCardFocus
                  : Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color:
                _isPressed
                    ? AppTheme.carmaGold
                    : (isDark
                        ? AppTheme.carmaOutline
                        : Theme.of(context).colorScheme.outline),
            width: _isPressed ? 1.5 : 1.0,
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
                color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.05),
                blurRadius: 6,
                offset: const Offset(0, 4),
              ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Colored / Dark top icon section
            Expanded(
              flex: 3,
              child: Container(
                decoration: BoxDecoration(
                  // Dark mode: dark surface with subtle gold border-bottom
                  // Light mode: keep gradient
                  gradient:
                      isDark
                          ? AppGradients.darkSurfaceGradient
                          : AppGradients.getGradient(colorsToUse),
                  border:
                      isDark
                          ? const Border(
                            bottom: BorderSide(
                              color: AppTheme.carmaOutline,
                              width: 1,
                            ),
                          )
                          : null,
                ),
                child: Center(
                  child: SvgPicture.asset(
                    widget.svg,
                    height: 36,
                    width: 36,
                    // SVGs are now already gold; in dark mode show them as-is
                    // In light mode apply white to contrast against gradient bg
                    colorFilter:
                        isDark
                            ? null
                            : const ColorFilter.mode(
                              Colors.white,
                              BlendMode.srcIn,
                            ),
                  ),
                ),
              ),
            ),
            // Bottom label section
            Expanded(
              flex: 4,
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Text(
                        widget.title,
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.onSurface,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                        maxLines: 1,
                      ),
                    ),
                    const SizedBox(height: 2),
                    FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Text(
                        s.isArabic ? 'تفاصيل الخدمة' : 'Service Details',
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                          fontSize: 10,
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Expanded(
                      child: Container(
                        width: double.infinity,
                        decoration: BoxDecoration(
                          color:
                              isDark
                                  ? AppTheme.carmaGold.withAlpha(25)
                                  : Theme.of(context).scaffoldBackgroundColor,
                          borderRadius: BorderRadius.circular(8),
                          border:
                              isDark
                                  ? Border.all(
                                    color: AppTheme.carmaGold.withAlpha(60),
                                    width: 1,
                                  )
                                  : null,
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          s.isArabic ? 'ابدأ' : 'Start',
                          style: TextStyle(
                            color:
                                isDark
                                    ? AppTheme.carmaGold
                                    : Theme.of(
                                      context,
                                    ).colorScheme.onSurfaceVariant,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

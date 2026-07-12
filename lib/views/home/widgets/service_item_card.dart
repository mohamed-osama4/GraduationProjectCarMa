import 'package:flutter/material.dart';
import 'package:graduation_project/core/comeponents/app_image.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:graduation_project/logic/providers/services_provider.dart';
import 'package:provider/provider.dart';
import 'package:graduation_project/views/home/widgets/gradients.dart';

class ServiceItemCard extends StatefulWidget {
  final Map<String, dynamic> service;
  final VoidCallback onTap;

  const ServiceItemCard({
    super.key,
    required this.service,
    required this.onTap,
  });

  @override
  State<ServiceItemCard> createState() => _ServiceItemCardState();
}

class _ServiceItemCardState extends State<ServiceItemCard> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    final svcProvider = context.watch<ServicesProvider>();
    final int serviceId = widget.service['serviceId'] ?? 1;
    final svc = svcProvider.serviceById(serviceId);
    String displayPrice = '—';
    if (svcProvider.isLoading) {
      displayPrice = s.isArabic ? 'جاري التحميل...' : 'Loading...';
    } else if (svc != null) {
      final double baseP = svc.price;
      int lowest = baseP.round();
      switch (serviceId) {
        case 1: lowest = (baseP * 0.5).round(); break; // Oil
        case 2: lowest = (baseP * 0.4).round(); break; // Battery
        case 3: lowest = (baseP * 0.4).round(); break; // Tire
        case 4: lowest = (baseP * 1.0).round(); break; // Wash
        case 5: lowest = (baseP * 0.44).round(); break; // Emergency
        case 6: lowest = (baseP * 0.75).round(); break; // Towing
      }
      displayPrice = s.isArabic ? 'يبدأ من $lowest جنيه' : 'Starts from $lowest EGP';
    }
    final String iconName = widget.service['icon'];
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // In dark mode → always use CarMa gold; light mode → use gradient accent
    final List<Color> gradient =
        widget.service['gradient'] as List<Color>? ?? AppGradients.gradient1;
    final Color accentColor =
        isDark ? AppTheme.carmaGold : gradient.last;

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
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: _isPressed
              ? (isDark ? AppTheme.carmaCardFocus : Theme.of(context).colorScheme.surface)
              : Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: _isPressed
                ? accentColor
                : (isDark ? AppTheme.carmaOutline : Theme.of(context).colorScheme.outline),
            width: _isPressed ? 1.5 : 1.0,
          ),
          boxShadow: [
            if (_isPressed && isDark)
              BoxShadow(
                color: AppTheme.carmaGold.withAlpha(38), // subtle gold glow on press
                blurRadius: 12,
                spreadRadius: 1,
                offset: const Offset(0, 2),
              )
            else
              BoxShadow(
                color: Colors.black.withAlpha(isDark ? 30 : 10),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Icon Box
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: isDark
                        ? AppTheme.carmaGold.withAlpha(25)
                        : AppGradients.getGradient(gradient).colors.first.withAlpha(30),
                    borderRadius: BorderRadius.circular(12),
                    border: isDark
                        ? Border.all(color: AppTheme.carmaGold.withAlpha(60), width: 1)
                        : null,
                  ),
                  child: Center(
                    child: AppImage(
                      image: iconName,
                      height: 32,
                      width: 32,
                      // SVGs are already gold; no colorFilter override needed
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                // Details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.service['title'],
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Theme.of(context).colorScheme.onSurface,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        widget.service['subtitle'],
                        style: TextStyle(
                          fontSize: 12,
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                          height: 1.4,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Text(
                            s.isArabic ? 'السعر: ' : 'Price: ',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                            ),
                          ),
                          Text(
                            displayPrice,
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: accentColor,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            // Action Button
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 10),
              decoration: BoxDecoration(
                color: isDark ? AppTheme.carmaGold : accentColor,
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: Text(
                s.isArabic ? 'ابدأ' : 'Start',
                style: TextStyle(
                  color: isDark ? AppTheme.carmaDark : Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

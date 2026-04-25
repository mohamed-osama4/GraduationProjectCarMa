import 'package:flutter/material.dart';
import 'package:graduation_project/core/comeponents/app_image.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/views/home/widgets/gradients.dart';

class ServiceItemCard extends StatelessWidget {
  final Map<String, dynamic> service;
  final VoidCallback onTap;

  const ServiceItemCard({
    super.key,
    required this.service,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final String iconName = service['icon'];
    
    // Identify specifically colored SVG icons
    final bool isEmergency = iconName == 'emergancy.svg' || iconName == 'emergency.svg';
    final bool isTruck = iconName == 'truck.svg';
    final bool isColoredSVG = isEmergency || isTruck;
    
    final List<Color> gradient = service['gradient'] as List<Color>? ?? AppGradients.gradient1;
    
    // Assign appropriate action colors
    Color actionColor = AppTheme.primaryColor;
    if (isEmergency) {
      actionColor = const Color(0xFFE7000B); // Red for emergency
    } else if (isTruck) {
      actionColor = const Color(0xFFF54900); // Orange for truck
    } else {
      actionColor = gradient.last;
    }

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Theme.of(context).colorScheme.outline),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(10), // ~0.04 opacity
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
                // Icon Box (Right in RTL)
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    gradient: isColoredSVG ? null : AppGradients.getGradient(gradient),
                    color: isColoredSVG ? actionColor.withAlpha(25) : null,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Center(
                    child: AppImage(
                      image: iconName,
                      height: 32,
                      width: 32,
                      color: isColoredSVG ? null : Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                // Details (Left in RTL)
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        service['title'],
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
                        service['subtitle'],
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
                            'السعر: ',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                            ),
                          ),
                          Text(
                            service['price'],
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: actionColor,
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
            // Action Button 'Start'
            GestureDetector(
              onTap: onTap,
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: actionColor,
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,
                child: const Text(
                  'ابدأ',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

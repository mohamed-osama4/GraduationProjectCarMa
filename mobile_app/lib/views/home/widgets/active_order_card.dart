import 'dart:io';
import 'package:flutter/material.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/core/comeponents/app_image.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:graduation_project/logic/providers/orders_provider.dart';
import 'package:graduation_project/views/home/order_details_page.dart';
import 'package:provider/provider.dart';


class ActiveOrderCard extends StatelessWidget {
  const ActiveOrderCard({super.key});

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);

    return Consumer<OrdersProvider>(
      builder: (context, ordersProvider, child) {
        if (ordersProvider.isLoading && ordersProvider.orders.isEmpty) {
          return const SizedBox.shrink();
        }

        // --- Mock UI for testing/preview when no actual orders exist ---
        if (ordersProvider.orders.isEmpty) {
          return _buildMockCard(context, s);
        }

        final activeOrder = ordersProvider.orders.first;

        // Only show card for active orders (not completed/rejected)
        if (activeOrder.isCompleted || activeOrder.isRejected) {
          return _buildMockCard(context, s); // Show mock if the actual order is done
        }

        String title    = s.orderPending;
        String subtitle = s.orderPendingSub;
        Color statusColor = AppTheme.warningColor;

        if (activeOrder.isAccepted || activeOrder.isInProgress) {
          title    = s.orderOnTheWay;
          subtitle = activeOrder.hasTechnician
              ? '${activeOrder.technicianName} ${s.isArabic ? "في الطريق إليك" : "is on the way"}'
              : s.orderOnTheWaySub;
          statusColor = AppTheme.successColor;
        }

        return Transform.translate(
          offset: const Offset(0, -30),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  offset: const Offset(0, 4),
                  blurRadius: 12,
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // ── Status row ──────────────────────────────
                Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: statusColor.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                        image: ordersProvider.imagePathForOrder(activeOrder.id) != null
                            ? DecorationImage(
                                image: FileImage(File(ordersProvider.imagePathForOrder(activeOrder.id)!)),
                                fit: BoxFit.cover,
                              )
                            : null,
                      ),
                      child: ordersProvider.imagePathForOrder(activeOrder.id) == null
                          ? Icon(
                              activeOrder.isAccepted || activeOrder.isInProgress
                                  ? Icons.directions_car_rounded
                                  : Icons.access_time_filled,
                              color: statusColor,
                            )
                          : null,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: TextStyle(
                              fontWeight: FontWeight.w700,
                              color: Theme.of(context).colorScheme.onSurface,
                              fontSize: 15,
                            ),
                          ),
                          Text(
                            subtitle,
                            style: TextStyle(
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Status dot
                    Container(
                      width: 10,
                      height: 10,
                      decoration: BoxDecoration(color: statusColor, shape: BoxShape.circle),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // ── View Details button ──────────────────────
                GestureDetector(
                  onTap: () {
                    final imgPath = ordersProvider.imagePathForOrder(activeOrder.id);
                    final svcName = ordersProvider.serviceNameForOrder(activeOrder.id) ?? '';
                    final notes   = ordersProvider.notesForOrder(activeOrder.id);
                    OrderDetailsPage.show(context, activeOrder,
                        serviceName: svcName, carImagePath: imgPath, notes: notes);
                  },
                  child: Container(
                    width: double.infinity,
                    height: 44,
                    decoration: BoxDecoration(
                      color: Theme.of(context).scaffoldBackgroundColor,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    alignment: Alignment.center,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          s.viewDetails,
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.onSurface,
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(width: 8),
                        AppImage(
                          image: 'arroww.svg',
                          width: 13,
                          height: 13,
                          color: Theme.of(context).colorScheme.onSurface,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // Helper method to show a mock card when there are no real orders
  // This keeps the UI looking like the design the user wanted to see.
  Widget _buildMockCard(BuildContext context, dynamic s) {
    return Transform.translate(
      offset: const Offset(0, -30),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              offset: const Offset(0, 4),
              blurRadius: 12,
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppTheme.warningColor.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.access_time_filled,
                    color: AppTheme.warningColor,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        s.orderPending, // "Your order is being reviewed"
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          color: Theme.of(context).colorScheme.onSurface,
                          fontSize: 15,
                        ),
                      ),
                      Text(
                        s.orderPendingSub, // "We will get back to you soon"
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  width: 10,
                  height: 10,
                  decoration: const BoxDecoration(
                    color: AppTheme.warningColor,
                    shape: BoxShape.circle,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              height: 44,
              decoration: BoxDecoration(
                color: Theme.of(context).scaffoldBackgroundColor,
                borderRadius: BorderRadius.circular(12),
              ),
              alignment: Alignment.center,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'لا توجد طلبات حالية',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

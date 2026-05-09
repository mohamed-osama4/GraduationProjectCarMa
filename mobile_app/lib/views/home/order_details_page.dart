import 'dart:io';
import 'package:flutter/material.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/data/models/order_model.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:provider/provider.dart';

/// Shown when user taps "View Details" on the ActiveOrderCard.
/// Displays full order info + technician details when assigned.
class OrderDetailsPage extends StatelessWidget {
  final OrderModel order;
  final String serviceName;
  final String? carImagePath; // local path of car photo (if uploaded)
  final String? notes;

  const OrderDetailsPage({
    super.key,
    required this.order,
    required this.serviceName,
    this.carImagePath,
    this.notes,
  });

  static void show(BuildContext context, OrderModel order, {String serviceName = '', String? carImagePath, String? notes}) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => OrderDetailsPage(
          order: order,
          serviceName: serviceName,
          carImagePath: carImagePath,
          notes: notes,
        ),
      ),
    );
  }

  Color _statusColor(OrderStatus s) {
    switch (s) {
      case OrderStatus.accepted:
      case OrderStatus.onTheWay:    return AppTheme.successColor;
      case OrderStatus.inProgress:
      case OrderStatus.underProcess: return AppTheme.primaryColor;
      case OrderStatus.completed:   return AppTheme.primaryColor;
      case OrderStatus.rejected:
      case OrderStatus.canceled:    return AppTheme.errorColor;
      default:                      return AppTheme.warningColor;
    }
  }

  String _statusLabel(OrderStatus s, AppStrings str) {
    switch (s) {
      case OrderStatus.accepted:
      case OrderStatus.onTheWay:    return str.orderOnTheWay;
      case OrderStatus.inProgress:
      case OrderStatus.underProcess: return str.orderUnderProcess;
      case OrderStatus.completed:   return str.orderCompleted;
      case OrderStatus.rejected:
      case OrderStatus.canceled:    return str.isArabic ? 'مرفوض' : 'Rejected';
      default:                      return str.orderPending;
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    final statusColor = _statusColor(order.orderStatus);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
        title: Text(s.isArabic ? 'تفاصيل الطلب' : 'Order Details',
            style: const TextStyle(color: Colors.white)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            // ── Status Banner ─────────────────────────────────────
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: statusColor.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: statusColor.withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: statusColor.withValues(alpha: 0.12),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      order.isCompleted
                          ? Icons.check_circle_rounded
                          : (order.isAccepted || order.isInProgress)
                              ? Icons.directions_car_rounded
                              : order.isRejected
                                  ? Icons.cancel_rounded
                                  : Icons.access_time_rounded,
                      color: statusColor,
                      size: 28,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _statusLabel(order.orderStatus, s),
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: statusColor),
                        ),
                        if (order.estimatedArrival != null &&
                            (order.isAccepted || order.isInProgress))
                          Padding(
                            padding: const EdgeInsets.only(top: 4),
                            child: Text(
                              '${s.isArabic ? "الوصول خلال" : "Arriving in"} ${order.estimatedArrival} ${s.isArabic ? "دقيقة" : "min"}',
                              style: TextStyle(color: statusColor, fontSize: 13, fontWeight: FontWeight.w600),
                            ),
                          ),
                      ],
                    ),
                  ),
                  // Order number badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: statusColor.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      '#${order.id}',
                      style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // ── Car Photo ─────────────────────────────────────────
            if (carImagePath != null) ...[
              _SectionTitle(s.isArabic ? 'صورة السيارة' : 'Car Photo'),
              const SizedBox(height: 12),
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.file(
                  File(carImagePath!),
                  width: double.infinity,
                  height: 200,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(height: 24),
            ],

            // ── Service Info ──────────────────────────────────────
            _SectionTitle(s.isArabic ? 'تفاصيل الخدمة' : 'Service Details'),
            const SizedBox(height: 12),
            _InfoCard(children: [
              _DetailRow(
                icon: Icons.build_rounded,
                label: s.isArabic ? 'الخدمة' : 'Service',
                value: serviceName.isNotEmpty ? serviceName : 'Service #${order.serviceId}',
              ),
              _Divider(),
              _DetailRow(
                icon: Icons.location_on_outlined,
                label: s.isArabic ? 'العنوان' : 'Address',
                value: order.address,
              ),
              _Divider(),
              _DetailRow(
                icon: Icons.phone_android,
                label: s.isArabic ? 'رقم الهاتف' : 'Phone',
                value: order.phoneNumber,
                isPhone: true,
              ),
              _Divider(),
              _DetailRow(
                icon: Icons.calendar_today_outlined,
                label: s.isArabic ? 'تاريخ الطلب' : 'Order Date',
                value: _formatDate(order.createdAt, s.isArabic),
              ),
              if (notes != null && notes!.isNotEmpty) ...[
                _Divider(),
                _DetailRow(
                  icon: Icons.notes_rounded,
                  label: s.isArabic ? 'ملاحظات إضافية' : 'Additional Notes',
                  value: notes!,
                ),
              ],
            ]),
            const SizedBox(height: 20),

            // ── Technician Info (if assigned) ─────────────────────
            if (order.hasTechnician) ...[
              _SectionTitle(s.isArabic ? 'معلومات الفني' : 'Technician Info'),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.successColor.withValues(alpha: 0.06),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.successColor.withValues(alpha: 0.25)),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: AppTheme.successColor.withValues(alpha: 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.engineering, color: AppTheme.successColor, size: 30),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(order.technicianName ?? '', style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 4),
                          Row(children: [
                            const Icon(Icons.star, color: Colors.amber, size: 16),
                            const SizedBox(width: 4),
                            Text(order.technicianRating?.toStringAsFixed(1) ?? '—',
                                style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13)),
                          ]),
                          if (order.technicianPhone != null)
                            Padding(
                              padding: const EdgeInsets.only(top: 4),
                              child: Text(
                                order.technicianPhone!,
                                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                                textDirection: TextDirection.ltr,
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],

            // ── Pending note ──────────────────────────────────────
            if (order.isPending)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.warningColor.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppTheme.warningColor.withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline, color: AppTheme.warningColor),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        s.isArabic
                            ? 'طلبك قيد المراجعة. سيتم إخطارك عند تعيين الفني.'
                            : 'Your order is being reviewed. You\'ll be notified when a technician is assigned.',
                        style: TextStyle(color: AppTheme.warningColor, fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime dt, bool isArabic) {
    final months = isArabic
        ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${dt.day} ${months[dt.month - 1]} ${dt.year}';
  }
}

// ── Helpers ──────────────────────────────────────────────────────

class _SectionTitle extends StatelessWidget {
  final String text;
  const _SectionTitle(this.text);
  @override
  Widget build(BuildContext context) {
    return Text(text, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSurface));
  }
}

class _InfoCard extends StatelessWidget {
  final List<Widget> children;
  const _InfoCard({required this.children});
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 2))],
      ),
      child: Column(children: children),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final bool isPhone;
  const _DetailRow({required this.icon, required this.label, required this.value, this.isPhone = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppTheme.primaryColor),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(label, style: TextStyle(fontSize: 11, color: Theme.of(context).colorScheme.onSurfaceVariant)),
              const SizedBox(height: 2),
              Text(value,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                  textDirection: isPhone ? TextDirection.ltr : null),
            ]),
          ),
        ],
      ),
    );
  }
}

class _Divider extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Divider(
      height: 1, color: Theme.of(context).colorScheme.outline.withValues(alpha: 0.3), indent: 48);
}

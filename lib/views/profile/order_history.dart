import 'package:flutter/material.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/data/models/order_model.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:graduation_project/logic/providers/orders_provider.dart';
import 'package:graduation_project/views/home/order_details_page.dart';
import 'package:provider/provider.dart';

class OrderHistoryPage extends StatefulWidget {
  const OrderHistoryPage({super.key});

  @override
  State<OrderHistoryPage> createState() => _OrderHistoryPageState();
}

class _OrderHistoryPageState extends State<OrderHistoryPage> {
  @override
  void initState() {
    super.initState();
    // Refresh orders when the page opens
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<OrdersProvider>().fetchOrders();
    });
  }

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        appBar: AppBar(
          title: Text(s.myOrders),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => Navigator.pop(context),
          ),
          bottom: TabBar(
            labelColor: AppTheme.primaryColor,
            unselectedLabelColor: Theme.of(context).colorScheme.onSurfaceVariant,
            indicatorColor: AppTheme.primaryColor,
            labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            tabs: [
              Tab(text: s.isArabic ? 'الحالية' : 'Active'),
              Tab(text: s.isArabic ? 'السابقة' : 'Past'),
            ],
          ),
        ),
        body: Consumer<OrdersProvider>(
          builder: (context, provider, _) {
            if (provider.isLoading && provider.orders.isEmpty) {
              return const Center(child: CircularProgressIndicator());
            }
            if (provider.errorMessage != null && provider.orders.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.wifi_off, size: 60, color: Colors.grey),
                    const SizedBox(height: 16),
                    Text(
                      s.isArabic ? 'تعذر تحميل الطلبات' : 'Failed to load orders',
                      style: const TextStyle(fontSize: 16),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: () => provider.fetchOrders(),
                      child: Text(s.isArabic ? 'إعادة المحاولة' : 'Retry'),
                    ),
                  ],
                ),
              );
            }

            final activeOrders = provider.orders.where((o) => o.isActive).toList();
            final pastOrders   = provider.orders.where((o) => !o.isActive).toList();

            return TabBarView(
              children: [
                _OrderList(orders: activeOrders, isActive: true, provider: provider, s: s),
                _OrderList(orders: pastOrders, isActive: false, provider: provider, s: s),
              ],
            );
          },
        ),
      ),
    );
  }
}

// ── Order List ─────────────────────────────────────────────────────────────

class _OrderList extends StatelessWidget {
  final List<OrderModel> orders;
  final bool isActive;
  final OrdersProvider provider;
  final AppStrings s;
  const _OrderList({required this.orders, required this.isActive, required this.provider, required this.s});

  @override
  Widget build(BuildContext context) {
    if (orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isActive ? Icons.hourglass_empty : Icons.history,
              size: 80,
              color: Theme.of(context).colorScheme.onSurfaceVariant.withValues(alpha: 0.4),
            ),
            const SizedBox(height: 16),
            Text(
              isActive
                  ? (s.isArabic ? 'لا توجد طلبات حالية' : 'No active orders')
                  : (s.isArabic ? 'لا توجد طلبات سابقة' : 'No past orders'),
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
                fontSize: 16,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(24),
      physics: const BouncingScrollPhysics(),
      itemCount: orders.length,
      separatorBuilder: (_, __) => const SizedBox(height: 16),
      itemBuilder: (context, i) => _OrderCard(
        order: orders[i],
        isActive: isActive,
        provider: provider,
        s: s,
      ),
    );
  }
}

// ── Order Card ──────────────────────────────────────────────────────────────

class _OrderCard extends StatelessWidget {
  final OrderModel order;
  final bool isActive;
  final OrdersProvider provider;
  final AppStrings s;
  const _OrderCard({required this.order, required this.isActive, required this.provider, required this.s});

  Color _statusColor(OrderModel o) {
    if (o.isCompleted)  return AppTheme.successColor;
    if (o.isRejected)   return AppTheme.errorColor;
    if (o.isAccepted || o.isInProgress) return AppTheme.successColor;
    return AppTheme.warningColor;
  }

  String _statusLabel(OrderModel o) {
    if (o.isCompleted)   return s.orderCompleted;
    if (o.isRejected)    return s.isArabic ? 'مرفوض' : 'Rejected';
    if (o.isInProgress)  return s.orderUnderProcess;
    if (o.isAccepted)    return s.orderOnTheWay;
    return s.isArabic ? 'قيد المراجعة' : 'Pending';
  }

  IconData _icon(OrderModel o) {
    if (o.isCompleted) return Icons.check_circle_outline;
    if (o.isRejected)  return Icons.cancel_outlined;
    if (o.isAccepted || o.isInProgress) return Icons.directions_car_rounded;
    return Icons.access_time_rounded;
  }

  @override
  Widget build(BuildContext context) {
    final svcName = provider.serviceNameForOrder(order.id) ?? 'Service #${order.serviceId}';
    final statusColor = _statusColor(order);
    final imgPath = provider.imagePathForOrder(order.id);
    final notes   = provider.notesForOrder(order.id);

    return GestureDetector(
      onTap: isActive
          ? () => OrderDetailsPage.show(context, order,
              serviceName: svcName, carImagePath: imgPath, notes: notes)
          : null,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Theme.of(context).colorScheme.outline),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            // ── Header row ──────────────────────────────────────
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${s.isArabic ? 'الطلب' : 'Order'} #${order.id}',
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                    fontSize: 14,
                  ),
                ),
                Row(
                  children: [
                    // Payment badge
                    if (order.isPaid)
                      Container(
                        margin: const EdgeInsets.only(left: 6),
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppTheme.successColor.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          s.isArabic ? 'مدفوع' : 'Paid',
                          style: const TextStyle(color: AppTheme.successColor, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                    const SizedBox(width: 6),
                    // Status badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: statusColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        _statusLabel(order),
                        style: TextStyle(color: statusColor, fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            // ── Body row ─────────────────────────────────────────
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(_icon(order), color: statusColor),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        svcName,
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.onSurface,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _formatDate(order.createdAt, s.isArabic),
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '${order.price.toStringAsFixed(0)} ${s.isArabic ? 'ج.م' : 'EGP'}',
                      style: const TextStyle(
                        color: AppTheme.primaryColor,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            if (isActive) ...[
              const SizedBox(height: 16),
              Divider(color: Theme.of(context).colorScheme.outline),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    s.isArabic ? 'عرض التفاصيل وتتبع الطلب' : 'View details & track order',
                    style: const TextStyle(
                      color: AppTheme.primaryColor,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Icon(Icons.arrow_forward, size: 16, color: AppTheme.primaryColor),
                ],
              ),
            ],
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

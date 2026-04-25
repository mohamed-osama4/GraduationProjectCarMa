import 'package:flutter/material.dart';
import 'package:graduation_project/core/theme/app_theme.dart';

class OrderHistoryPage extends StatelessWidget {
  const OrderHistoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        appBar: AppBar(
          title: const Text('طلباتي'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => Navigator.pop(context),
          ),
          bottom: TabBar(
            labelColor: AppTheme.primaryColor,
            unselectedLabelColor: Theme.of(context).colorScheme.onSurfaceVariant,
            indicatorColor: AppTheme.primaryColor,
            labelStyle: TextStyle(
              fontWeight: FontWeight.bold,
              fontFamily: 'Inter',
              fontSize: 16,
            ),
            tabs: [Tab(text: 'الحالية'), Tab(text: 'السابقة')],
          ),
        ),
        body: const TabBarView(
          children: [
            // Current Orders
            _OrderList(isActive: true),
            // Past Orders
            _OrderList(isActive: false),
          ],
        ),
      ),
    );
  }
}

class _OrderList extends StatelessWidget {
  final bool isActive;
  const _OrderList({required this.isActive});

  @override
  Widget build(BuildContext context) {
    if (isActive) {
      // Dummy Active Order
      return ListView(
        padding: const EdgeInsets.all(24),
        physics: const BouncingScrollPhysics(),
        children: [
          _buildOrderCard(
            context: context,
            orderId: '#10245',
            service: 'ونش هيدروليك',
            date: 'اليوم، 10:30 صباحاً',
            status: 'قيد التنفيذ',
            statusColor: AppTheme.secondaryColor,
            icon: Icons.car_repair,
            price: '150 ريال',
          ),
        ],
      );
    } else {
      // Dummy Past Orders
      return ListView(
        padding: const EdgeInsets.all(24),
        physics: const BouncingScrollPhysics(),
        children: [
          _buildOrderCard(
            context: context,
            orderId: '#10100',
            service: 'شحن بطارية',
            date: '12 مارس 2024',
            status: 'مكتمل',
            statusColor: AppTheme.successColor,
            icon: Icons.battery_charging_full,
            price: '70 ريال',
          ),
          const SizedBox(height: 16),
          _buildOrderCard(
            context: context,
            orderId: '#9892',
            service: 'تغيير إطارات',
            date: '05 فبراير 2024',
            status: 'مكتمل',
            statusColor: AppTheme.successColor,
            icon: Icons.tire_repair,
            price: '200 ريال',
          ),
        ],
      );
    }
  }

  Widget _buildOrderCard({
    required BuildContext context,
    required String orderId,
    required String service,
    required String date,
    required String status,
    required Color statusColor,
    required IconData icon,
    required String price,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).colorScheme.outline),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'الطلب $orderId',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                  fontSize: 14,
                  fontFamily: 'Inter',
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  status,
                  style: TextStyle(
                    color: statusColor,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'Inter',
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surfaceContainerHighest ,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: AppTheme.primaryColor),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      service,
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onSurface,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        fontFamily: 'Inter',
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      date,
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                        fontSize: 12,
                        fontFamily: 'Inter',
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                price,
                style: const TextStyle(
                  color: AppTheme.primaryColor,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'Inter',
                ),
              ),
            ],
          ),
          if (isActive) ...[
            const SizedBox(height: 16),
            Divider(color: Theme.of(context).colorScheme.outline),
            const SizedBox(height: 8),
            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'عرض التفاصيل وتتبع الطلب',
                  style: TextStyle(
                    color: AppTheme.primaryColor,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    fontFamily: 'Inter',
                  ),
                ),
                SizedBox(width: 8),
                Icon(
                  Icons.arrow_forward,
                  size: 16,
                  color: AppTheme.primaryColor,
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

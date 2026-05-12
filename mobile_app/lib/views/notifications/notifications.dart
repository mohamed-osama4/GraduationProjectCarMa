import 'package:flutter/material.dart';
import 'package:graduation_project/core/comeponents/app_image.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:graduation_project/logic/providers/notification_provider.dart';
import 'package:graduation_project/data/models/notification_model.dart';
import 'package:provider/provider.dart';

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<NotificationProvider>().fetchNotifications(refresh: true);
    });

    // Load more on scroll
    _scrollController.addListener(() {
      if (_scrollController.position.pixels >=
          _scrollController.position.maxScrollExtent - 200) {
        context.read<NotificationProvider>().fetchNotifications();
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  String getTimeAgo(DateTime timestamp, bool isArabic) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inDays > 365) {
      final years = (difference.inDays / 365).floor();
      return isArabic ? 'منذ $years سنة' : '$years years ago';
    } else if (difference.inDays > 30) {
      final months = (difference.inDays / 30).floor();
      return isArabic ? 'منذ $months شهر' : '$months months ago';
    } else if (difference.inDays > 7) {
      final weeks = (difference.inDays / 7).floor();
      return isArabic ? 'منذ $weeks أسبوع' : '$weeks weeks ago';
    } else if (difference.inDays >= 1) {
      return isArabic
          ? 'منذ ${difference.inDays} يوم'
          : '${difference.inDays} days ago';
    } else if (difference.inHours >= 1) {
      return isArabic
          ? 'منذ ${difference.inHours} ساعة'
          : '${difference.inHours} hours ago';
    } else if (difference.inMinutes >= 1) {
      return isArabic
          ? 'منذ ${difference.inMinutes} دقيقة'
          : '${difference.inMinutes} minutes ago';
    } else {
      return isArabic ? 'الآن' : 'Just now';
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    final provider = context.watch<NotificationProvider>();

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              s.notifications,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 20,
              ),
            ),
            if (provider.unreadCount > 0)
              Text(
                s.isArabic
                    ? '${provider.unreadCount} إشعار جديد'
                    : '${provider.unreadCount} new',
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.85),
                  fontSize: 12,
                ),
              ),
          ],
        ),
        centerTitle: false,
        titleSpacing: 0,
        actions: [
          if (provider.notifications.isNotEmpty)
            TextButton(
              onPressed: () => provider.markAllAsRead(),
              child: Text(
                s.isArabic ? 'قراءة الكل' : 'Read All',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
            ),
          TextButton(
            onPressed: () => provider.clearAll(),
            child: Text(
              s.isArabic ? 'مسح الكل' : 'Clear All',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
        backgroundColor: Colors.transparent,
        elevation: 0,
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [Color(0xff1C398E), Color(0xff1447E6)],
            ),
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _buildBody(context, s, provider),
    );
  }

  Widget _buildBody(
      BuildContext context, AppStrings s, NotificationProvider provider) {
    if (provider.isLoading && provider.notifications.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(color: AppTheme.primaryColor),
      );
    }

    if (provider.notifications.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.notifications_off_outlined,
              size: 100,
              color: AppTheme.subtleTextColor.withValues(alpha: 0.5),
            ),
            const SizedBox(height: 16),
            Text(
              s.isArabic ? 'لا توجد إشعارات' : 'No notifications',
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurface,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              s.isArabic
                  ? 'ستظهر الإشعارات الجديدة هنا'
                  : 'New notifications will appear here',
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
                fontSize: 14,
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      color: AppTheme.primaryColor,
      onRefresh: () =>
          context.read<NotificationProvider>().fetchNotifications(refresh: true),
      child: ListView.separated(
        controller: _scrollController,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
        physics: const BouncingScrollPhysics(),
        itemCount:
            provider.notifications.length + (provider.isLoading ? 1 : 0),
        separatorBuilder: (context, index) => const SizedBox(height: 16),
        itemBuilder: (context, index) {
          if (index == provider.notifications.length) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: CircularProgressIndicator(color: AppTheme.primaryColor),
              ),
            );
          }

          final AppNotification notification = provider.notifications[index];

          return GestureDetector(
            onTap: () =>
                context.read<NotificationProvider>().markAsRead(notification.id),
            child: Container(
              decoration: BoxDecoration(
                color: !notification.isRead
                    ? const Color(0xff155DFC)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.04),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Container(
                margin: !notification.isRead
                    ? const EdgeInsets.only(right: 4.5)
                    : EdgeInsets.zero,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: Theme.of(context).colorScheme.outline,
                    width: 1,
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: notification.iconBackgroundColor,
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: AppImage(
                          image: notification.iconAsset,
                          width: 24,
                          height: 24,
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: Text(
                                  notification.title,
                                  style: TextStyle(
                                    color: Theme.of(context).colorScheme.onSurface,
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              if (!notification.isRead) ...[
                                const SizedBox(width: 8),
                                Container(
                                  width: 8,
                                  height: 8,
                                  margin: const EdgeInsets.only(top: 6),
                                  decoration: const BoxDecoration(
                                    color: Color(0xff155DFC),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              ],
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            notification.message,
                            style: TextStyle(
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                              fontSize: 13,
                              height: 1.4,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              GestureDetector(
                                onTap: () => context
                                    .read<NotificationProvider>()
                                    .deleteNotification(notification.id),
                                child: AppImage(
                                  image: 'trush.svg',
                                  width: 18,
                                  height: 18,
                                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                                ),
                              ),
                              Text(
                                getTimeAgo(notification.createdAt, s.isArabic),
                                style: TextStyle(
                                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

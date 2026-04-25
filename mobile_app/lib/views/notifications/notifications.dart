import 'package:flutter/material.dart';
import 'package:graduation_project/core/comeponents/app_image.dart';
import 'package:graduation_project/core/theme/app_theme.dart';

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  List<NotificationModel> notifications = [];

  @override
  void initState() {
    super.initState();
    loadNotifications();
  }

  void loadNotifications() {
    notifications = [
      NotificationModel(
        id: '1',
        iconAsset: 'time.svg',
        iconBackgroundColor: const Color(0xffFEF3C6),
        title: 'طلبك قيد المراجعة',
        message: 'جاري مراجعة الطلب من قبل الإدارة',
        timestamp: DateTime.now().subtract(const Duration(minutes: 5)),
        isRead: false,
      ),
      NotificationModel(
        id: '2',
        iconAsset: 'accept.svg',
        iconBackgroundColor: const Color(0xffDCFCE7),
        title: 'تمت الموافقة على الطلب',
        message: 'يمكنك الآن متابعة حالة الطلب',
        timestamp: DateTime.now().subtract(const Duration(hours: 1)),
        isRead: false,
      ),
      NotificationModel(
        id: '3',
        iconAsset: 'done.svg',
        iconBackgroundColor: const Color(0xffDBEAFE),
        title: 'تم تعيين فني',
        message: 'جارٍ تجهيز التتبع',
        timestamp: DateTime.now().subtract(const Duration(hours: 2)),
        isRead: false,
      ),
      NotificationModel(
        id: '4',
        iconAsset: 'trucks.svg',
        iconBackgroundColor: const Color(0xffF3E8FF),
        title: 'الفني في الطريق',
        message: 'الرجاء الانتظار، الفني في طريقه إليك',
        timestamp: DateTime.now().subtract(const Duration(days: 1)),
        isRead: false,
      ),
      NotificationModel(
        id: '5',
        iconAsset: 'star.svg',
        iconBackgroundColor: const Color(0xffFEF9C2),
        title: 'اكتملت الخدمة',
        message: 'شكراً لاستخدامك خدماتنا، نأمل تقييم الخدمة',
        timestamp: DateTime.now().subtract(const Duration(days: 2)),
        isRead: true,
      ),
      NotificationModel(
        id: '6',
        iconAsset: 'fales.svg',
        iconBackgroundColor: const Color(0xffFFE2E2),
        title: 'تم رفض الطلب',
        message: 'يمكنك تعديل الطلب واعادة الارسال',
        timestamp: DateTime.now().subtract(const Duration(days: 3)),
        isRead: true,
      ),
    ];
  }

  void markAllAsRead() {
    setState(() {
      for (var notification in notifications) {
        notification.isRead = true;
      }
    });
  }

  void markAsRead(String id) {
    setState(() {
      final index = notifications.indexWhere((n) => n.id == id);
      if (index != -1) {
        notifications[index].isRead = true;
      }
    });
  }

  void deleteNotification(String id) {
    setState(() {
      notifications.removeWhere((n) => n.id == id);
    });
  }

  String getTimeAgo(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inDays > 365) {
      return 'منذ ${(difference.inDays / 365).floor()} سنة';
    } else if (difference.inDays > 30) {
      return 'منذ ${(difference.inDays / 30).floor()} شهر';
    } else if (difference.inDays > 7) {
      return 'منذ ${(difference.inDays / 7).floor()} أسبوع';
    } else if (difference.inDays >= 1) {
      return 'منذ ${difference.inDays} يوم';
    } else if (difference.inHours >= 1) {
      return 'منذ ${difference.inHours} ساعة';
    } else if (difference.inMinutes >= 1) {
      return 'منذ ${difference.inMinutes} دقيقة';
    } else {
      return 'الآن';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text(
          'الإشعارات',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        centerTitle: false,
        titleSpacing: 0,
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                notifications.clear();
              });
            },
            child: const Text(
              'مسح الكل',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w600,
                fontSize: 16,
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
      body:
          notifications.isEmpty
              ? Center(
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
                      'لا توجد إشعارات',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onSurface,
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'ستظهر الإشعارات الجديدة هنا',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              )
              : ListView.separated(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 24,
                ),
                physics: const BouncingScrollPhysics(),
                itemCount: notifications.length,
                separatorBuilder:
                    (context, index) => const SizedBox(height: 16),
                itemBuilder: (context, index) {
                  final notification = notifications[index];

                  return GestureDetector(
                    onTap: () => markAsRead(notification.id),
                    child: Container(
                      decoration: BoxDecoration(
                        color:
                            !notification.isRead
                                ? const Color(0xff155DFC)
                                : Colors
                                    .transparent, // Blue edge ONLY for unread items
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.04), // soft shadow
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Container(
                        margin:
                            !notification.isRead
                                ? const EdgeInsets.only(
                                  right: 4.5,
                                ) // Stack effect on the right side
                                : EdgeInsets.zero,
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.surface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Theme.of(context).colorScheme.outline, // Very light border
                            width: 1,
                          ),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Custom icon with colored background
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
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
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
                                      const SizedBox(width: 8),
                                      Text(
                                        getTimeAgo(notification.timestamp),
                                        style: TextStyle(
                                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                                          fontSize: 12,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      GestureDetector(
                                        onTap:
                                            () => deleteNotification(
                                              notification.id,
                                            ),
                                        child: AppImage(
                                          image: 'trush.svg',
                                          width: 18,
                                          height: 18,
                                          color: Theme.of(context).colorScheme.onSurfaceVariant, // Trash icon added here
                                        ),
                                      ),
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

// Notification Model
class NotificationModel {
  final String id;
  final String iconAsset;
  final Color iconBackgroundColor;
  final String title;
  final String message;
  final DateTime timestamp;
  bool isRead;

  NotificationModel({
    required this.id,
    required this.iconAsset,
    required this.iconBackgroundColor,
    required this.title,
    required this.message,
    required this.timestamp,
    required this.isRead,
  });
}

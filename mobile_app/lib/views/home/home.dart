import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:graduation_project/core/comeponents/app_image.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:graduation_project/views/ai_chat/ai_chat_page.dart';
import 'package:graduation_project/views/home/widgets/gradients.dart';
import 'package:graduation_project/views/home/widgets/active_order_card.dart';
import 'package:graduation_project/views/home/widgets/emergency_action_card.dart';
import 'package:graduation_project/views/home/widgets/service_card.dart';
import 'package:graduation_project/views/home/widgets/services_page.dart';
import 'package:graduation_project/views/notifications/notifications.dart';
import 'package:graduation_project/views/profile/profile.dart';
import 'package:graduation_project/views/services/battery_services.dart';
import 'package:graduation_project/views/services/carWash_services.dart';
import 'package:graduation_project/views/services/oil_services.dart';
import 'package:graduation_project/views/services/settings.dart';
import 'package:graduation_project/views/services/tire_services.dart';
import 'package:graduation_project/views/services/emergency_services.dart';
import 'package:graduation_project/views/services/towing_services.dart';
import 'package:provider/provider.dart';
import 'package:graduation_project/logic/providers/orders_provider.dart';
import 'package:graduation_project/logic/providers/auth_provider.dart';
import 'package:graduation_project/logic/providers/notification_provider.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final orders = Provider.of<OrdersProvider>(context, listen: false);
      final userId = auth.currentUser?.id;
      orders.fetchOrders(userId: userId);
      // Initialize real-time notifications (REST + SignalR)
      Provider.of<NotificationProvider>(context, listen: false).init();
    });
  }

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    return Scaffold(
      key: _scaffoldKey,
      drawer: Drawer(
        backgroundColor: Theme.of(context).colorScheme.surface,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              decoration: BoxDecoration(
                gradient: AppGradients.getGradient(AppGradients.gradient5),
              ),
              padding: EdgeInsets.only(
                top: MediaQuery.of(context).padding.top + 40,
                bottom: 32,
                right: 24,
                left: 24,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        s.menu,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      InkWell(
                        onTap: () => Navigator.pop(context),
                        child: CircleAvatar(
                          radius: 16,
                          backgroundColor: Colors.white24,
                          child: Padding(
                            padding: const EdgeInsetsDirectional.only(
                              start: 10,
                              end: 4,
                            ),
                            child: const Icon(
                              Icons.arrow_back_ios,
                              color: Colors.white,
                              size: 16,
                            ),
                          ),
                        ), // arrow forward points left in rtl
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  Row(
                    children: [
                      Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white.withValues(alpha: 0.2),
                        ),
                        child: Center(
                          child: Container(
                            width: 64,
                            height: 64,
                            decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white24,
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(14),
                              child: AppImage(image: 'profile.svg'),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Consumer<AuthProvider>(
                        builder:
                            (_, auth, __) => Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  auth.currentUser?.name ?? 'مستخدم',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  auth.currentUser?.email ?? '',
                                  style: TextStyle(
                                    color: Colors.white.withValues(alpha: 0.9),
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24.0,
                  vertical: 32.0,
                ),
                child: Column(
                  children: [
                    InkWell(
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const ProfilePage(),
                          ),
                        );
                      },
                      child: _buildDrawerItem(
                        context: context,
                        title: s.profile,
                        subtitle:
                            s.isArabic
                                ? 'عرض وتحرير معلوماتك'
                                : 'View and edit your info',
                        svgAsset: 'assets/icons/person.svg',
                        backgroundColor: const Color(0xFFDBEAFE),
                        showArrow: true,
                        onTap: () {
                          Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const ProfilePage(),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 24),
                    _buildDrawerItem(
                      context: context,
                      title: s.settings,
                      subtitle:
                          s.isArabic
                              ? 'تغيير كلمة المرور وغيرها'
                              : 'Change password and more',
                      svgAsset: 'assets/icons/setting.svg',
                      backgroundColor: const Color(0xFFF1F5F9),
                      showArrow: true,
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const SettingsPage(),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 32),
                    const Divider(
                      color: Color(0xFFE2E8F0),
                      thickness: 1,
                      height: 1,
                    ),
                    const SizedBox(height: 24),
                    _buildDrawerItem(
                      context: context,
                      title: s.logout,
                      subtitle: null,
                      svgAsset: 'assets/icons/logout.svg',
                      backgroundColor: const Color(0xFFFFE2E2),
                      textColor: const Color(0xFFE7000B),
                      showArrow: true,
                      arrowColor: const Color(0xFFE7000B),
                      onTap: () {
                        Navigator.pop(context);
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed:
            () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const AiChatPage()),
            ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        child: Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: const LinearGradient(
              colors: [Color(0xFF7C3AED), Color(0xFFA78BFA)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF7C3AED).withValues(alpha: 0.5),
                blurRadius: 16,
                spreadRadius: 2,
              ),
            ],
          ),
          child: const Icon(Icons.auto_awesome, color: Colors.white, size: 26),
        ),
      ),
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          children: [
            Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                color: AppTheme.primaryColor,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(24),
                  bottomRight: Radius.circular(24),
                ),
              ),
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24.0,
                    vertical: 16.0,
                  ),
                  child: Column(
                    children: [
                      // الصف العلوي (الأيقونات)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          CircleAvatar(
                            radius: 16,
                            backgroundColor: Colors.white24,
                            child: GestureDetector(
                              onTap: () {
                                _scaffoldKey.currentState?.openDrawer();
                              },
                              child: const Icon(
                                Icons.person,
                                color: Colors.white,
                                size: 20,
                              ),
                            ),
                          ),
                          Consumer<NotificationProvider>(
                            builder: (_, notifProvider, __) => Stack(
                              clipBehavior: Clip.none,
                              children: [
                                CircleAvatar(
                                  radius: 16,
                                  backgroundColor: Colors.white24,
                                  child: GestureDetector(
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) =>
                                              const NotificationsPage(),
                                        ),
                                      );
                                    },
                                    child: const Icon(
                                      Icons.notifications_outlined,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                  ),
                                ),
                                if (notifProvider.unreadCount > 0)
                                  Positioned(
                                    top: -4,
                                    right: -4,
                                    child: Container(
                                      width: 16,
                                      height: 16,
                                      decoration: const BoxDecoration(
                                        color: Colors.redAccent,
                                        shape: BoxShape.circle,
                                      ),
                                      child: Center(
                                        child: Text(
                                          notifProvider.unreadCount > 9
                                              ? '9+'
                                              : '${notifProvider.unreadCount}',
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 9,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // النصوص الترحيبية
                      Consumer<AuthProvider>(
                        builder:
                            (_, auth, __) => Text(
                              '${s.hello}، ${auth.currentUser?.name ?? ''} 👋',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        s.howHelp,
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.9),
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 40), // مساحة للكارد
                    ],
                  ),
                ),
              ),
            ),

            // الكارد المتراكب
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 24.0),
              child: ActiveOrderCard(),
            ),

            // باقي المحتوى
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 20),

                  // Emergency Actions
                  Row(
                    children: [
                      Expanded(
                        child: EmergencyActionCard(
                          backgroundColor: const Color(0xffFFE2E2),
                          borderColor: const Color(0xffFFC9C9),
                          actionColor: const Color(0xffE7000B),
                          title: s.emergency,
                          svg: 'assets/icons/emergancy.svg',
                          color: const Color(0xffFFF7ED),
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const EmergencyServices(),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: EmergencyActionCard(
                          backgroundColor: const Color(0xffFFEDD4),
                          borderColor: const Color(0xffFFD6A8),
                          actionColor: const Color(0xffF54900),
                          title: s.towing,
                          svg: 'assets/icons/truck.svg',
                          color: const Color(0xffFFFBEB),
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const TowingServices(),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  // Grid Services
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        s.mainServices,
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.onSurface,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const ServicesScreen(),
                            ),
                          );
                        },
                        child: Text(
                          s.viewAll,
                          style: TextStyle(
                            color: AppTheme.primaryColor,
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  GridView.count(
                    crossAxisCount: 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    children: [
                      ServiceCard(
                        title: s.battery,
                        svg: 'assets/icons/battery.svg',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const BatteryServices(),
                            ),
                          );
                        },
                        gradientColors: AppGradients.gradient2,
                      ),
                      ServiceCard(
                        title: s.oilChange,
                        svg: 'assets/icons/oil.svg',
                        gradientColors: AppGradients.gradient1,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const OilServices(),
                            ),
                          );
                        },
                      ),
                      ServiceCard(
                        title: s.tires,
                        svg: 'assets/icons/tire.svg',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const TireServices(),
                            ),
                          );
                        },
                        gradientColors: AppGradients.gradient4,
                      ),
                      ServiceCard(
                        title: s.carWash,
                        svg: 'assets/icons/clean.svg',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const CarWashServices(),
                            ),
                          );
                        },
                        gradientColors: AppGradients.gradient1,
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawerItem({
    required BuildContext context,
    required String title,
    required String? subtitle,
    required String svgAsset,
    required Color backgroundColor,
    required VoidCallback onTap,
    Color? textColor,
    bool showArrow = false,
    Color arrowColor = Colors.grey,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: backgroundColor,
                borderRadius: BorderRadius.circular(36),
              ),
              child: Center(
                child: SvgPicture.asset(svgAsset, width: 24, height: 24),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color:
                          textColor ?? Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                  ],
                ],
              ),
            ),
            if (showArrow)
              Icon(
                Icons.arrow_forward_ios, // In RTL arrow_forward points to left
                size: 16,
                color: arrowColor,
              ),
          ],
        ),
      ),
    );
  }
}

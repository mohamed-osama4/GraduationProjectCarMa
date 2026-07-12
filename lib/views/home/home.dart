import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:graduation_project/logic/providers/services_provider.dart';
import 'package:graduation_project/views/ai_chat/ai_chat_page.dart';
import 'package:graduation_project/views/home/widgets/gradients.dart';
import 'package:graduation_project/core/network/api_client.dart';
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
import 'package:graduation_project/views/login.dart';

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
      // Fetch services for dynamic pricing early
      Provider.of<ServicesProvider>(context, listen: false).fetchServices();
    });
  }

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    return Container(
      decoration: BoxDecoration(
        gradient:
            Theme.of(context).brightness == Brightness.dark
                ? const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppTheme.carmaDeepDark,
                    Color(
                      0xFF1C1F24,
                    ), // A darker charcoal/grayish "farani" break
                  ],
                )
                : null,
        color:
            Theme.of(context).brightness != Brightness.dark
                ? Theme.of(context).scaffoldBackgroundColor
                : null,
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        key: _scaffoldKey,
        drawer: Drawer(
          backgroundColor: Theme.of(context).colorScheme.surface,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                    colors:
                        Theme.of(context).brightness == Brightness.dark
                            ? [AppTheme.carmaGold, AppTheme.carmaGoldDim]
                            : const [Color(0xff1C398E), Color(0xff1447E6)],
                  ),
                  border: const Border(
                    bottom: BorderSide(color: AppTheme.carmaOutline, width: 1),
                  ),
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
                        Consumer<AuthProvider>(
                          builder:
                              (_, auth, __) => Container(
                                width: 56,
                                height: 56,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Colors.white.withValues(alpha: 0.2),
                                ),
                                child: ClipOval(
                                  child:
                                      auth.currentUser?.id != null
                                          ? Image.network(
                                            '${ApiClient.baseUrl}/profile/image/${auth.currentUser!.id}',
                                            width: 56,
                                            height: 56,
                                            fit: BoxFit.cover,
                                            errorBuilder:
                                                (context, error, stackTrace) =>
                                                    Container(
                                                      width: 56,
                                                      height: 56,
                                                      color: Colors.white24,
                                                      child: const Icon(
                                                        Icons.person,
                                                        color: Colors.white,
                                                        size: 28,
                                                      ),
                                                    ),
                                          )
                                          : Container(
                                            width: 56,
                                            height: 56,
                                            color: Colors.white24,
                                            child: const Icon(
                                              Icons.person,
                                              color: Colors.white,
                                              size: 28,
                                            ),
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
                                      color: Colors.white.withValues(
                                        alpha: 0.9,
                                      ),
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
                          backgroundColor:
                              Theme.of(context).brightness == Brightness.dark
                                  ? AppTheme.carmaGold.withAlpha(25)
                                  : const Color(0xFFDBEAFE),
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
                        backgroundColor:
                            Theme.of(context).brightness == Brightness.dark
                                ? AppTheme.carmaGold.withAlpha(25)
                                : const Color(0xFFF1F5F9),
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
                      Divider(
                        color:
                            Theme.of(context).brightness == Brightness.dark
                                ? AppTheme.carmaOutline
                                : const Color(0xFFE2E8F0),
                        thickness: 1,
                        height: 1,
                      ),
                      const SizedBox(height: 24),
                      _buildDrawerItem(
                        context: context,
                        title: s.logout,
                        subtitle: null,
                        svgAsset: 'assets/icons/logout.svg',
                        backgroundColor:
                            Theme.of(context).brightness == Brightness.dark
                                ? AppTheme.carmaGold.withAlpha(25)
                                : const Color(0xFFDBEAFE),
                        textColor:
                            Theme.of(context).brightness == Brightness.dark
                                ? AppTheme.carmaGold
                                : AppTheme.primaryColor,
                        showArrow: true,
                        arrowColor:
                            Theme.of(context).brightness == Brightness.dark
                                ? AppTheme.carmaGold
                                : AppTheme.primaryColor,
                        onTap: () async {
                          final auth = context.read<AuthProvider>();
                          await auth.logout();
                          if (!context.mounted) return;
                          Navigator.pushAndRemoveUntil(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const LoginPage(),
                            ),
                            (route) => false,
                          );
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
              gradient: LinearGradient(
                colors:
                    Theme.of(context).brightness == Brightness.dark
                        ? [AppTheme.carmaGold, AppTheme.carmaGoldDim]
                        : [
                          Theme.of(context).colorScheme.primary,
                          Theme.of(
                            context,
                          ).colorScheme.primary.withValues(alpha: 0.7),
                        ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              boxShadow: [
                BoxShadow(
                  color: (Theme.of(context).brightness == Brightness.dark
                          ? AppTheme.carmaGold
                          : Theme.of(context).colorScheme.primary)
                      .withValues(alpha: 0.5),
                  blurRadius: 16,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: const Icon(
              Icons.auto_awesome,
              color: Colors.white,
              size: 26,
            ),
          ),
        ),

        body: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Builder(
            builder: (context) {
              final isDark = Theme.of(context).brightness == Brightness.dark;
              return Column(
                children: [
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                        colors:
                            isDark
                                ? [AppTheme.carmaGold, AppTheme.carmaGoldDim]
                                : const [Color(0xff1C398E), Color(0xff1447E6)],
                      ),
                      border:
                          isDark
                              ? const Border(
                                bottom: BorderSide(
                                  color: AppTheme.carmaGoldDim,
                                  width: 1,
                                ),
                              )
                              : null,
                      borderRadius: const BorderRadius.only(
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
                                    child: Icon(
                                      Icons.person,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                  ),
                                ),
                                Consumer<NotificationProvider>(
                                  builder:
                                      (_, notifProvider, __) => Stack(
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
                                                    builder:
                                                        (context) =>
                                                            const NotificationsPage(),
                                                  ),
                                                );
                                              },
                                              child: Icon(
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
                                                    notifProvider.unreadCount >
                                                            9
                                                        ? '9+'
                                                        : '${notifProvider.unreadCount}',
                                                    style: const TextStyle(
                                                      color: Colors.white,
                                                      fontSize: 9,
                                                      fontWeight:
                                                          FontWeight.bold,
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
                                color:
                                    isDark
                                        ? Colors.white
                                        : Colors.white.withValues(alpha: 0.9),
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 40),
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
                                      builder:
                                          (context) =>
                                              const EmergencyServices(),
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
                                      builder:
                                          (context) => const TowingServices(),
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
                                    builder:
                                        (context) => const ServicesScreen(),
                                  ),
                                );
                              },
                              child: Text(
                                s.viewAll,
                                style: TextStyle(
                                  // Use theme primary: gold in dark mode, blue in light
                                  color: Theme.of(context).colorScheme.primary,
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
                                    builder:
                                        (context) => const BatteryServices(),
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
                                    builder:
                                        (context) => const CarWashServices(),
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
              );
            },
          ),
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
                child: SvgPicture.asset(
                  svgAsset,
                  width: 24,
                  height: 24,
                  colorFilter:
                      textColor != null
                          ? ColorFilter.mode(textColor, BlendMode.srcIn)
                          : null,
                ),
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

import 'package:flutter/material.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:graduation_project/logic/providers/services_provider.dart';
import 'package:provider/provider.dart';
import 'package:graduation_project/core/comeponents/app_background.dart';
import 'package:graduation_project/views/services/battery_services.dart';
import 'package:graduation_project/views/home/widgets/gradients.dart';
import 'package:graduation_project/views/services/carWash_services.dart';
import 'package:graduation_project/views/services/emergency_services.dart';
import 'package:graduation_project/views/services/oil_services.dart';
import 'package:graduation_project/views/services/tire_services.dart';
import 'package:graduation_project/views/services/towing_services.dart';
import 'package:graduation_project/views/home/widgets/service_item_card.dart';

class ServicesScreen extends StatefulWidget {
  const ServicesScreen({super.key});

  @override
  State<ServicesScreen> createState() => _ServicesScreenState();
}

class _ServicesScreenState extends State<ServicesScreen> {
  int _selectedFilterIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ServicesProvider>().fetchServices();
    });
  }

  List<String> _getFilters(AppStrings s) => [
    s.all,
    s.battery,
    s.oilChange,
    s.tires,
    s.carWash,
    s.emergency,
    s.towing,
  ];

  List<Map<String, dynamic>> _getAllServices(AppStrings s) => [
    {
      'title': s.battery,
      'subtitle': s.batterySub,
      'serviceId': 2,
      'icon': 'battery.svg',
      'filterIndex': 1,
      'gradient': AppGradients.gradient1,
    },
    {
      'title': s.oilChange,
      'subtitle': s.oilChangeSub,
      'serviceId': 1,
      'icon': 'oil.svg',
      'filterIndex': 2,
      'gradient': AppGradients.gradient2,
    },
    {
      'title': s.tires,
      'subtitle': s.tiresSub,
      'serviceId': 3,
      'icon': 'tire.svg',
      'filterIndex': 3,
      'gradient': AppGradients.gradient3,
    },
    {
      'title': s.carWash,
      'subtitle': s.carWashSub,
      'serviceId': 4,
      'icon': 'clean.svg',
      'filterIndex': 4,
      'gradient': AppGradients.gradient1,
    },
    {
      'title': s.emergency,
      'subtitle': s.emergencySub,
      'serviceId': 5,
      'icon': 'emergancy.svg',
      'filterIndex': 5,
      'gradient': AppGradients.gradient3,
    },
    {
      'title': s.towing,
      'subtitle': s.towingSub,
      'serviceId': 6,
      'icon': 'truck.svg',
      'filterIndex': 6,
      'gradient': AppGradients.gradient2,
    },
  ];

  List<Map<String, dynamic>> _getFilteredServices(AppStrings s) {
    final all = _getAllServices(s);
    if (_selectedFilterIndex == 0) return all;
    return all
        .where((service) => service['filterIndex'] == _selectedFilterIndex)
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    final filters = _getFilters(s);
    final filteredServices = _getFilteredServices(s);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return AppBackground(
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          leading: Center(
            child: GestureDetector(
              onTap: () => Navigator.pop(context),
              child: Container(
                padding: const EdgeInsets.all(8),
                margin: const EdgeInsets.symmetric(horizontal: 8),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.35),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.arrow_back,
                  color: Colors.white,
                  size: 20,
                ),
              ),
            ),
          ),
          title: Text(
            s.services,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          centerTitle: true,
          backgroundColor: isDark ? AppTheme.carmaGold : AppTheme.primaryColor,
          elevation: 0,
          iconTheme: const IconThemeData(color: Colors.white),
          // Gold bottom border in dark mode
          bottom:
              isDark
                  ? PreferredSize(
                    preferredSize: const Size.fromHeight(1),
                    child: Container(height: 1, color: AppTheme.carmaOutline),
                  )
                  : null,
        ),
        body: Column(
          children: [
            // ── Filter Chips ──────────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12.0),
              child: SizedBox(
                height: 40,
                child: ListView.builder(
                  physics: const BouncingScrollPhysics(),
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: filters.length,
                  itemBuilder: (context, index) {
                    final filter = filters[index];
                    final isSelected = _selectedFilterIndex == index;

                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedFilterIndex = index;
                        });
                      },
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 250),
                        curve: Curves.easeOut,
                        margin: const EdgeInsets.only(left: 8),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 0,
                        ),
                        decoration: BoxDecoration(
                          // Selected: gold fill in dark mode, gradient in light mode
                          gradient:
                              isSelected
                                  ? (isDark
                                      ? AppGradients.goldGradient
                                      : AppGradients.getGradient(
                                        AppGradients.gradient1,
                                      ))
                                  : null,
                          color:
                              isSelected
                                  ? null
                                  : (isDark
                                      ? AppTheme.carmaSurface
                                      : Theme.of(context).colorScheme.surface),
                          borderRadius: BorderRadius.circular(20),
                          border:
                              isSelected
                                  ? null
                                  : Border.all(
                                    color:
                                        isDark
                                            ? AppTheme.carmaOutline
                                            : Theme.of(
                                              context,
                                            ).colorScheme.outline,
                                  ),
                          boxShadow:
                              isSelected && isDark
                                  ? [
                                    BoxShadow(
                                      color: AppTheme.carmaGold.withAlpha(70),
                                      blurRadius: 10,
                                      offset: const Offset(0, 3),
                                    ),
                                  ]
                                  : isSelected
                                  ? [
                                    BoxShadow(
                                      color: AppGradients.gradient1.last
                                          .withAlpha(76),
                                      blurRadius: 8,
                                      offset: const Offset(0, 4),
                                    ),
                                  ]
                                  : null,
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          filter,
                          style: TextStyle(
                            color:
                                isSelected
                                    ? (isDark
                                        ? AppTheme.carmaDark
                                        : Colors.white)
                                    : Theme.of(
                                      context,
                                    ).colorScheme.onSurfaceVariant,
                            fontWeight:
                                isSelected ? FontWeight.bold : FontWeight.w500,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
            const SizedBox(height: 4),
            // ── Services List ─────────────────────────────────────
            Expanded(
              child: ListView.separated(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                itemCount: filteredServices.length,
                separatorBuilder:
                    (context, index) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final service = filteredServices[index];
                  void handleNavigation() {
                    final int idx = service['filterIndex'];
                    if (idx == 1) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const BatteryServices(),
                        ),
                      );
                    } else if (idx == 3) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const TireServices(),
                        ),
                      );
                    } else if (idx == 2) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const OilServices(),
                        ),
                      );
                    } else if (idx == 4) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const CarWashServices(),
                        ),
                      );
                    } else if (idx == 5) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const EmergencyServices(),
                        ),
                      );
                    } else if (idx == 6) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const TowingServices(),
                        ),
                      );
                    }
                  }

                  return ServiceItemCard(
                    key: ValueKey(service['title']),
                    service: service,
                    onTap: handleNavigation,
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

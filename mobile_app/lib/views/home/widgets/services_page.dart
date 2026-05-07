import 'package:flutter/material.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:provider/provider.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
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
  int _selectedFilterIndex = 0; // use index to avoid string matching issues

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
          'price': '150 ${s.priceEGP}',
          'icon': 'battery.svg',
          'filterIndex': 1,
          'gradient': AppGradients.gradient1,
        },
        {
          'title': s.oilChange,
          'subtitle': s.oilChangeSub,
          'price': '200 ${s.priceEGP}',
          'icon': 'oil.svg',
          'filterIndex': 2,
          'gradient': AppGradients.gradient2,
        },
        {
          'title': s.tires,
          'subtitle': s.tiresSub,
          'price': '100 ${s.priceEGP}',
          'icon': 'tire.svg',
          'filterIndex': 3,
          'gradient': AppGradients.gradient3,
        },
        {
          'title': s.carWash,
          'subtitle': s.carWashSub,
          'price': '80 ${s.priceEGP}',
          'icon': 'clean.svg',
          'filterIndex': 4,
          'gradient': AppGradients.gradient1,
        },
        {
          'title': s.emergency,
          'subtitle': s.emergencySub,
          'price': '${s.priceStarts} 250 ${s.priceEGP}',
          'icon': 'emergancy.svg',
          'filterIndex': 5,
          'gradient': AppGradients.gradient3,
        },
        {
          'title': s.towing,
          'subtitle': s.towingSub,
          'price': '${s.priceStarts} 300 ${s.priceEGP}',
          'icon': 'truck.svg',
          'filterIndex': 6,
          'gradient': AppGradients.gradient2,
        },
      ];

  List<Map<String, dynamic>> _getFilteredServices(AppStrings s) {
    final all = _getAllServices(s);
    if (_selectedFilterIndex == 0) return all;
    return all.where((service) => service['filterIndex'] == _selectedFilterIndex).toList();
  }

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    final filters = _getFilters(s);
    final filteredServices = _getFilteredServices(s);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          s.services,
          style: TextStyle(
            color: Theme.of(context).colorScheme.onSurface,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        elevation: 0,
        iconTheme: IconThemeData(color: Theme.of(context).colorScheme.onSurface),
      ),
      body: Column(
        children: [
          // Filters list
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: SizedBox(
              height: 48,
              child: ListView.builder(
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
                      duration: const Duration(milliseconds: 300),
                      margin: const EdgeInsets.only(left: 8),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 0,
                      ),
                      decoration: BoxDecoration(
                        gradient:
                            isSelected
                                ? AppGradients.getGradient(
                                  AppGradients.gradient1,
                                )
                                : null,
                        color: isSelected ? null : Theme.of(context).colorScheme.surface,
                        borderRadius: BorderRadius.circular(24),
                        border:
                            isSelected
                                ? null
                                : Border.all(color: Theme.of(context).colorScheme.outline),
                        boxShadow:
                            isSelected
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
                                  ? Colors.white
                                  : Theme.of(context).colorScheme.onSurfaceVariant,
                          fontWeight:
                              isSelected ? FontWeight.bold : FontWeight.w500,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          const SizedBox(height: 8),
          // Services List
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              itemCount: filteredServices.length,
              separatorBuilder: (context, index) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final service = filteredServices[index];
                final String iconName = service['icon'];

                final List<Color> gradient =
                    service['gradient'] as List<Color>? ??
                    AppGradients.gradient1;

                void handleNavigation() {
                  final int index = service['filterIndex'];
                  if (index == 1) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const BatteryServices()),
                    );
                  } else if (index == 3) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const TireServices()),
                    );
                  } else if (index == 2) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const OilServices()),
                    );
                  } else if (index == 4) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const CarWashServices()),
                    );
                  } else if (index == 5) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const EmergencyServices()),
                    );
                  } else if (index == 6) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const TowingServices()),
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
    );
  }
}

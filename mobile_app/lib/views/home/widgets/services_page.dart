import 'package:flutter/material.dart';
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
  String _selectedFilter = 'الكل';
  final List<String> _filters = [
    'الكل',
    'البطارية',
    'الزيت',
    'الإطارات',
    'غسيل',
    'طارئة',
    'ونش',
  ];

  final List<Map<String, dynamic>> _allServices = [
    {
      'title': 'البطارية',
      'subtitle': 'شحن / تغيير / شراء بطارية جديدة',
      'price': '150 جنيه',
      'icon': 'battery.svg',
      'category': 'البطارية',
      'gradient': AppGradients.gradient1,
    },
    {
      'title': 'تغيير الزيت',
      'subtitle': 'تغيير الزيت والفلتر - صيانة دورية',
      'price': '200 جنيه',
      'icon': 'oil.svg',
      'category': 'الزيت',
      'gradient': AppGradients.gradient2,
    },
    {
      'title': 'الإطارات',
      'subtitle': 'نفخ / تغيير / فحص الإطارات',
      'price': '100 جنيه',
      'icon': 'tire.svg',
      'category': 'الإطارات',
      'gradient': AppGradients.gradient3,
    },
    {
      'title': 'غسيل السيارة',
      'subtitle': 'تنظيف شامل من الداخل والخارج',
      'price': '80 جنيه',
      'icon': 'clean.svg',
      'category': 'غسيل',
      'gradient': AppGradients.gradient1,
    },
    {
      'title': 'صيانة طارئة',
      'subtitle': 'عطل مفاجئ؟ نصل إليك في أسرع وقت',
      'price': 'يبدأ من 250 جنيه',
      'icon': 'emergancy.svg',
      'category': 'طارئة',
      'gradient': AppGradients.gradient3,
    },
    {
      'title': 'طلب ونش',
      'subtitle': 'سحب السيارة من وإلى أي مكان',
      'price': 'يبدأ من 300 جنيه',
      'icon': 'truck.svg',
      'category': 'ونش',
      'gradient': AppGradients.gradient2,
    },
  ];

  List<Map<String, dynamic>> get _filteredServices {
    if (_selectedFilter == 'الكل') {
      return _allServices;
    }
    return _allServices
        .where((service) => service['category'] == _selectedFilter)
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          'الخدمات',
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
                itemCount: _filters.length,
                itemBuilder: (context, index) {
                  final filter = _filters[index];
                  final isSelected = _selectedFilter == filter;

                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedFilter = filter;
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
              itemCount: _filteredServices.length,
              separatorBuilder: (context, index) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final service = _filteredServices[index];
                final String iconName = service['icon'];

                final List<Color> gradient =
                    service['gradient'] as List<Color>? ??
                    AppGradients.gradient1;

                void handleNavigation() {
                  if (service['title'] == 'البطارية') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const BatteryServices(),
                      ),
                    );
                  } else if (service['title'] == 'الإطارات') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const TireServices(),
                      ),
                    );
                  } else if (service['title'] == 'تغيير الزيت') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const OilServices(),
                      ),
                    );
                  } else if (service['title'] == 'غسيل السيارة') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const CarWashServices(),
                      ),
                    );
                  } else if (service['title'] == 'صيانة طارئة') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const EmergencyServices(),
                      ),
                    );
                  } else if (service['title'] == 'طلب ونش') {
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
    );
  }
}

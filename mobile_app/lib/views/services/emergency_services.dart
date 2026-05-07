import 'package:flutter/material.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:provider/provider.dart';
import 'package:graduation_project/core/comeponents/service_template.dart';

class EmergencyServices extends StatelessWidget {
  const EmergencyServices({super.key});

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    return ServiceTemplate(
      title: s.emergency,
      headerGradient: const LinearGradient(
        colors: [Color(0xFFFF4B4B), Color(0xFFE7000B)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      headerShadowColor: const Color(0xFFE7000B),
      headerIcon: 'emergancy.svg',
      headerTitle: s.emergency,
      headerDescription: s.emergencySub,
      basePrice: '${s.priceStarts} 250 ${s.priceEGP}',
      notesHintText: s.isArabic ? 'اكتب ملاحظاتك ووصف العطل هنا...' : 'Write notes and describe the issue here...',
      primaryActionColor: const Color(0xFFE7000B),
      primaryActionShadowColor: const Color(0xFFE7000B),
      primaryActionBackgroundColor: const Color(0xFFE7000B).withAlpha(15),
      serviceId: 5,
      options: [
        ServiceOption(
          title: s.isArabic ? 'ميكانيكا وكهرباء سريعة' : 'Quick Mechanics & Electrical',
          subtitle: s.isArabic ? 'إصلاح الأعطال الميكانيكية والكهربائية' : 'Repair mechanical and electrical faults',
          icon: Icons.build,
        ),
        ServiceOption(
          title: s.isArabic ? 'توصيل وقود (بنزين)' : 'Fuel Delivery',
          subtitle: s.isArabic ? 'توصيل البنزين لموقع سيارتك' : 'Deliver fuel to your location',
          icon: Icons.local_gas_station,
        ),
        ServiceOption(
          title: s.isArabic ? 'فتح أبواب السيارة' : 'Unlock Car Doors',
          subtitle: s.isArabic ? 'طوارئ نسيان المفتاح داخل السيارة' : 'Emergency unlocking if keys are inside',
          icon: Icons.lock_open,
        ),
      ],
    );
  }
}
import 'package:flutter/material.dart';
import 'package:graduation_project/core/comeponents/service_template.dart';

class EmergencyServices extends StatelessWidget {
  const EmergencyServices({super.key});

  @override
  Widget build(BuildContext context) {
    return ServiceTemplate(
      title: 'صيانة طارئة',
      headerGradient: const LinearGradient(
        colors: [Color(0xFFFF4B4B), Color(0xFFE7000B)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      headerShadowColor: const Color(0xFFE7000B),
      headerIcon: 'emergancy.svg',
      headerTitle: 'صيانة طارئة',
      headerDescription: 'عطل مفاجئ؟ نصل إليك في أسرع وقت',
      basePrice: 'يبدأ من 250 جنيه',
      notesHintText: 'اكتب ملاحظاتك ووصف العطل هنا...',
      primaryActionColor: const Color(0xFFE7000B),
      primaryActionShadowColor: const Color(0xFFE7000B),
      primaryActionBackgroundColor: const Color(0xFFE7000B).withAlpha(15),
      options: [
        ServiceOption(
          title: 'ميكانيكا وكهرباء سريعة',
          subtitle: 'إصلاح الأعطال الميكانيكية والكهربائية',
          price: '250 جنيه',
          icon: Icons.build,
        ),
        ServiceOption(
          title: 'توصيل وقود (بنزين)',
          subtitle: 'توصيل البنزين لموقع سيارتك',
          price: '100 جنيه',
          icon: Icons.local_gas_station,
        ),
        ServiceOption(
          title: 'فتح أبواب السيارة',
          subtitle: 'طوارئ نسيان المفتاح داخل السيارة',
          price: '150 جنيه',
          icon: Icons.lock_open,
        ),
      ],
    );
  }
}
import 'package:flutter/material.dart';
import 'package:graduation_project/core/comeponents/service_template.dart';

class TowingServices extends StatelessWidget {
  const TowingServices({super.key});

  @override
  Widget build(BuildContext context) {
    return ServiceTemplate(
      title: 'طلب ونش',
      headerGradient: const LinearGradient(
        colors: [Color(0xFFFF8C00), Color(0xFFF54900)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      headerShadowColor: const Color(0xFFF54900),
      headerIcon: 'truck.svg',
      headerTitle: 'طلب ونش',
      headerDescription: 'إنقاذ وسحب السيارات من وإلى أي مكان بأمان',
      basePrice: 'يبدأ من 300 جنيه',
      notesHintText: 'اكتب الوجهة أو أي تفاصيل إضافية للونش...',
      primaryActionColor: const Color(0xFFF54900),
      primaryActionShadowColor: const Color(0xFFF54900),
      primaryActionBackgroundColor: const Color(0xFFF54900).withAlpha(15),
      options: [
        ServiceOption(
          title: 'ونش هيدروليك',
          subtitle: 'مناسب للسيارات المنخفضة والرياضية.',
          price: 'يبدأ من 150 جنيه',
          icon: Icons.car_repair,
        ),
        ServiceOption(
          title: 'ونش عادي',
          subtitle: 'مناسب لجميع أنواع السيارات العادية.',
          price: 'يبدأ من 100 جنيه',
          icon: Icons.local_shipping,
        ),
      ],
    );
  }
}
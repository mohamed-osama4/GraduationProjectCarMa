import 'package:flutter/material.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/views/home/widgets/gradients.dart';
import 'package:graduation_project/core/comeponents/service_template.dart';

class TireServices extends StatelessWidget {
  const TireServices({super.key});

  @override
  Widget build(BuildContext context) {
    return ServiceTemplate(
      title: 'خدمة الإطارات',
      headerGradient: AppGradients.getGradient(AppGradients.gradient4),
      headerShadowColor: AppGradients.gradient4.last,
      headerIcon: 'tire.svg',
      headerTitle: 'خدمة الإطارات',
      headerDescription: 'خدمة سريعة للتعامل مع مشاكل الإطارات على الطريق',
      basePrice: '100 جنيه',
      notesHintText: 'مثال: نوع السيارة، عدد الإطارات التالفة، إلخ.',
      primaryActionColor: AppTheme.primaryColor,
      primaryActionShadowColor: AppTheme.primaryColor,
      primaryActionBackgroundColor: AppTheme.primaryColor.withAlpha(15),
      options: [
        ServiceOption(
          title: 'نفخ وتزويد الإطارات',
          subtitle: 'ضبط ضغط الهواء للإطارات',
        ),
        ServiceOption(
          title: 'تغيير الإطارات',
          subtitle: 'تغيير الإطار التالف بالاحتياطي',
        ),
        ServiceOption(
          title: 'فحص كلي للإطارات',
          subtitle: 'فحص حالة الإطارات والتأكد من سلامتها',
        ),
      ],
    );
  }
}

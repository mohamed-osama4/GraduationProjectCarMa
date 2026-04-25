import 'package:flutter/material.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/views/home/widgets/gradients.dart';
import 'package:graduation_project/core/comeponents/service_template.dart';

class BatteryServices extends StatelessWidget {
  const BatteryServices({super.key});

  @override
  Widget build(BuildContext context) {
    return ServiceTemplate(
      title: 'خدمة البطارية',
      headerGradient: AppGradients.getGradient(AppGradients.gradient2),
      headerShadowColor: AppGradients.gradient2.last,
      headerIcon: 'battery.svg',
      headerTitle: 'خدمة البطارية',
      headerDescription: 'خدمة شاملة للبطارية تشمل الفحص والصيانة',
      basePrice: '150 جنيه',
      notesHintText: 'مثال: نوع السيارة، موديل البطارية المطلوب، إلخ.',
      primaryActionColor: AppTheme.primaryColor,
      primaryActionShadowColor: AppTheme.primaryColor,
      primaryActionBackgroundColor: AppTheme.primaryColor.withAlpha(15),
      options: [
        ServiceOption(
          title: 'شحن بطارية',
          subtitle: 'إعادة شحن البطارية الحالية',
        ),
        ServiceOption(
          title: 'تغيير بطارية',
          subtitle: 'تركيب بطارية من عندك',
        ),
        ServiceOption(
          title: 'شراء بطارية جديدة',
          subtitle: 'شراء وتركيب بطارية أصلية',
        ),
      ],
    );
  }
}
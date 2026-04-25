import 'package:flutter/material.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/views/home/widgets/gradients.dart';
import 'package:graduation_project/core/comeponents/service_template.dart';

class OilServices extends StatelessWidget {
  const OilServices({super.key});

  @override
  Widget build(BuildContext context) {
    return ServiceTemplate(
      title: 'تغيير الزيت',
      headerGradient: AppGradients.getGradient(AppGradients.gradient1),
      headerShadowColor: AppGradients.gradient1.last,
      headerIcon: 'oil.svg',
      headerTitle: 'تغيير الزيت',
      headerDescription: 'خدمة شاملة للزيت تشمل التغيير والفحص',
      basePrice: '200 جنيه',
      notesHintText:
          'مثال: نوع الزيت المفضل (10W-40 أو غيره)، ماركة السيارة، إلخ.',
      primaryActionColor: AppTheme.primaryColor,
      primaryActionShadowColor: AppTheme.primaryColor,
      primaryActionBackgroundColor: AppTheme.primaryColor.withAlpha(15),
      options: [
        ServiceOption(
          title: 'تغيير زيت المحرك',
          subtitle: 'تغيير الزيت وفلتر الزيت للمحرك',
        ),
        ServiceOption(
          title: 'تغيير زيت الفتيس',
          subtitle: 'تغيير زيت ناقل الحركة (الفتيس)',
        ),
        ServiceOption(
          title: 'فحص مستوى الزيت',
          subtitle: 'التأكد من مستوى ولزوجة الزيت',
        ),
      ],
    );
  }
}

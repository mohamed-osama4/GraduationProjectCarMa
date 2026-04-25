import 'package:flutter/material.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/views/home/widgets/gradients.dart';
import 'package:graduation_project/core/comeponents/service_template.dart';

class CarWashServices extends StatelessWidget {
  const CarWashServices({super.key});

  @override
  Widget build(BuildContext context) {
    return ServiceTemplate(
      title: 'غسيل السيارة',
      headerGradient: AppGradients.getGradient(AppGradients.gradient1),
      headerShadowColor: AppGradients.gradient1.last,
      headerIcon: 'clean.svg',
      headerTitle: 'غسيل السيارة',
      headerDescription: 'خدمة احترافية للحفاظ على نظافة ولمعان سيارتك',
      basePrice: '80 جنيه',
      notesHintText: 'مثال: نوع السيارة، وقت الغسيل المفضل، إلخ.',
      primaryActionColor: AppTheme.primaryColor,
      primaryActionShadowColor: AppTheme.primaryColor,
      primaryActionBackgroundColor: AppTheme.primaryColor.withAlpha(15),
      options: [
        ServiceOption(
          title: 'غسيل خارجي فقط',
          subtitle: 'تنظيف وغسيل هيكل السيارة الخارجي بعناية',
        ),
        ServiceOption(
          title: 'غسيل داخلي وخارجي',
          subtitle: 'غسيل وتنظيف شامل للسيارة بالكامل',
        ),
        ServiceOption(
          title: 'غسيل وتلميع (VIP)',
          subtitle: 'غسيل كامل مع تلميع التابلوه وتنظيف الفرش',
        ),
        ServiceOption(
          title: 'دراي كلين (Dry Clean)',
          subtitle: 'غسيل كيماوي متكامل لفرش وصالون السيارة',
        ),
      ],
    );
  }
}

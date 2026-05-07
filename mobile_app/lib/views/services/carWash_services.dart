import 'package:flutter/material.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:provider/provider.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/views/home/widgets/gradients.dart';
import 'package:graduation_project/core/comeponents/service_template.dart';

class CarWashServices extends StatelessWidget {
  const CarWashServices({super.key});

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    return ServiceTemplate(
      title: s.carWash,
      headerGradient: AppGradients.getGradient(AppGradients.gradient1),
      headerShadowColor: AppGradients.gradient1.last,
      headerIcon: 'clean.svg',
      headerTitle: s.carWash,
      headerDescription: s.carWashSub,
      basePrice: '80 ${s.priceEGP}',
      notesHintText: s.isArabic ? 'مثال: عنوان المنزل لتنفيذ الخدمة، إلخ.' : 'Example: Home address for service, etc.',
      primaryActionColor: AppTheme.primaryColor,
      primaryActionShadowColor: AppTheme.primaryColor,
      primaryActionBackgroundColor: AppTheme.primaryColor.withAlpha(15),
      serviceId: 4,
      options: [
        ServiceOption(
          title: s.isArabic ? 'غسيل خارجي فقط' : 'Exterior Wash Only',
          subtitle: s.isArabic ? 'تنظيف الهيكل وتلميع الزجاج' : 'Clean body and polish glass',
        ),
        ServiceOption(
          title: s.isArabic ? 'غسيل داخلي وخارجي' : 'Interior & Exterior Wash',
          subtitle: s.isArabic ? 'تنظيف شامل للسيارة' : 'Comprehensive car wash',
        ),
        ServiceOption(
          title: s.isArabic ? 'غسيل كيماوي' : 'Chemical Wash',
          subtitle: s.isArabic ? 'إزالة البقع العميقة وتنظيف الفرش' : 'Remove deep stains and clean upholstery',
        ),
      ],
    );
  }
}

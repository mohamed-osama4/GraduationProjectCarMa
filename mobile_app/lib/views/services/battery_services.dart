import 'package:flutter/material.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:provider/provider.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/views/home/widgets/gradients.dart';
import 'package:graduation_project/core/comeponents/service_template.dart';

class BatteryServices extends StatelessWidget {
  const BatteryServices({super.key});

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    return ServiceTemplate(
      title: s.battery,
      headerGradient: AppGradients.getGradient(AppGradients.gradient2),
      headerShadowColor: AppGradients.gradient2.last,
      headerIcon: 'battery.svg',
      headerTitle: s.battery,
      headerDescription: s.batterySub,
      basePrice: '150 ${s.priceEGP}',
      notesHintText: s.isArabic ? 'مثال: نوع السيارة، موديل البطارية المطلوب، إلخ.' : 'Example: Car type, Battery model, etc.',
      primaryActionColor: AppTheme.primaryColor,
      primaryActionShadowColor: AppTheme.primaryColor,
      primaryActionBackgroundColor: AppTheme.primaryColor.withAlpha(15),
      serviceId: 2,
      options: [
        ServiceOption(
          title: s.isArabic ? 'شحن بطارية' : 'Charge Battery',
          subtitle: s.isArabic ? 'إعادة شحن البطارية الحالية' : 'Recharge the current battery',
        ),
        ServiceOption(
          title: s.isArabic ? 'تغيير بطارية' : 'Replace Battery',
          subtitle: s.isArabic ? 'تركيب بطارية من عندك' : 'Install a battery you provide',
        ),
        ServiceOption(
          title: s.isArabic ? 'شراء بطارية جديدة' : 'Buy New Battery',
          subtitle: s.isArabic ? 'شراء وتركيب بطارية أصلية' : 'Buy and install a genuine battery',
        ),
      ],
    );
  }
}
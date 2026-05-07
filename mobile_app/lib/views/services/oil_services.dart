import 'package:flutter/material.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:provider/provider.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/views/home/widgets/gradients.dart';
import 'package:graduation_project/core/comeponents/service_template.dart';

class OilServices extends StatelessWidget {
  const OilServices({super.key});

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    return ServiceTemplate(
      title: s.oilChange,
      headerGradient: AppGradients.getGradient(AppGradients.gradient1),
      headerShadowColor: AppGradients.gradient1.last,
      headerIcon: 'oil.svg',
      headerTitle: s.oilChange,
      headerDescription: s.oilChangeSub,
      basePrice: '200 ${s.priceEGP}',
      notesHintText: s.isArabic ? 'مثال: نوع الزيت المفضل، لزوجة الزيت، إلخ.' : 'Example: Preferred oil type, viscosity, etc.',
      primaryActionColor: AppTheme.primaryColor,
      primaryActionShadowColor: AppTheme.primaryColor,
      primaryActionBackgroundColor: AppTheme.primaryColor.withAlpha(15),
      serviceId: 1,
      options: [
        ServiceOption(
          title: s.isArabic ? 'تغيير زيت المحرك' : 'Engine Oil Change',
          subtitle: s.isArabic ? 'تغيير الزيت مع فلتر جديد' : 'Change oil with a new filter',
        ),
        ServiceOption(
          title: s.isArabic ? 'تغيير زيت الفتيس' : 'Transmission Oil Change',
          subtitle: s.isArabic ? 'تغيير زيت ناقل الحركة' : 'Change transmission fluid',
        ),
        ServiceOption(
          title: s.isArabic ? 'فحص مستوى الزيوت' : 'Check Oil Levels',
          subtitle: s.isArabic ? 'مراجعة وتزويد الزيوت الناقصة' : 'Inspect and top up missing oils',
        ),
      ],
    );
  }
}

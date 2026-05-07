import 'package:flutter/material.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:provider/provider.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/views/home/widgets/gradients.dart';
import 'package:graduation_project/core/comeponents/service_template.dart';

class TireServices extends StatelessWidget {
  const TireServices({super.key});

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    return ServiceTemplate(
      title: s.tires,
      headerGradient: AppGradients.getGradient(AppGradients.gradient3),
      headerShadowColor: AppGradients.gradient3.last,
      headerIcon: 'tire.svg',
      headerTitle: s.tires,
      headerDescription: s.tiresSub,
      basePrice: '100 ${s.priceEGP}',
      notesHintText: s.isArabic ? 'مثال: عدد الإطارات، مقاس الإطار، إلخ.' : 'Example: Number of tires, tire size, etc.',
      primaryActionColor: AppTheme.primaryColor,
      primaryActionShadowColor: AppTheme.primaryColor,
      primaryActionBackgroundColor: AppTheme.primaryColor.withAlpha(15),
      serviceId: 3,
      options: [
        ServiceOption(
          title: s.isArabic ? 'نفخ وضبط ضغط الإطارات' : 'Inflate & Adjust Pressure',
          subtitle: s.isArabic ? 'ضبط الضغط للوصول للمستوى المثالي' : 'Adjust pressure to optimal level',
        ),
        ServiceOption(
          title: s.isArabic ? 'تغيير إطار' : 'Replace Tire',
          subtitle: s.isArabic ? 'تركيب إطار احتياطي أو جديد' : 'Install a spare or new tire',
        ),
        ServiceOption(
          title: s.isArabic ? 'لحام إطار' : 'Repair Tire Puncture',
          subtitle: s.isArabic ? 'إصلاح الثقوب البسيطة' : 'Repair minor punctures',
        ),
      ],
    );
  }
}

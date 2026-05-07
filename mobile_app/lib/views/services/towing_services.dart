import 'package:flutter/material.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:provider/provider.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/views/home/widgets/gradients.dart';
import 'package:graduation_project/core/comeponents/service_template.dart';

class TowingServices extends StatelessWidget {
  const TowingServices({super.key});

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    return ServiceTemplate(
      title: s.towing,
      headerGradient: AppGradients.getGradient(AppGradients.gradient2),
      headerShadowColor: AppGradients.gradient2.last,
      headerIcon: 'truck.svg',
      headerTitle: s.towing,
      headerDescription: s.towingSub,
      basePrice: '${s.priceStarts} 300 ${s.priceEGP}',
      notesHintText: s.isArabic ? 'اكتب مكانك الحالي والوجهة، أو تفاصيل أخرى...' : 'Write your current location, destination, or other details...',
      primaryActionColor: AppTheme.primaryColor,
      primaryActionShadowColor: AppTheme.primaryColor,
      primaryActionBackgroundColor: AppTheme.primaryColor.withAlpha(15),
      serviceId: 6,
      options: [
        ServiceOption(
          title: s.isArabic ? 'ونش إنقاذ مسطح' : 'Flatbed Tow Truck',
          subtitle: s.isArabic ? 'مناسب للسيارات المعطلة بالكامل' : 'Suitable for completely broken down cars',
          icon: Icons.fire_truck,
        ),
        ServiceOption(
          title: s.isArabic ? 'ونش سحب (شوكه)' : 'Wheel-Lift Tow Truck',
          subtitle: s.isArabic ? 'للسحب السريع داخل المدينة' : 'For quick towing inside the city',
          icon: Icons.car_repair,
        ),
        ServiceOption(
          title: s.isArabic ? 'ونش هيدروليك' : 'Hydraulic Tow Truck',
          subtitle: s.isArabic ? 'للسيارات الرياضية والمنخفضة' : 'For sports and low cars',
          icon: Icons.precision_manufacturing,
        ),
      ],
    );
  }
}
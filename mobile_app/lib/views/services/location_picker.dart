import 'package:flutter/material.dart';
import 'package:graduation_project/core/comeponents/app_button.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/views/services/payment_methods.dart';

class LocationPickerPage extends StatelessWidget {
  const LocationPickerPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Simulated Beautiful Map Background using CustomPaint
          SizedBox(
            width: double.infinity,
            height: double.infinity,
            child: CustomPaint(
              painter: SimulatedMapPainter(Theme.of(context).brightness),
            ),
          ),

          // Search Bar at the Top (Interactive UI placeholder)
          Positioned(
            top: 50,
            left: 20,
            right: 20,
            child: Row(
              children: [
                // Back Button
                InkWell(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.surface,
                      shape: BoxShape.circle,
                      boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 10)],
                    ),
                    child: Icon(Icons.arrow_back, color: Theme.of(context).colorScheme.onSurface),
                  ),
                ),
                const SizedBox(width: 12),
                // Search Input Field Simulator
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.surface,
                      borderRadius: BorderRadius.circular(30),
                      boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 10)],
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.search, color: Theme.of(context).colorScheme.onSurfaceVariant),
                        const SizedBox(width: 8),
                        Text(
                          'ابحث عن موقعك...',
                          style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 14),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // "My Location" FAB mapped to bottom right above sheet
          Positioned(
            bottom: 280, // Above the bottom sheet height approx
            right: 20,
            child: FloatingActionButton(
              backgroundColor: Theme.of(context).colorScheme.surface,
              onPressed: () {},
              child: const Icon(Icons.my_location, color: AppTheme.primaryColor),
            ),
          ),

          // Floating Pin Marker in the Center
          Align(
            alignment: Alignment.center,
            child: Padding(
              padding: const EdgeInsets.only(bottom: 40), // Shift up to compensate for bottom sheet
              child: Stack(
                alignment: Alignment.center,
                children: [
                   // shadow
                   Container(
                     margin: const EdgeInsets.only(top: 40),
                     width: 16, height: 8,
                     decoration: BoxDecoration(
                       color: Colors.black.withAlpha(50),
                       borderRadius: BorderRadius.circular(10),
                     ),
                   ),
                   // Pin
                   const Icon(
                    Icons.location_on,
                    size: 56,
                    color: AppTheme.primaryColor,
                  ),
                ],
              ),
            ),
          ),

          // Bottom Selection Sheet
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 20,
                    offset: Offset(0, -5),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.outlineVariant,
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                   SizedBox(height: 24),
                   Text(
                    'تأكيد موقعك الحالي',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onSurface,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'Inter',
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.surfaceContainerHighest ,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.primaryColor.withValues(alpha: 0.3)),
                    ),
                    child: Row(
                      children: [
                         Container(
                           padding: const EdgeInsets.all(10),
                           decoration: BoxDecoration(
                             color: AppTheme.primaryColor.withValues(alpha: 0.1),
                             shape: BoxShape.circle,
                           ),
                           child: const Icon(
                             Icons.location_city,
                             color: AppTheme.primaryColor,
                           ),
                         ),
                         SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children:  [
                              Text(
                                'القاهرة، مصر',
                                style: TextStyle(
                                  color: Theme.of(context).colorScheme.onSurface,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                  fontFamily: 'Inter',
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'المعادي، شارع 9، بجوار المحطة',
                                style: TextStyle(
                                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                                  fontSize: 13,
                                  fontFamily: 'Inter',
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Edit Icon
                        Icon(Icons.edit_location_alt, color: Theme.of(context).colorScheme.onSurfaceVariant),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  AppButton(
                    text: 'تأكيد الموقع والمتابعة',
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const PaymentMethodsPage(),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 10),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// A custom painter to simulate a luxurious generic map layout
class SimulatedMapPainter extends CustomPainter {
  final Brightness brightness;

  SimulatedMapPainter(this.brightness);

  @override
  void paint(Canvas canvas, Size size) {
    bool isDark = brightness == Brightness.dark;

    // light blue/grey map bg (or dark equivalent)
    Paint background = Paint()..color = isDark ? const Color(0xff1E293B) : const Color(0xffEFF3F8); 
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), background);

    Paint roadPaint = Paint()
      ..color = isDark ? const Color(0xff334155) : Colors.white
      ..strokeWidth = 14.0
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;
      
    Paint majorRoadPaint = Paint()
      ..color = isDark ? const Color(0xff92400E) : const Color(0xffFFECB3) // Yellowish major road
      ..strokeWidth = 24.0
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    Paint parkPaint = Paint()
      ..color = isDark ? const Color(0xff064E3B) : const Color(0xffD6EED1) // Soft green for parks
      ..style = PaintingStyle.fill;

    // Draw a park (organic shape)
    Path parkPath = Path();
    parkPath.moveTo(size.width * 0.1, size.height * 0.15);
    parkPath.quadraticBezierTo(size.width * 0.4, size.height * 0.1, size.width * 0.5, size.height * 0.3);
    parkPath.quadraticBezierTo(size.width * 0.6, size.height * 0.5, size.width * 0.3, size.height * 0.6);
    parkPath.close();
    canvas.drawPath(parkPath, parkPaint);

    // Draw intersecting roads
    // Horizontal mapping
    canvas.drawLine(Offset(0, size.height * 0.35), Offset(size.width, size.height * 0.40), roadPaint);
    canvas.drawLine(Offset(-50, size.height * 0.75), Offset(size.width + 50, size.height * 0.65), roadPaint);
    
    // Vertical mapping
    canvas.drawLine(Offset(size.width * 0.25, -50), Offset(size.width * 0.35, size.height + 50), roadPaint);
    canvas.drawLine(Offset(size.width * 0.75, -50), Offset(size.width * 0.65, size.height + 50), roadPaint);
    
    // Major Diagonal Road
    canvas.drawLine(Offset(0, size.height * 0.1), Offset(size.width, size.height * 0.9), majorRoadPaint);
    
    // Draw building blocks / POI
    Paint buildingPaint = Paint()..color = isDark ? const Color(0xff475569) : const Color(0xffDFE6EE);
    canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(size.width * 0.45, size.height * 0.45, 90, 90), const Radius.circular(12)), buildingPaint);
    canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(size.width * 0.80, size.height * 0.25, 70, 110), const Radius.circular(12)), buildingPaint);
    canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(size.width * 0.15, size.height * 0.8, 140, 70), const Radius.circular(12)), buildingPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}

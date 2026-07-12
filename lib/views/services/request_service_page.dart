import 'dart:io';
import 'package:flutter/material.dart';
import 'package:graduation_project/core/comeponents/app_button.dart';
import 'package:graduation_project/core/comeponents/app_input.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/data/models/order_model.dart';
import 'package:graduation_project/logic/providers/auth_provider.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:graduation_project/logic/providers/orders_provider.dart';
import 'package:graduation_project/core/comeponents/app_background.dart';
import 'package:graduation_project/views/services/payment_method_screen.dart';
import 'package:graduation_project/views/services/widgets/datetime_picker_card.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

/// Unified service request page — submits order to backend,
/// shows waiting screen, triggers TechnicianAcceptedDialog on acceptance.
class RequestServicePage extends StatefulWidget {
  final String serviceName;
  final int serviceId;
  final int? subServiceId;
  final IconData serviceIcon;
  final Color serviceColor;
  final String notes;

  const RequestServicePage({
    super.key,
    required this.serviceName,
    required this.serviceId,
    this.subServiceId,
    required this.serviceIcon,
    required this.serviceColor,
    this.notes = '',
  });

  @override
  State<RequestServicePage> createState() => _RequestServicePageState();
}

class _RequestServicePageState extends State<RequestServicePage> {
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  final _picker = ImagePicker();
  File? _carImage;
  DateTime? _selectedServiceTime;

  @override
  void dispose() {
    _addressController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  // ── Pick image ─────────────────────────────────────────────────
  Future<void> _pickImage(ImageSource source) async {
    Navigator.pop(
      context,
    ); // close bottom sheet first to avoid popping the picker/screen
    try {
      final picked = await _picker.pickImage(source: source, imageQuality: 80);
      if (picked != null && mounted) {
        setState(() => _carImage = File(picked.path));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  void _showImageSourceSheet(AppStrings s) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      backgroundColor: Theme.of(context).colorScheme.surface,
      builder:
          (_) => Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade400,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  s.isArabic ? 'اختر مصدر الصورة' : 'Choose Image Source',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: _SourceButton(
                        icon: Icons.camera_alt_rounded,
                        label: s.isArabic ? 'الكاميرا' : 'Camera',
                        color: Theme.of(context).colorScheme.primary,
                        onTap: () => _pickImage(ImageSource.camera),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _SourceButton(
                        icon: Icons.photo_library_rounded,
                        label: s.isArabic ? 'المعرض' : 'Gallery',
                        color: AppTheme.secondaryColor,
                        onTap: () => _pickImage(ImageSource.gallery),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
    );
  }

  // ── Navigate to Payment Method Screen ─────────────────────────
  void _submit(AppStrings s) {
    if (_addressController.text.trim().isEmpty ||
        _phoneController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            s.isArabic ? 'الرجاء ملء جميع الحقول' : 'Please fill all fields',
          ),
        ),
      );
      return;
    }

    final auth = context.read<AuthProvider>();
    final userId = auth.currentUser?.id ?? 0;

    String finalNotes = widget.notes;
    if (_selectedServiceTime != null) {
      final timeStr = DateFormat('dd-MM-yyyy  hh:mm a', 'en').format(_selectedServiceTime!);
      final prefix = s.isArabic ? 'موعد الخدمة المفضل:' : 'Preferred Service Time:';
      // \u200E forces left-to-right rendering for the date/time string to prevent RTL mixups
      final formattedTime = '\n\u200E$timeStr';
      finalNotes = finalNotes.isEmpty ? '$prefix$formattedTime' : '$finalNotes\n\n$prefix$formattedTime';
    }

    final dto = CreateOrderDto(
      userId: userId,
      serviceId: widget.serviceId,
      subServiceId: widget.subServiceId,
      address: _addressController.text.trim(),
      phoneNumber: _phoneController.text.trim(),
      carImagePath: _carImage?.path,
      serviceName: widget.serviceName,
      notes: finalNotes.isNotEmpty ? finalNotes : null,
      neededServiceTime: _selectedServiceTime,
    );

    // Navigate to Payment Method Screen with the prepared DTO
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => PaymentMethodScreen(
          orderDto: dto,
          serviceIcon: widget.serviceIcon,
          serviceColor: widget.serviceColor,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    return AppBackground(
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: Colors.transparent,
        extendBodyBehindAppBar: true,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: IconButton(
            icon: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.3),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.arrow_back,
                color: Colors.white,
                size: 20,
              ),
            ),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: _buildFormScreen(s),
      ),
    );
  }



  // ── Form screen ────────────────────────────────────────────────
  Widget _buildFormScreen(AppStrings s) {
    final topPad = MediaQuery.of(context).padding.top;
    final imageH = 260.0 + topPad;

    return Consumer<OrdersProvider>(
      builder:
          (_, orders, __) => Stack(
            children: [
              // Background Image
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                height: imageH + 30,
                child: Image.asset(
                  'assets/images/emergency.jpeg',
                  fit: BoxFit.cover,
                ),
              ),

              // Foreground Form Container
              Column(
                children: [
                  Expanded(
                    child: CustomScrollView(
                      physics: const BouncingScrollPhysics(),
                      keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
                      slivers: [
                        SliverAppBar(
                          expandedHeight: imageH - 120,
                          pinned: false,
                          floating: false,
                          backgroundColor: Colors.transparent,
                          surfaceTintColor: Colors.transparent,
                          shadowColor: Colors.transparent,
                          forceMaterialTransparency: true,
                          automaticallyImplyLeading: false,
                          elevation: 0,
                        ),
                        SliverToBoxAdapter(
                          child: Container(
                            width: double.infinity,
                            decoration: BoxDecoration(
                              color: Theme.of(context).scaffoldBackgroundColor,
                              borderRadius: const BorderRadius.only(
                                topLeft: Radius.circular(30),
                                topRight: Radius.circular(30),
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.1),
                                  blurRadius: 10,
                                  offset: const Offset(0, -5),
                                ),
                              ],
                            ),
                            child: Column(
                              children: [
                                const SizedBox(height: 16),
                                Container(
                                  width: 40,
                                  height: 5,
                                  decoration: BoxDecoration(
                                    color: Colors.grey.withValues(alpha: 0.3),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                ),
                                const SizedBox(height: 16),

                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 24,
                                  ),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        s.isArabic
                                            ? 'تفاصيل الطلب'
                                            : 'Order Details',
                                        style: Theme.of(
                                          context,
                                        ).textTheme.titleMedium?.copyWith(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18,
                                        ),
                                      ),
                                      const SizedBox(height: 16),

                                      TextField(
                                        controller: _addressController,
                                        maxLines: 3,
                                        decoration: InputDecoration(
                                          hintText:
                                              s.isArabic
                                                  ? 'العنوان بالتفصيل'
                                                  : 'Detailed address',
                                          prefixIcon: const Icon(
                                            Icons.location_on_outlined,
                                          ),
                                          border: OutlineInputBorder(
                                            borderRadius: BorderRadius.circular(
                                              12,
                                            ),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(height: 16),

                                      AppInput(
                                        controller: _phoneController,
                                        hint:
                                            s.isArabic
                                                ? 'رقم الهاتف'
                                                : 'Phone number',
                                        prefixIconData: Icons.phone_android,
                                        keyboardType: TextInputType.phone,
                                      ),
                                      const SizedBox(height: 24),

                                      Text(
                                        s.isArabic
                                            ? 'صورة السيارة (اختياري)'
                                            : 'Car Photo (optional)',
                                        style: Theme.of(
                                          context,
                                        ).textTheme.titleMedium?.copyWith(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18,
                                        ),
                                      ),
                                      const SizedBox(height: 12),

                                      _carImage == null
                                          ? _buildImagePickerButton(s)
                                          : _buildImagePreview(s),

                                      const SizedBox(height: 24),
                                      Text(
                                        s.isArabic
                                            ? 'توقيت الخدمة'
                                            : 'Service Time',
                                        style: Theme.of(
                                          context,
                                        ).textTheme.titleMedium?.copyWith(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18,
                                        ),
                                      ),
                                      const SizedBox(height: 12),
                                      DateTimePickerCard(
                                        onDateTimeSelected: (date) {
                                          setState(() {
                                            _selectedServiceTime = date;
                                          });
                                        },
                                      ),


                                      const SizedBox(height: 32),

                                      _InfoBox(
                                        icon: Icons.access_time,
                                        color:
                                            Theme.of(
                                              context,
                                            ).colorScheme.primary,
                                        title:
                                            s.isArabic
                                                ? 'وقت الاستجابة'
                                                : 'Response Time',
                                        subtitle:
                                            s.isArabic
                                                ? 'سيتم الرد خلال 5 دقائق من الإرسال'
                                                : 'We respond within 5 minutes',
                                      ),
                                      const SizedBox(height: 12),
                                      _InfoBox(
                                        icon: Icons.verified_user,
                                        color: AppTheme.successColor,
                                        title:
                                            s.isArabic
                                                ? 'فنيون معتمدون'
                                                : 'Certified Technicians',
                                        subtitle:
                                            s.isArabic
                                                ? 'جميع فنيينا حاصلون على شهادات معتمدة'
                                                : 'All technicians are fully certified',
                                      ),
                                      SizedBox(height: 40 + MediaQuery.of(context).viewInsets.bottom),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Submit button
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Theme.of(context).scaffoldBackgroundColor,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.05),
                          offset: const Offset(0, -5),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                    child:
                        orders.isLoading
                            ? Center(
                              child: CircularProgressIndicator(
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            )
                            : AppButton(
                              text: s.isArabic ? 'إرسال الطلب' : 'Send Request',
                              onPressed: () => _submit(s),
                            ),
                  ),
                ],
              ),
            ],
          ),
    );
  }

  Widget _buildImagePickerButton(AppStrings s) {
    return GestureDetector(
      onTap: () => _showImageSourceSheet(s),
      child: Container(
        width: double.infinity,
        height: 140,
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: widget.serviceColor.withValues(alpha: 0.4),
            width: 2,
            style: BorderStyle.solid,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: widget.serviceColor.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.add_a_photo_rounded,
                color: widget.serviceColor,
                size: 30,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              s.isArabic ? 'اضغط لإضافة صورة السيارة' : 'Tap to add car photo',
              style: TextStyle(
                color: widget.serviceColor,
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              s.isArabic ? 'كاميرا أو معرض الصور' : 'Camera or gallery',
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImagePreview(AppStrings s) {
    return Stack(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Image.file(
            _carImage!,
            width: double.infinity,
            height: 180,
            fit: BoxFit.cover,
          ),
        ),
        Positioned(
          top: 8,
          right: 8,
          child: GestureDetector(
            onTap: () => setState(() => _carImage = null),
            child: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.black54,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.close, color: Colors.white, size: 18),
            ),
          ),
        ),
        Positioned(
          bottom: 8,
          right: 8,
          child: GestureDetector(
            onTap: () => _showImageSourceSheet(s),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.black54,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [
                  const Icon(Icons.edit, color: Colors.white, size: 16),
                  const SizedBox(width: 4),
                  Text(
                    s.isArabic ? 'تغيير' : 'Change',
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

// ── Helpers ──────────────────────────────────────────────────────

class _SourceButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  const _SourceButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 20),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withValues(alpha: 0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(color: color, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoBox extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String subtitle;
  const _InfoBox({
    required this.icon,
    required this.color,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.07),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: color,
                    fontSize: 13,
                  ),
                ),
                Text(
                  subtitle,
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

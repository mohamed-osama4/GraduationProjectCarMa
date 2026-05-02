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
import 'package:graduation_project/views/home/widgets/technician_accepted_dialog.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

/// Unified service request page — submits order to backend,
/// shows waiting screen, triggers TechnicianAcceptedDialog on acceptance.
class RequestServicePage extends StatefulWidget {
  final String serviceName;
  final int serviceId;
  final IconData serviceIcon;
  final Color serviceColor;
  final String notes;

  const RequestServicePage({
    super.key,
    required this.serviceName,
    required this.serviceId,
    required this.serviceIcon,
    required this.serviceColor,
    this.notes = '',
  });

  @override
  State<RequestServicePage> createState() => _RequestServicePageState();
}

class _RequestServicePageState extends State<RequestServicePage> {
  final _addressController = TextEditingController();
  final _phoneController   = TextEditingController();
  final _picker = ImagePicker();
  File? _carImage;
  bool _submitted = false;

  @override
  void dispose() {
    _addressController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  // ── Pick image ─────────────────────────────────────────────────
  Future<void> _pickImage(ImageSource source) async {
    Navigator.pop(context); // close bottom sheet first to avoid popping the picker/screen
    try {
      final picked = await _picker.pickImage(source: source, imageQuality: 80);
      if (picked != null && mounted) {
        setState(() => _carImage = File(picked.path));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  void _showImageSourceSheet(AppStrings s) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      backgroundColor: Theme.of(context).colorScheme.surface,
      builder: (_) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey.shade400, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 20),
            Text(s.isArabic ? 'اختر مصدر الصورة' : 'Choose Image Source',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(child: _SourceButton(
                  icon: Icons.camera_alt_rounded,
                  label: s.isArabic ? 'الكاميرا' : 'Camera',
                  color: AppTheme.primaryColor,
                  onTap: () => _pickImage(ImageSource.camera),
                )),
                const SizedBox(width: 16),
                Expanded(child: _SourceButton(
                  icon: Icons.photo_library_rounded,
                  label: s.isArabic ? 'المعرض' : 'Gallery',
                  color: AppTheme.secondaryColor,
                  onTap: () => _pickImage(ImageSource.gallery),
                )),
              ],
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  // ── Submit order ───────────────────────────────────────────────
  Future<void> _submit(AppStrings s) async {
    if (_addressController.text.trim().isEmpty || _phoneController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(s.isArabic ? 'الرجاء ملء جميع الحقول' : 'Please fill all fields')),
      );
      return;
    }

    final auth   = context.read<AuthProvider>();
    final orders = context.read<OrdersProvider>();
    final userId = auth.currentUser?.id ?? 0;

    orders.onOrderAccepted = (order) {
      if (mounted) TechnicianAcceptedDialog.show(context, order);
    };

    final dto = CreateOrderDto(
      userId:       userId,
      vehicleId:    1,
      serviceId:    widget.serviceId,
      address:      _addressController.text.trim(),
      phoneNumber:  _phoneController.text.trim(),
      carImagePath: _carImage?.path,
      serviceName:  widget.serviceName,
      notes:        widget.notes.isNotEmpty ? widget.notes : null,
    );

    final newOrder = await orders.createOrder(dto);
    if (!mounted) return;

    if (newOrder != null) {
      setState(() => _submitted = true);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(orders.errorMessage ?? (s.isArabic ? 'فشل إرسال الطلب' : 'Failed to send order'))),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(widget.serviceName),
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => Navigator.pop(context)),
      ),
      body: _submitted ? _buildWaitingScreen(s) : _buildFormScreen(s),
    );
  }

  // ── Waiting screen ─────────────────────────────────────────────
  Widget _buildWaitingScreen(AppStrings s) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TweenAnimationBuilder<double>(
              tween: Tween(begin: 0.95, end: 1.05),
              duration: const Duration(milliseconds: 900),
              builder: (_, scale, child) => Transform.scale(scale: scale, child: child),
              child: Container(
                width: 110,
                height: 110,
                decoration: BoxDecoration(color: AppTheme.primaryColor.withValues(alpha: 0.1), shape: BoxShape.circle),
                child: Icon(widget.serviceIcon, color: AppTheme.primaryColor, size: 54),
              ),
            ),
            const SizedBox(height: 28),
            Text(
              s.isArabic ? 'تم إرسال طلبك بنجاح! ✅' : 'Order Sent Successfully! ✅',
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text(
              s.isArabic
                  ? 'طلبك الآن قيد المراجعة من قِبل الإدارة.\nسيتم إخطارك فور الموافقة وتعيين الفني.'
                  : 'Your order is being reviewed.\nYou will be notified when a technician is assigned.',
              style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 15, height: 1.6),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              child: AppButton(
                text: s.isArabic ? 'العودة للرئيسية' : 'Back to Home',
                onPressed: () {
                  Navigator.of(context).popUntil((route) => route.isFirst);
                },
              ),
            ),
            const SizedBox(height: 16),
            Text(
              s.isArabic ? 'يمكنك متابعة حالة الطلب من الشاشة الرئيسية' : 'You can track the order status from the home screen',
              style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  // ── Form screen ────────────────────────────────────────────────
  Widget _buildFormScreen(AppStrings s) {
    return Consumer<OrdersProvider>(
      builder: (_, orders, __) => SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Service header card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(colors: [
                          widget.serviceColor.withValues(alpha: 0.15),
                          widget.serviceColor.withValues(alpha: 0.05),
                        ]),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: widget.serviceColor.withValues(alpha: 0.3)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(color: widget.serviceColor.withValues(alpha: 0.15), shape: BoxShape.circle),
                            child: Icon(widget.serviceIcon, color: widget.serviceColor, size: 30),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(widget.serviceName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                                const SizedBox(height: 4),
                                Text(
                                  s.isArabic ? 'أدخل بياناتك وسنرسل فنياً متخصصاً' : 'Enter details and we\'ll send a technician',
                                  style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 28),

                    // ── Address & Phone ──────────────────────────
                    Text(s.isArabic ? 'تفاصيل الطلب' : 'Order Details',
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 14),

                    TextField(
                      controller: _addressController,
                      maxLines: 3,
                      decoration: InputDecoration(
                        hintText: s.isArabic ? 'العنوان بالتفصيل' : 'Detailed address',
                        prefixIcon: const Icon(Icons.location_on_outlined),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                    const SizedBox(height: 14),

                    AppInput(
                      controller: _phoneController,
                      hint: s.isArabic ? 'رقم الهاتف' : 'Phone number',
                      prefixIconData: Icons.phone_android,
                      keyboardType: TextInputType.phone,
                    ),
                    const SizedBox(height: 24),

                    // ── Car Photo ────────────────────────────────
                    Text(s.isArabic ? 'صورة السيارة (اختياري)' : 'Car Photo (optional)',
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),

                    _carImage == null
                        ? _buildImagePickerButton(s)
                        : _buildImagePreview(s),

                    const SizedBox(height: 24),

                    // ── Info boxes ───────────────────────────────
                    _InfoBox(
                      icon: Icons.access_time,
                      color: AppTheme.primaryColor,
                      title: s.isArabic ? 'وقت الاستجابة' : 'Response Time',
                      subtitle: s.isArabic ? 'سيتم الرد خلال 5 دقائق من الإرسال' : 'We respond within 5 minutes',
                    ),
                    const SizedBox(height: 12),
                    _InfoBox(
                      icon: Icons.verified_user,
                      color: AppTheme.successColor,
                      title: s.isArabic ? 'فنيون معتمدون' : 'Certified Technicians',
                      subtitle: s.isArabic ? 'جميع فنيينا حاصلون على شهادات معتمدة' : 'All technicians are fully certified',
                    ),
                  ],
                ),
              ),
            ),

            // Submit button
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), offset: const Offset(0, -5), blurRadius: 10)],
              ),
              child: orders.isLoading
                  ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryColor))
                  : AppButton(
                      text: s.isArabic ? 'إرسال الطلب' : 'Send Request',
                      onPressed: () => _submit(s),
                    ),
            ),
          ],
        ),
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
          border: Border.all(color: widget.serviceColor.withValues(alpha: 0.4), width: 2, style: BorderStyle.solid),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: widget.serviceColor.withValues(alpha: 0.1), shape: BoxShape.circle),
              child: Icon(Icons.add_a_photo_rounded, color: widget.serviceColor, size: 30),
            ),
            const SizedBox(height: 12),
            Text(
              s.isArabic ? 'اضغط لإضافة صورة السيارة' : 'Tap to add car photo',
              style: TextStyle(color: widget.serviceColor, fontWeight: FontWeight.w600, fontSize: 14),
            ),
            const SizedBox(height: 4),
            Text(
              s.isArabic ? 'كاميرا أو معرض الصور' : 'Camera or gallery',
              style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12),
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
          child: Image.file(_carImage!, width: double.infinity, height: 180, fit: BoxFit.cover),
        ),
        Positioned(
          top: 8, right: 8,
          child: GestureDetector(
            onTap: () => setState(() => _carImage = null),
            child: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(color: Colors.black54, shape: BoxShape.circle),
              child: const Icon(Icons.close, color: Colors.white, size: 18),
            ),
          ),
        ),
        Positioned(
          bottom: 8, right: 8,
          child: GestureDetector(
            onTap: () => _showImageSourceSheet(s),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(20)),
              child: Row(
                children: [
                  const Icon(Icons.edit, color: Colors.white, size: 16),
                  const SizedBox(width: 4),
                  Text(s.isArabic ? 'تغيير' : 'Change', style: const TextStyle(color: Colors.white, fontSize: 13)),
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
  const _SourceButton({required this.icon, required this.label, required this.color, required this.onTap});

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
            Text(label, style: TextStyle(color: color, fontWeight: FontWeight.bold)),
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
  const _InfoBox({required this.icon, required this.color, required this.title, required this.subtitle});

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
                Text(title, style: TextStyle(fontWeight: FontWeight.bold, color: color, fontSize: 13)),
                Text(subtitle, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:graduation_project/core/comeponents/app_background.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/data/models/order_model.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:graduation_project/logic/providers/orders_provider.dart';
import 'package:graduation_project/views/home/widgets/technician_accepted_dialog.dart';
import 'package:provider/provider.dart';

/// Payment Method Screen — shown after the user fills out the service
/// request form and presses "إرسال الطلب". Only Cash is currently enabled;
/// InstaPay, Fawry, Vodafone Cash and Apple Pay are displayed as "قريباً".
class PaymentMethodScreen extends StatefulWidget {
  /// The pre-built DTO carrying all order data from the form.
  final CreateOrderDto orderDto;

  /// Service visual identity (used in the waiting/success screen).
  final IconData serviceIcon;
  final Color serviceColor;

  const PaymentMethodScreen({
    super.key,
    required this.orderDto,
    required this.serviceIcon,
    required this.serviceColor,
  });

  @override
  State<PaymentMethodScreen> createState() => _PaymentMethodScreenState();
}

class _PaymentMethodScreenState extends State<PaymentMethodScreen>
    with SingleTickerProviderStateMixin {
  /// Index of the currently selected payment method (null = none selected).
  int? _selectedIndex;

  /// Tracks whether the order has been submitted.
  bool _submitted = false;

  late final AnimationController _headerAnimCtrl;
  late final Animation<double> _headerFadeIn;

  @override
  void initState() {
    super.initState();
    _headerAnimCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _headerFadeIn = CurvedAnimation(
      parent: _headerAnimCtrl,
      curve: Curves.easeOut,
    );
    _headerAnimCtrl.forward();
  }

  @override
  void dispose() {
    _headerAnimCtrl.dispose();
    super.dispose();
  }

  // ── Payment method definitions ─────────────────────────────────
  List<PaymentMethodData> _buildMethods(bool isArabic) {
    return [
      PaymentMethodData(
        id: 'cash',
        title: isArabic ? 'الدفع بعد الانتهاء من الخدمة' : 'Cash after service',
        subtitle:
            isArabic
                ? 'ادفع مباشرة بعد تنفيذ الخدمة'
                : 'Pay directly after service completion',
        iconWidget: _buildIconContainer(
          Icons.payments_rounded,
          AppTheme.successColor,
        ),
        enabled: true,
      ),
      PaymentMethodData(
        id: 'instapay',
        title: isArabic ? 'انستا باي' : 'InstaPay',
        subtitle: isArabic ? 'الدفع عبر انستا باي' : 'Pay via InstaPay',
        iconWidget: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Padding(
            padding: const EdgeInsets.all(6.0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.asset(
                'assets/images/instapay.jpeg',
                fit: BoxFit.contain,
              ),
            ),
          ),
        ),
        enabled: false,
      ),
      PaymentMethodData(
        id: 'fawry',
        title: isArabic ? 'فوري' : 'Fawry',
        subtitle: isArabic ? 'الدفع عبر فوري' : 'Pay via Fawry',
        iconWidget: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Padding(
            padding: const EdgeInsets.all(4.0),
            child: Transform.scale(
              scale: 1.2,
              child: SvgPicture.asset(
                'assets/icons/fawry.svg',
                fit: BoxFit.contain,
              ),
            ),
          ),
        ),
        enabled: false,
      ),
      PaymentMethodData(
        id: 'vodafone_cash',
        title: isArabic ? 'فودافون كاش' : 'Vodafone Cash',
        subtitle: isArabic ? 'الدفع عبر فودافون كاش' : 'Pay via Vodafone Cash',
        iconWidget: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Padding(
            padding: const EdgeInsets.all(4),
            child: SvgPicture.asset(
              'assets/icons/vodafon.svg',
              fit: BoxFit.contain,
            ),
          ),
        ),
        enabled: false,
      ),
      PaymentMethodData(
        id: 'apple_pay',
        title: isArabic ? 'أبل باي' : 'Apple Pay',
        subtitle: isArabic ? 'الدفع عبر أبل باي' : 'Pay via Apple Pay',
        iconWidget: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Padding(
            padding: const EdgeInsets.all(6),
            child: SvgPicture.asset(
              'assets/icons/applepay.svg',
              fit: BoxFit.contain,
            ),
          ),
        ),
        enabled: false,
      ),
    ];
  }

  /// Builds a round icon container for the Cash method.
  Widget _buildIconContainer(IconData icon, Color color) {
    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Icon(icon, color: color, size: 24),
    );
  }

  // ── Submit order ───────────────────────────────────────────────
  Future<void> _confirmOrder(AppStrings s, String paymentMethodId) async {
    final orders = context.read<OrdersProvider>();

    orders.onOrderAccepted = (order) {
      if (mounted) TechnicianAcceptedDialog.show(context, order);
    };

    if (paymentMethodId == 'cash') {
      widget.orderDto.paymentMethod = 1;
    } else if (paymentMethodId == 'instapay') {
      widget.orderDto.paymentMethod = 3;
    } else {
      widget.orderDto.paymentMethod = 2; // wallets
    }

    final newOrder = await orders.createOrder(widget.orderDto);
    if (!mounted) return;

    if (newOrder != null) {
      setState(() => _submitted = true);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            orders.errorMessage ??
                (s.isArabic ? 'فشل إرسال الطلب' : 'Failed to send order'),
          ),
          behavior: SnackBarBehavior.floating,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      );
    }
  }

  // ══════════════════════════════════════════════════════════════
  //  BUILD
  // ══════════════════════════════════════════════════════════════
  @override
  Widget build(BuildContext context) {
    final isArabic = context.watch<LocaleProvider>().isArabic;
    final s = appStrings(isArabic);

    return AppBackground(
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body:
            _submitted
                ? _buildSuccessScreen(s)
                : _buildPaymentScreen(s, isArabic),
      ),
    );
  }

  // ── Payment selection screen ──────────────────────────────────
  Widget _buildPaymentScreen(AppStrings s, bool isArabic) {
    final methods = _buildMethods(isArabic);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return SafeArea(
      child: Column(
        children: [
          // ── App bar ───────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            child: Row(
              children: [
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  style: IconButton.styleFrom(
                    backgroundColor:
                        isDark
                            ? Colors.white.withValues(alpha: 0.08)
                            : Colors.black.withValues(alpha: 0.05),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  icon: Icon(
                    Icons.arrow_back_ios_new_rounded,
                    size: 18,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
              ],
            ),
          ),

          // ── Scrollable content ────────────────────────────────
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
              child: FadeTransition(
                opacity: _headerFadeIn,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // ── Header ─────────────────────────────────
                    Text(
                      s.isArabic ? 'طريقة الدفع' : 'Payment Method',
                      style: Theme.of(context).textTheme.headlineSmall
                          ?.copyWith(fontWeight: FontWeight.w800, fontSize: 26),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      s.isArabic
                          ? 'اختر طريقة الدفع المناسبة لإتمام الطلب'
                          : 'Choose the appropriate payment method to complete the order',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                        fontSize: 15,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 28),

                    // ── Payment method cards ───────────────────
                    ...List.generate(methods.length, (index) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 14),
                        child: PaymentMethodCard(
                          data: methods[index],
                          isSelected: _selectedIndex == index,
                          index: index,
                          onTap:
                              methods[index].enabled
                                  ? () => setState(() => _selectedIndex = index)
                                  : null,
                        ),
                      );
                    }),

                    const SizedBox(height: 16),

                    // ── Secure payment note ────────────────────
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color:
                            isDark
                                ? AppTheme.carmaSurface
                                : const Color(0xFFF0F7FF),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color:
                              isDark
                                  ? AppTheme.carmaOutline
                                  : const Color(0xFFD6E8FF),
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.security_rounded,
                            color: Theme.of(context).colorScheme.primary,
                            size: 22,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              s.isArabic
                                  ? 'جميع المعاملات مؤمنة ومحمية بالكامل'
                                  : 'All transactions are fully secured',
                              style: TextStyle(
                                color:
                                    Theme.of(
                                      context,
                                    ).colorScheme.onSurfaceVariant,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // ── Bottom confirm button ─────────────────────────────
          Consumer<OrdersProvider>(
            builder: (_, orders, __) {
              final canConfirm =
                  _selectedIndex != null && methods[_selectedIndex!].enabled;

              return Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 20,
                ),
                decoration: BoxDecoration(
                  color:
                      isDark
                          ? AppTheme.carmaSurface
                          : Theme.of(context).scaffoldBackgroundColor,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.06),
                      offset: const Offset(0, -4),
                      blurRadius: 12,
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
                        : _ConfirmButton(
                          text: s.isArabic ? 'تأكيد الطلب' : 'Confirm Order',
                          enabled: canConfirm,
                          onPressed:
                              canConfirm
                                  ? () => _confirmOrder(
                                    s,
                                    methods[_selectedIndex!].id,
                                  )
                                  : null,
                        ),
              );
            },
          ),
        ],
      ),
    );
  }

  // ── Order success screen ──────────────────────────────────────
  Widget _buildSuccessScreen(AppStrings s) {
    return SafeArea(
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Animated pulsing icon
              TweenAnimationBuilder<double>(
                tween: Tween(begin: 0.0, end: 1.0),
                duration: const Duration(milliseconds: 800),
                curve: Curves.elasticOut,
                builder:
                    (_, value, child) =>
                        Transform.scale(scale: value, child: child),
                child: Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    color: AppTheme.successColor.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_circle_rounded,
                    color: AppTheme.successColor,
                    size: 64,
                  ),
                ),
              ),
              const SizedBox(height: 28),
              Text(
                s.isArabic
                    ? 'تم إرسال طلبك بنجاح! ✅'
                    : 'Order Sent Successfully! ✅',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                s.isArabic
                    ? 'طلبك الآن قيد المراجعة من قِبل الإدارة.\nسيتم إخطارك فور الموافقة وتعيين الفني.'
                    : 'Your order is being reviewed.\nYou will be notified when a technician is assigned.',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                  fontSize: 15,
                  height: 1.6,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              // Payment method confirmation
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: AppTheme.successColor.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: AppTheme.successColor.withValues(alpha: 0.25),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.payments_rounded,
                      size: 20,
                      color: AppTheme.successColor,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      s.isArabic
                          ? 'طريقة الدفع: الدفع بعد الخدمة'
                          : 'Payment: Cash after service',
                      style: TextStyle(
                        color: AppTheme.successColor,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).popUntil((route) => route.isFirst);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).colorScheme.primary,
                    foregroundColor:
                        Theme.of(context).brightness == Brightness.dark
                            ? AppTheme.carmaDark
                            : Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    elevation: 0,
                  ),
                  child: Text(
                    s.isArabic ? 'العودة للرئيسية' : 'Back to Home',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                s.isArabic
                    ? 'يمكنك متابعة حالة الطلب من الشاشة الرئيسية'
                    : 'You can track the order status from the home screen',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                  fontSize: 13,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ══════════════════════════════════════════════════════════════════
//  DATA MODEL
// ══════════════════════════════════════════════════════════════════

/// Data model for a single payment method entry.
class PaymentMethodData {
  final String id;
  final String title;
  final String subtitle;
  final Widget iconWidget;
  final bool enabled;

  const PaymentMethodData({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.iconWidget,
    required this.enabled,
  });
}

// ══════════════════════════════════════════════════════════════════
//  REUSABLE PAYMENT METHOD CARD
// ══════════════════════════════════════════════════════════════════

class PaymentMethodCard extends StatelessWidget {
  final PaymentMethodData data;
  final bool isSelected;
  final int index;
  final VoidCallback? onTap;

  const PaymentMethodCard({
    super.key,
    required this.data,
    required this.isSelected,
    required this.index,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isArabic = context.watch<LocaleProvider>().isArabic;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = Theme.of(context).colorScheme.primary;

    // ── Card colors based on state ──────────────────────────────
    final Color bgColor;
    final Color borderColor;

    if (isSelected) {
      // Selected — primary accent
      bgColor =
          isDark
              ? primary.withValues(alpha: 0.08)
              : primary.withValues(alpha: 0.04);
      borderColor = primary;
    } else {
      // Default state for unselected (both enabled and disabled)
      bgColor = isDark ? AppTheme.carmaSurface : Colors.white;
      borderColor = isDark ? AppTheme.carmaOutline : Colors.grey.shade200;
    }

    final card = AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor, width: isSelected ? 2 : 1),
        boxShadow:
            isSelected
                ? [
                  BoxShadow(
                    color: primary.withValues(alpha: 0.12),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ]
                : null,
      ),
      child: Row(
        children: [
          // ── Icon / logo ──────────────────────────────────────
          data.iconWidget,
          const SizedBox(width: 14),

          // ── Title & subtitle ──────────────────────────────────
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  data.title,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  data.subtitle,
                  style: TextStyle(
                    fontSize: 12,
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),

          // ── Trailing indicator ────────────────────────────────
          if (data.enabled)
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 250),
              transitionBuilder:
                  (child, anim) => ScaleTransition(scale: anim, child: child),
              child:
                  isSelected
                      ? Icon(
                        Icons.check_circle_rounded,
                        key: const ValueKey('selected'),
                        color: primary,
                        size: 26,
                      )
                      : Icon(
                        Icons.radio_button_unchecked_rounded,
                        key: const ValueKey('unselected'),
                        color:
                            isDark
                                ? AppTheme.carmaSubtleText
                                : Colors.grey.shade400,
                        size: 24,
                      ),
            )
          else
            Icon(
              Icons.lock_outline_rounded,
              color:
                  isDark
                      ? AppTheme.carmaSubtleText.withValues(alpha: 0.5)
                      : Colors.grey.shade400,
              size: 20,
            ),
        ],
      ),
    );

    // Wrap the card: if disabled, add "قريباً" badge
    if (!data.enabled) {
      return Stack(
        clipBehavior: Clip.none,
        children: [
          card,
          // ── "قريباً" badge ─────────────────────────────────
          Positioned(
            top: -8,
            left: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors:
                      isDark
                          ? [const Color(0xFF3A3A3A), const Color(0xFF2A2A2A)]
                          : [const Color(0xFF9E9E9E), const Color(0xFF757575)],
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.15),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Text(
                isArabic ? 'قريباً' : 'Soon',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ),
        ],
      );
    }

    // Enabled card — tappable with ink splash
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: card,
      ),
    );
  }
}

// ══════════════════════════════════════════════════════════════════
//  CONFIRM BUTTON
// ══════════════════════════════════════════════════════════════════

class _ConfirmButton extends StatelessWidget {
  final String text;
  final bool enabled;
  final VoidCallback? onPressed;

  const _ConfirmButton({
    required this.text,
    required this.enabled,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = Theme.of(context).colorScheme.primary;

    return AnimatedOpacity(
      opacity: enabled ? 1.0 : 0.5,
      duration: const Duration(milliseconds: 250),
      child: SizedBox(
        width: double.infinity,
        height: 54,
        child: DecoratedBox(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            gradient:
                enabled
                    ? LinearGradient(
                      begin: Alignment.centerLeft,
                      end: Alignment.centerRight,
                      colors:
                          isDark
                              ? [AppTheme.carmaGold, AppTheme.carmaGoldDim]
                              : const [Color(0xff1C398E), Color(0xff1447E6)],
                    )
                    : null,
            color:
                enabled
                    ? null
                    : (isDark ? AppTheme.carmaOutline : Colors.grey.shade300),
            boxShadow:
                enabled
                    ? [
                      BoxShadow(
                        color: primary.withValues(alpha: 0.3),
                        blurRadius: 14,
                        offset: const Offset(0, 6),
                      ),
                    ]
                    : null,
          ),
          child: ElevatedButton(
            onPressed: onPressed,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.transparent,
              shadowColor: Colors.transparent,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.check_circle_outline_rounded,
                  size: 20,
                  color: isDark ? AppTheme.carmaDark : Colors.white,
                ),
                const SizedBox(width: 8),
                Text(
                  text,
                  style: TextStyle(
                    color: isDark ? AppTheme.carmaDark : Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:graduation_project/views/login.dart';
import 'package:graduation_project/views/create_account.dart';

// ═══════════════════════════════════════════════════════════════════════════════
//  Onboarding Screen
// ═══════════════════════════════════════════════════════════════════════════════

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _animController;
  late final Animation<double> _fadeIn;
  late final Animation<Offset> _slideUp;

  final PageController _pageController = PageController();
  int _currentPage = 0;

  /// Background images per page
  static const _backgroundImages = [
    'assets/images/onboarding.PNG',
    'assets/images/next.png',
    'assets/images/last.png',
  ];

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );
    _fadeIn = CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _slideUp = Tween<Offset>(
      begin: const Offset(0, 0.15),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOutCubic),
    );
    _animController.forward();
  }

  @override
  void dispose() {
    _pageController.dispose();
    _animController.dispose();
    super.dispose();
  }

  void _navigateNext() {
    if (_currentPage < _backgroundImages.length - 1) {
      _pageController.animateToPage(
        _currentPage + 1,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    }
  }

  void _navigateTo(Widget page) {
    Navigator.pushReplacement(
      context,
      PageRouteBuilder(
        pageBuilder: (_, __, ___) => page,
        transitionsBuilder: (_, anim, __, child) =>
            FadeTransition(opacity: anim, child: child),
        transitionDuration: const Duration(milliseconds: 400),
      ),
    );
  }

  /// Build the feature cards list for each page from localized strings.
  List<_FeatureCardInfo> _getPageFeatures(AppStrings s, int page) {
    switch (page) {
      case 0:
        return [
          _FeatureCardInfo(Icons.verified_outlined, s.ob1Feature1Title, s.ob1Feature1Sub),
          _FeatureCardInfo(Icons.touch_app_outlined, s.ob1Feature2Title, s.ob1Feature2Sub),
          _FeatureCardInfo(Icons.location_on_outlined, s.ob1Feature3Title, s.ob1Feature3Sub),
        ];
      case 1:
        return [
          _FeatureCardInfo(Icons.my_location_outlined, s.ob2Feature1Title, s.ob2Feature1Sub),
          _FeatureCardInfo(Icons.access_time_outlined, s.ob2Feature2Title, s.ob2Feature2Sub),
          _FeatureCardInfo(Icons.local_shipping_outlined, s.ob2Feature3Title, s.ob2Feature3Sub),
        ];
      case 2:
        return [
          _FeatureCardInfo(Icons.star_outline_rounded, s.ob3Feature1Title, s.ob3Feature1Sub),
          _FeatureCardInfo(Icons.verified_user_outlined, s.ob3Feature2Title, s.ob3Feature2Sub),
          _FeatureCardInfo(Icons.payment_outlined, s.ob3Feature3Title, s.ob3Feature3Sub),
        ];
      default:
        return [];
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final bottomPad = MediaQuery.of(context).padding.bottom;
    final isArabic = context.watch<LocaleProvider>().isArabic;
    final s = appStrings(isArabic);
    final features = _getPageFeatures(s, _currentPage);

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // ── Sliding Background Pages ──────────────────────────────
          PageView.builder(
            controller: _pageController,
            itemCount: _backgroundImages.length,
            onPageChanged: (i) => setState(() => _currentPage = i),
            itemBuilder: (_, i) => _BackgroundLayer(
              image: _backgroundImages[i],
              size: size,
            ),
          ),

          // ── Fixed Content Overlay ─────────────────────────────────
          SafeArea(
            child: FadeTransition(
              opacity: _fadeIn,
              child: SlideTransition(
                position: _slideUp,
                child: Column(
                  children: [
                    const Spacer(flex: 5),

                    // ── Feature Cards (animated crossfade) ──────────
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 300),
                      switchInCurve: Curves.easeOut,
                      switchOutCurve: Curves.easeIn,
                      child: _FeatureRow(
                        key: ValueKey<int>(_currentPage),
                        features: features,
                      ),
                    ),

                    const SizedBox(height: 24),

                    // ── Page Indicator Dots ──────────────────────────
                    _PageDots(
                      count: _backgroundImages.length,
                      current: _currentPage,
                    ),

                    const SizedBox(height: 32),

                    // ── Buttons (same on all pages) ─────────────────
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 32),
                      child: _OnboardingButton(
                        text: s.register,
                        onPressed: () => _navigateTo(const CreateAccount()),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 32),
                      child: _OnboardingOutlinedButton(
                        text: s.login,
                        onPressed: () => _navigateTo(const LoginPage()),
                      ),
                    ),

                    SizedBox(height: bottomPad > 0 ? 16 : 32),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
//  Simple data holder for feature card info
// ═══════════════════════════════════════════════════════════════════════════════

class _FeatureCardInfo {
  final IconData icon;
  final String title;
  final String subtitle;
  const _FeatureCardInfo(this.icon, this.title, this.subtitle);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Background Layer (image + gradient overlay)
// ═══════════════════════════════════════════════════════════════════════════════

class _BackgroundLayer extends StatelessWidget {
  final String image;
  final Size size;
  const _BackgroundLayer({required this.image, required this.size});

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        Image.asset(image, fit: BoxFit.cover, width: size.width, height: size.height),
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Colors.black.withValues(alpha: 0.20),
                Colors.black.withValues(alpha: 0.30),
                Colors.black.withValues(alpha: 0.55),
                Colors.black.withValues(alpha: 0.85),
              ],
              stops: const [0.0, 0.35, 0.65, 1.0],
            ),
          ),
        ),
      ],
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Feature Row (3 cards)
// ═══════════════════════════════════════════════════════════════════════════════

class _FeatureRow extends StatelessWidget {
  final List<_FeatureCardInfo> features;
  const _FeatureRow({super.key, required this.features});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: features
            .map((f) => _FeatureCard(icon: f.icon, title: f.title, subtitle: f.subtitle))
            .toList(),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Feature Card Widget
// ═══════════════════════════════════════════════════════════════════════════════

class _FeatureCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;

  const _FeatureCard({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Icon container
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: AppTheme.carmaGold.withValues(alpha: 0.40),
              width: 1.5,
            ),
            color: Colors.white.withValues(alpha: 0.08),
          ),
          child: Icon(icon, color: AppTheme.carmaGold, size: 26),
        ),
        const SizedBox(height: 10),
        // Title
        Text(
          title,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 13,
            fontWeight: FontWeight.w700,
            height: 1.3,
          ),
        ),
        const SizedBox(height: 2),
        // Subtitle
        Text(
          subtitle,
          textAlign: TextAlign.center,
          style: TextStyle(
            color: Colors.white.withValues(alpha: 0.60),
            fontSize: 11,
            fontWeight: FontWeight.w400,
            height: 1.3,
          ),
        ),
      ],
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Page Indicator Dots
// ═══════════════════════════════════════════════════════════════════════════════

class _PageDots extends StatelessWidget {
  final int count;
  final int current;
  const _PageDots({required this.count, required this.current});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(count, (i) {
        final isActive = i == current;
        return AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
          margin: const EdgeInsets.symmetric(horizontal: 4),
          width: isActive ? 24 : 8,
          height: 8,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(4),
            color: isActive
                ? AppTheme.carmaGold
                : Colors.white.withValues(alpha: 0.35),
          ),
        );
      }),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Onboarding Button – matches AppButton gradient style exactly
// ═══════════════════════════════════════════════════════════════════════════════

class _OnboardingButton extends StatefulWidget {
  final String text;
  final VoidCallback onPressed;

  const _OnboardingButton({
    required this.text,
    required this.onPressed,
  });

  @override
  State<_OnboardingButton> createState() => _OnboardingButtonState();
}

class _OnboardingButtonState extends State<_OnboardingButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pressController;
  late final Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _pressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 120),
      reverseDuration: const Duration(milliseconds: 200),
      lowerBound: 0.0,
      upperBound: 1.0,
    );
    _scaleAnim = Tween<double>(begin: 1.0, end: 0.96).animate(
      CurvedAnimation(parent: _pressController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pressController.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails _) => _pressController.forward();
  void _onTapUp(TapUpDetails _) {
    _pressController.reverse();
    widget.onPressed();
  }

  void _onTapCancel() => _pressController.reverse();

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      child: AnimatedBuilder(
        animation: _scaleAnim,
        builder: (context, child) => Transform.scale(
          scale: _scaleAnim.value,
          child: child,
        ),
        child: Container(
          width: double.infinity,
          height: 52,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            gradient: const LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [AppTheme.carmaGold, AppTheme.carmaGoldDim],
            ),
            boxShadow: [
              BoxShadow(
                color: AppTheme.carmaGold.withValues(alpha: 0.35),
                blurRadius: 16,
                offset: const Offset(0, 6),
                spreadRadius: -2,
              ),
            ],
          ),
          child: Center(
            child: Text(
              widget.text,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 17,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.3,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Outlined Button – gold border, transparent fill (for "Log In")
// ═══════════════════════════════════════════════════════════════════════════════

class _OnboardingOutlinedButton extends StatefulWidget {
  final String text;
  final VoidCallback onPressed;

  const _OnboardingOutlinedButton({
    required this.text,
    required this.onPressed,
  });

  @override
  State<_OnboardingOutlinedButton> createState() =>
      _OnboardingOutlinedButtonState();
}

class _OnboardingOutlinedButtonState extends State<_OnboardingOutlinedButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pressController;
  late final Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _pressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 120),
      reverseDuration: const Duration(milliseconds: 200),
      lowerBound: 0.0,
      upperBound: 1.0,
    );
    _scaleAnim = Tween<double>(begin: 1.0, end: 0.96).animate(
      CurvedAnimation(parent: _pressController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pressController.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails _) => _pressController.forward();
  void _onTapUp(TapUpDetails _) {
    _pressController.reverse();
    widget.onPressed();
  }

  void _onTapCancel() => _pressController.reverse();

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      child: AnimatedBuilder(
        animation: _scaleAnim,
        builder: (context, child) => Transform.scale(
          scale: _scaleAnim.value,
          child: child,
        ),
        child: Container(
          width: double.infinity,
          height: 52,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            color: Colors.transparent,
            border: Border.all(
              color: AppTheme.carmaGold.withValues(alpha: 0.60),
              width: 1.5,
            ),
          ),
          child: Center(
            child: Text(
              widget.text,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 17,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.3,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

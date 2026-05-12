import 'package:flutter/material.dart';
import 'package:graduation_project/core/comeponents/app_button.dart';
import 'package:graduation_project/core/comeponents/app_image.dart';
import 'package:graduation_project/core/comeponents/app_input.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/views/create_account.dart';
import 'package:graduation_project/views/forget_password.dart';
import 'package:graduation_project/views/home/home.dart';
import 'package:provider/provider.dart';
import 'package:graduation_project/logic/providers/auth_provider.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  // Field-specific error messages
  String? _emailError;
  String? _passwordError;
  String? _generalError;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _clearErrors() {
    setState(() {
      _emailError = null;
      _passwordError = null;
      _generalError = null;
    });
  }

  void _handleLogin() async {
    _clearErrors();

    final email = _emailController.text.trim();
    final password = _passwordController.text;

    // Local validation first
    bool hasError = false;
    if (email.isEmpty) {
      setState(() => _emailError = 'الرجاء إدخال البريد الإلكتروني');
      hasError = true;
    } else if (!email.contains('@') || !email.contains('.')) {
      setState(() => _emailError = 'صيغة البريد الإلكتروني غير صحيحة');
      hasError = true;
    }

    if (password.isEmpty) {
      setState(() => _passwordError = 'الرجاء إدخال كلمة المرور');
      hasError = true;
    }

    if (hasError) return;

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.login(email, password);

    if (success) {
      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const HomePage()),
      );
    } else {
      if (!mounted) return;
      final error = authProvider.errorMessage ?? '';

      // Map backend error messages to the right field
      // Handles both English (new backend) and Arabic (legacy) messages
      if (error.contains('غير مسجل') || error.contains('USER_NOT_FOUND') ||
          error.contains('User not found') || error.contains('not found')) {
        setState(() => _emailError = 'هذا البريد الإلكتروني غير مسجّل لدينا');
      } else if (error.contains('المرور') || error.contains('WRONG_PASSWORD') ||
          error.contains('Wrong password') || error.contains('Wrong pass')) {
        setState(() => _passwordError = 'كلمة المرور غير صحيحة');
      } else if (error.contains('Connection') || error.contains('SocketException') || error.contains('Failed host')) {
        setState(() => _generalError = 'لا يمكن الاتصال بالخادم، تأكد من اتصالك بالإنترنت');
      } else {
        setState(() => _generalError = error.isNotEmpty ? error : 'فشل تسجيل الدخول، حاول مرة أخرى');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: SingleChildScrollView(
          keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
          physics: const BouncingScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 40.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 40),
                const AppImage(image: 'logo.png', height: 100, width: 100),
                const SizedBox(height: 24),
                Text(
                  'تسجيل الدخول',
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSurface,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'مرحباً بك مجدداً! يرجى إدخال بياناتك',
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                  ),
                ),
                const SizedBox(height: 48),

                // ── General Error Banner ──
                if (_generalError != null) ...[
                  _ErrorBanner(message: _generalError!),
                  const SizedBox(height: 16),
                ],

                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    AppInput(
                      controller: _emailController,
                      label: 'البريد الإلكتروني',
                      hint: 'example@email.com',
                      keyboardType: TextInputType.emailAddress,
                      onChanged: (_) => setState(() => _emailError = null),
                    ),
                    // Email inline error
                    if (_emailError != null) _InlineError(message: _emailError!),
                    const SizedBox(height: 20),

                    AppInput(
                      controller: _passwordController,
                      label: 'كلمة المرور',
                      hint: 'أدخل كلمة المرور',
                      isPassword: true,
                      onChanged: (_) => setState(() => _passwordError = null),
                    ),
                    // Password inline error
                    if (_passwordError != null) _InlineError(message: _passwordError!),
                    const SizedBox(height: 16),

                    Align(
                      alignment: AlignmentDirectional.centerEnd,
                      child: TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const ForgetPassword()),
                          );
                        },
                        style: TextButton.styleFrom(
                          padding: EdgeInsets.zero,
                          minimumSize: Size.zero,
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        ),
                        child: const Text(
                          'نسيت كلمة السر؟',
                          style: TextStyle(
                            color: AppTheme.primaryColor,
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                    Consumer<AuthProvider>(
                      builder: (context, auth, _) {
                        if (auth.isLoading) {
                          return const Center(child: CircularProgressIndicator());
                        }
                        return AppButton(
                          text: 'تسجيل الدخول',
                          onPressed: _handleLogin,
                        );
                      },
                    ),
                    const SizedBox(height: 32),
                    Row(
                      children: [
                        Expanded(child: Divider(color: Theme.of(context).colorScheme.outline, thickness: 1)),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Text('أو', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 14)),
                        ),
                        Expanded(child: Divider(color: Theme.of(context).colorScheme.outline, thickness: 1)),
                      ],
                    ),
                    const SizedBox(height: 24),
                    AppButton(
                      text: 'إنشاء حساب جديد',
                      isOutlined: true,
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const CreateAccount()),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ─── Inline error under a field ──────────────────────────────────────────────
class _InlineError extends StatelessWidget {
  final String message;
  const _InlineError({required this.message});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsetsDirectional.only(top: 6, start: 4),
      child: Row(
        children: [
          const Icon(Icons.error_outline, size: 14, color: Color(0xFFE7000B)),
          const SizedBox(width: 4),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(color: Color(0xFFE7000B), fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── General error banner at top of form ─────────────────────────────────────
class _ErrorBanner extends StatelessWidget {
  final String message;
  const _ErrorBanner({required this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFEBEB),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFFFB3B3)),
      ),
      child: Row(
        children: [
          const Icon(Icons.wifi_off_rounded, color: Color(0xFFE7000B), size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(color: Color(0xFFB00020), fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:graduation_project/core/comeponents/app_button.dart';
import 'package:graduation_project/core/comeponents/app_input.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/logic/providers/auth_provider.dart';
import 'package:graduation_project/views/home/home.dart';
import 'package:graduation_project/views/login.dart';
import 'package:provider/provider.dart';

class CreateAccount extends StatefulWidget {
  const CreateAccount({super.key});

  @override
  State<CreateAccount> createState() => _CreateAccountState();
}

class _CreateAccountState extends State<CreateAccount> {
  bool isChecked = false;

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  String? _nameError;
  String? _emailError;
  String? _phoneError;
  String? _passwordError;
  String? _confirmPasswordError;
  String? _generalError;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _handleRegister() async {
    // Reset errors
    setState(() {
      _nameError = null;
      _emailError = null;
      _phoneError = null;
      _passwordError = null;
      _confirmPasswordError = null;
      _generalError = null;
    });

    final name = _nameController.text.trim();
    final email = _emailController.text.trim();
    final phone = _phoneController.text.trim();
    final password = _passwordController.text;
    final confirmPassword = _confirmPasswordController.text;

    // Local validation
    bool hasError = false;

    if (name.isEmpty) {
      setState(() => _nameError = 'الرجاء إدخال الاسم الكامل');
      hasError = true;
    }

    if (email.isEmpty) {
      setState(() => _emailError = 'الرجاء إدخال البريد الإلكتروني');
      hasError = true;
    } else if (!email.contains('@') || !email.contains('.')) {
      setState(() => _emailError = 'صيغة البريد الإلكتروني غير صحيحة');
      hasError = true;
    }

    if (phone.isEmpty) {
      setState(() => _phoneError = 'الرجاء إدخال رقم الهاتف');
      hasError = true;
    }

    if (password.isEmpty) {
      setState(() => _passwordError = 'الرجاء إدخال كلمة المرور');
      hasError = true;
    } else if (password.length < 4) {
      setState(() => _passwordError = 'كلمة المرور يجب أن تكون 4 أحرف على الأقل');
      hasError = true;
    }

    if (confirmPassword.isEmpty) {
      setState(() => _confirmPasswordError = 'الرجاء تأكيد كلمة المرور');
      hasError = true;
    } else if (password != confirmPassword) {
      setState(() => _confirmPasswordError = 'كلمتا المرور غير متطابقتين');
      hasError = true;
    }

    if (!isChecked) {
      setState(() => _generalError = 'يجب الموافقة على الشروط والأحكام أولاً');
      hasError = true;
    }

    if (hasError) return;

    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.register(
      name: name,
      email: email,
      phoneNumber: phone,
      password: password,
      confirmPassword: confirmPassword,
    );

    if (success) {
      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const HomePage()),
      );
    } else {
      if (!mounted) return;
      final error = auth.errorMessage ?? '';

      // Handles both English (new backend) and Arabic (legacy) messages
      if (error.contains('مسجّل بالفعل') || error.contains('EMAIL_EXISTS') ||
          error.contains('Email already exists') || error.contains('already exists')) {
        setState(() => _emailError = 'هذا البريد الإلكتروني مسجّل بالفعل، يمكنك تسجيل الدخول');
      } else if (error.contains('متطابقتين') || error.contains('PASSWORD_MISMATCH')) {
        setState(() => _confirmPasswordError = 'كلمتا المرور غير متطابقتين');
      } else if (error.contains('Connection') || error.contains('SocketException') || error.contains('Failed host')) {
        setState(() => _generalError = 'لا يمكن الاتصال بالخادم، تأكد من اتصالك بالإنترنت');
      } else {
        setState(() => _generalError = error.isNotEmpty ? error : 'فشل إنشاء الحساب، حاول مرة أخرى');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xffE2E8F0),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: const Text('إنشاء حساب جديد'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
          physics: const BouncingScrollPhysics(),
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              color: const Color(0xffFFFFFF),
            ),
            child: Padding(
              padding: const EdgeInsetsDirectional.only(
                start: 32, end: 32, bottom: 24, top: 32,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // General error banner
                  if (_generalError != null) ...[
                    _ErrorBanner(message: _generalError!),
                    const SizedBox(height: 16),
                  ],

                  AppInput(
                    controller: _nameController,
                    label: 'الاسم الكامل',
                    hint: 'أدخل اسمك الكامل',
                    keyboardType: TextInputType.name,
                    onChanged: (_) => setState(() => _nameError = null),
                  ),
                  if (_nameError != null) _InlineError(message: _nameError!),
                  const SizedBox(height: 20),

                  AppInput(
                    controller: _emailController,
                    label: 'البريد الإلكتروني',
                    hint: 'example@email.com',
                    keyboardType: TextInputType.emailAddress,
                    onChanged: (_) => setState(() => _emailError = null),
                  ),
                  if (_emailError != null) _InlineError(message: _emailError!),
                  const SizedBox(height: 20),

                  AppInput(
                    controller: _phoneController,
                    label: 'رقم الهاتف',
                    hint: '5xxxxxxxx',
                    keyboardType: TextInputType.phone,
                    withCuntryCode: false,
                    onChanged: (_) => setState(() => _phoneError = null),
                  ),
                  if (_phoneError != null) _InlineError(message: _phoneError!),
                  const SizedBox(height: 20),

                  AppInput(
                    controller: _passwordController,
                    label: 'كلمة المرور',
                    hint: 'أدخل كلمة المرور',
                    isPassword: true,
                    onChanged: (_) => setState(() => _passwordError = null),
                  ),
                  if (_passwordError != null) _InlineError(message: _passwordError!),
                  const SizedBox(height: 20),

                  AppInput(
                    controller: _confirmPasswordController,
                    label: 'تأكيد كلمة المرور',
                    hint: 'أعد إدخال كلمة المرور',
                    isPassword: true,
                    onChanged: (_) => setState(() => _confirmPasswordError = null),
                  ),
                  if (_confirmPasswordError != null) _InlineError(message: _confirmPasswordError!),
                  const SizedBox(height: 20),

                  Row(
                    children: [
                      SizedBox(
                        width: 24,
                        height: 24,
                        child: Checkbox(
                          value: isChecked,
                          activeColor: AppTheme.primaryColor,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                          side: BorderSide(color: Theme.of(context).colorScheme.outline),
                          onChanged: (value) {
                            setState(() {
                              isChecked = value ?? false;
                              if (isChecked) _generalError = null;
                            });
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'أوافق على ',
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                          fontSize: 14,
                        ),
                      ),
                      const Text(
                        'الشروط والأحكام',
                        style: TextStyle(
                          color: AppTheme.primaryColor,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  Consumer<AuthProvider>(
                    builder: (context, auth, _) {
                      if (auth.isLoading) {
                        return const Center(child: CircularProgressIndicator());
                      }
                      return AppButton(
                        text: 'إنشاء حساب',
                        onPressed: _handleRegister,
                      );
                    },
                  ),
                  const SizedBox(height: 32),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'لديك حساب بالفعل؟ ',
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                          fontSize: 14,
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(builder: (context) => const LoginPage()),
                          );
                        },
                        child: const Text(
                          'تسجيل دخول',
                          style: TextStyle(
                            color: AppTheme.primaryColor,
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
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

// ─── General error banner ─────────────────────────────────────────────────────
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
          const Icon(Icons.error_outline_rounded, color: Color(0xFFE7000B), size: 20),
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

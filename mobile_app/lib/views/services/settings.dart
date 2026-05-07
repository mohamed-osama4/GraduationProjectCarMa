import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:graduation_project/core/comeponents/app_image.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:provider/provider.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool isNotificationOn = true;
  late bool isDarkModeOn;

  @override
  void initState() {
    super.initState();
    isDarkModeOn = AppTheme.themeNotifier.value == ThemeMode.dark;
  }

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.primaryColor,
        iconTheme: const IconThemeData(color: Colors.white),
        title: Text(
          s.settings,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildGeneralSettingsStack(s),
            const SizedBox(height: 24),
            _buildPrivacySecurityStack(s),
            const SizedBox(height: 24),
            _buildHelpSupportStack(s),
            const SizedBox(height: 32),
            _buildFooterInfo(s),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildGeneralSettingsStack(AppStrings s) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 12.0, right: 4.0),
          child: Text(
            s.generalSettings,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Theme.of(context).colorScheme.onSurface,
            ),
          ),
        ),
        Container(
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.03),
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSwitchCategory(
                title: s.notifications,
                hint: s.notifHint,
                iconPath: 'notification.svg',
                iconBgColor: const Color(0xFFDBEAFE),
                value: isNotificationOn,
                onChanged: (val) => setState(() => isNotificationOn = val),
              ),
              _buildDivider(),
              _buildSwitchCategory(
                title: s.darkMode,
                hint: s.darkModeHint,
                iconPath: 'darkmode.svg',
                iconBgColor: const Color(0xFFF1F5F9),
                value: isDarkModeOn,
                onChanged: (val) {
                  setState(() => isDarkModeOn = val);
                  AppTheme.themeNotifier.value =
                      val ? ThemeMode.dark : ThemeMode.light;
                },
              ),
              _buildDivider(),
              _buildArrowCategory(
                title: s.language,
                hint: context.watch<LocaleProvider>().isArabic ? s.arabic : s.english,
                iconPath: 'language.svg',
                iconBgColor: const Color(0xFFE0E7FF),
                onTap: () => _showLanguageDialog(context),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildPrivacySecurityStack(AppStrings s) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 12.0, right: 4.0),
          child: Text(
            s.privacy,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Theme.of(context).colorScheme.onSurface,
            ),
          ),
        ),
        Container(
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.03),
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildArrowCategory(
                title: s.privacyPolicy,
                hint: null,
                iconPath: 'privacy.svg',
                iconBgColor: const Color(0xFFF3E8FF),
              ),
              _buildDivider(),
              _buildArrowCategory(
                title: s.terms,
                hint: null,
                iconPath: 'conditions.svg',
                iconBgColor: const Color(0xFFDBEAFE),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildHelpSupportStack(AppStrings s) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 12.0, right: 4.0),
          child: Text(
            s.helpSupport,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Theme.of(context).colorScheme.onSurface,
            ),
          ),
        ),
        Container(
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.03),
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildArrowCategory(
                title: s.helpCenter,
                hint: null,
                iconPath: 'Question.svg',
                iconBgColor: const Color(0xFFFEF3C6),
              ),
              _buildDivider(),
              _buildArrowCategory(
                title: s.contactUs,
                hint: null,
                iconData: CupertinoIcons.phone_solid,
                iconColor: const Color(0xFF00A63E),
                iconBgColor: const Color(0xFFDCFCE7),
                isBuiltInIcon: true,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildFooterInfo(AppStrings s) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.03),
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                s.appVersion,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '1.0.0',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                s.allRights,
                style: TextStyle(
                  fontSize: 12,
                  color: Theme.of(
                    context,
                  ).colorScheme.onSurfaceVariant.withValues(alpha: 0.8),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSwitchCategory({
    required String title,
    String? hint,
    required String iconPath,
    required Color iconBgColor,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Row(
      children: [
        _buildIconBox(iconPath: iconPath, bgColor: iconBgColor),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: Theme.of(context).colorScheme.onSurface,
                ),
              ),
              if (hint != null) ...[
                const SizedBox(height: 4),
                Text(
                  hint,
                  style: TextStyle(
                    fontSize: 13,
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ],
          ),
        ),
        Switch(
          value: value,
          onChanged: onChanged,
          activeColor: Colors.white,
          activeTrackColor: AppTheme.primaryColor,
          inactiveThumbColor: Colors.white,
          inactiveTrackColor: Theme.of(context).colorScheme.outline,
          trackOutlineColor: WidgetStateProperty.all(Colors.transparent),
        ),
      ],
    );
  }

  Widget _buildArrowCategory({
    required String title,
    String? hint,
    String? iconPath,
    IconData? iconData,
    Color? iconColor,
    required Color iconBgColor,
    bool isBuiltInIcon = false,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap ?? () {},
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4.0),
        child: Row(
          children: [
            if (isBuiltInIcon)
              _buildIconBoxBuiltIn(
                iconData: iconData!,
                color: iconColor!,
                bgColor: iconBgColor,
              )
            else
              _buildIconBox(iconPath: iconPath!, bgColor: iconBgColor),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                  if (hint != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      hint,
                      style: TextStyle(
                        fontSize: 13,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const AppImage(image: 'arroww.svg', width: 16, height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildIconBox({required String iconPath, required Color bgColor}) {
    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Center(child: AppImage(image: iconPath, width: 22, height: 22)),
    );
  }

  Widget _buildIconBoxBuiltIn({
    required IconData iconData,
    required Color color,
    required Color bgColor,
  }) {
    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Center(child: Icon(iconData, color: color, size: 22)),
    );
  }

  Widget _buildDivider() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12.0),
      child: Divider(
        color: Theme.of(context).colorScheme.outline,
        height: 1,
        thickness: 1,
      ),
    );
  }

  void _showLanguageDialog(BuildContext context) {
    final locale = context.read<LocaleProvider>();
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(appStrings(locale.isArabic).chooseLanguage),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _langOption(context, 'العربية', '🇸🇦', 'ar', locale),
            const SizedBox(height: 12),
            _langOption(context, 'English', '🇺🇸', 'en', locale),
          ],
        ),
      ),
    );
  }

  Widget _langOption(BuildContext context, String label, String flag, String code, LocaleProvider locale) {
    final isSelected = locale.locale.languageCode == code;
    return InkWell(
      onTap: () {
        locale.setLocale(code);
        Navigator.pop(context);
      },
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primaryColor.withValues(alpha: 0.1) : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? AppTheme.primaryColor : Theme.of(context).colorScheme.outline,
          ),
        ),
        child: Row(
          children: [
            Text(flag, style: const TextStyle(fontSize: 24)),
            const SizedBox(width: 12),
            Text(label, style: TextStyle(fontSize: 16, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal, color: isSelected ? AppTheme.primaryColor : Theme.of(context).colorScheme.onSurface)),
            const Spacer(),
            if (isSelected) const Icon(Icons.check_circle, color: AppTheme.primaryColor),
          ],
        ),
      ),
    );
  }
}

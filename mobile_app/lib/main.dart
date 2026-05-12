import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:graduation_project/views/splash_screen.dart';
import 'package:provider/provider.dart';
import 'package:graduation_project/logic/providers/auth_provider.dart';
import 'package:graduation_project/logic/providers/orders_provider.dart';
import 'package:graduation_project/logic/providers/ai_provider.dart';
import 'package:graduation_project/logic/providers/notification_provider.dart';

import 'dart:io';

class MyHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback = (X509Certificate cert, String host, int port) => true;
  }
}

void main() {
  HttpOverrides.global = MyHttpOverrides();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => OrdersProvider()),
        ChangeNotifierProvider(create: (_) => AiProvider()),
        ChangeNotifierProvider(create: (_) => LocaleProvider()),
        ChangeNotifierProvider(create: (_) => NotificationProvider()),
      ],
      child: Consumer<LocaleProvider>(
        builder: (_, localeProvider, __) {
          return ValueListenableBuilder<ThemeMode>(
            valueListenable: AppTheme.themeNotifier,
            builder: (_, ThemeMode currentMode, __) {
              return MaterialApp(
                locale: localeProvider.locale,
                supportedLocales: const [Locale('ar'), Locale('en')],
                localizationsDelegates: const [
                  GlobalMaterialLocalizations.delegate,
                  GlobalWidgetsLocalizations.delegate,
                  GlobalCupertinoLocalizations.delegate,
                ],
                debugShowCheckedModeBanner: false,
                home: const SplashScreen(),
                theme: AppTheme.lightTheme,
                darkTheme: AppTheme.darkTheme,
                themeMode: currentMode,
                builder: (context, child) {
                  // Apply locale-aware font and text direction
                  final font = localeProvider.isArabic
                      ? AppTheme.arabicFont
                      : AppTheme.englishFont;
                  return Directionality(
                    textDirection: localeProvider.isArabic
                        ? TextDirection.rtl
                        : TextDirection.ltr,
                    child: Theme(
                      data: Theme.of(context).copyWith(
                        textTheme: Theme.of(context).textTheme.apply(fontFamily: font),
                        primaryTextTheme: Theme.of(context).primaryTextTheme.apply(fontFamily: font),
                      ),
                      child: child!,
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}

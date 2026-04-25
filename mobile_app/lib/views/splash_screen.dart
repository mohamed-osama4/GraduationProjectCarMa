import 'package:flutter/material.dart';
import 'package:graduation_project/core/comeponents/app_image.dart';
import 'package:graduation_project/views/create_account.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 5), () {
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const CreateAccount()),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff1C398E),
      body: const Center(
        child: AppImage(
          image: 'servishero_loading.json',
          width: 250,
          height: 250,
        ),
      ),
    );
  }
}

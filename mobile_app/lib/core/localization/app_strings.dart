/// Simple string localization. Access via: AppStrings.of(context).login
class AppStrings {
  final bool isArabic;
  const AppStrings._(this.isArabic);

  static AppStrings of(context) {
    // Will be called with locale from LocaleProvider
    return const AppStrings._(true); // default — overridden in widgets
  }

  // ─── Auth ─────────────────────────────────────────────────────
  String get login          => isArabic ? 'تسجيل الدخول'         : 'Login';
  String get register       => isArabic ? 'إنشاء حساب'           : 'Create Account';
  String get logout         => isArabic ? 'تسجيل الخروج'         : 'Logout';
  String get email          => isArabic ? 'البريد الإلكتروني'    : 'Email';
  String get password       => isArabic ? 'كلمة المرور'           : 'Password';
  String get confirmPass    => isArabic ? 'تأكيد كلمة المرور'    : 'Confirm Password';
  String get fullName       => isArabic ? 'الاسم الكامل'         : 'Full Name';
  String get phone          => isArabic ? 'رقم الهاتف'           : 'Phone Number';
  String get forgotPassword => isArabic ? 'نسيت كلمة السر؟'      : 'Forgot Password?';
  String get haveAccount    => isArabic ? 'لديك حساب بالفعل؟ '   : 'Already have an account? ';
  String get noAccount      => isArabic ? 'ليس لديك حساب؟ '      : 'Don\'t have an account? ';
  String get welcomeBack    => isArabic ? 'مرحباً بك مجدداً!'    : 'Welcome Back!';
  String get loginSubtitle  => isArabic ? 'يرجى إدخال بياناتك'   : 'Please enter your details';

  // ── Home ─────────────────────────────────────────────────────
  String get hello          => isArabic ? 'مرحباً'                : 'Hello';
  String get howHelp        => isArabic ? 'كيف يمكننا مساعدتك اليوم؟' : 'How can we help you today?';
  String get emergency      => isArabic ? 'صيانة طارئة'           : 'Emergency Service';
  String get towing         => isArabic ? 'طلب ونش'               : 'Towing';
  String get mainServices   => isArabic ? 'الخدمات الأساسية'      : 'Main Services';
  String get viewAll        => isArabic ? 'عرض الكل'              : 'View All';
  String get all            => isArabic ? 'الكل'                  : 'All';
  String get battery        => isArabic ? 'البطارية'              : 'Battery';
  String get oilChange      => isArabic ? 'تغيير الزيت'           : 'Oil Change';
  String get tires          => isArabic ? 'الإطارات'              : 'Tires';
  String get carWash        => isArabic ? 'غسيل السيارة'          : 'Car Wash';
  String get menu           => isArabic ? 'القائمة'               : 'Menu';
  String get services       => isArabic ? 'الخدمات'               : 'Services';

  // Subtitles for services
  String get batterySub     => isArabic ? 'شحن / تغيير / شراء بطارية جديدة' : 'Charge / Replace / Buy New Battery';
  String get oilChangeSub   => isArabic ? 'تغيير الزيت والفلتر - صيانة دورية' : 'Oil & Filter Change - Regular Maintenance';
  String get tiresSub       => isArabic ? 'نفخ / تغيير / فحص الإطارات' : 'Inflate / Replace / Inspect Tires';
  String get carWashSub     => isArabic ? 'تنظيف شامل من الداخل والخارج' : 'Comprehensive Interior & Exterior Cleaning';
  String get emergencySub   => isArabic ? 'عطل مفاجئ؟ نصل إليك في أسرع وقت' : 'Sudden Breakdown? We reach you ASAP';
  String get towingSub      => isArabic ? 'سحب السيارة من وإلى أي مكان' : 'Tow your car to and from anywhere';

  // Prices
  String get priceEGP       => isArabic ? 'جنيه' : 'EGP';
  String get priceStarts    => isArabic ? 'يبدأ من' : 'Starts from';

  // ─── Orders ───────────────────────────────────────────────────
  String get orderPending      => isArabic ? 'طلبك قيد المراجعة من الإدارة' : 'Your order is being reviewed';
  String get orderPendingSub   => isArabic ? 'سنقوم بالرد عليك في أقرب وقت' : 'We will get back to you soon';
  String get orderOnTheWay     => isArabic ? 'تم تعيين فني صيانة'   : 'Technician Assigned';
  String get orderOnTheWaySub  => isArabic ? 'الفني في الطريق إليك الآن' : 'Technician is on the way';
  String get orderUnderProcess => isArabic ? 'الفني يعمل على سيارتك' : 'Technician working on your car';
  String get orderUnderProcessSub => isArabic ? 'جارٍ إصلاح السيارة الآن' : 'Repair in progress';
  String get orderCompleted    => isArabic ? 'طلب مكتمل'             : 'Order Completed';
  String get orderCompletedSub => isArabic ? 'تم الانتهاء من الصيانة بنجاح' : 'Service completed successfully';
  String get viewDetails       => isArabic ? 'عرض التفاصيل'          : 'View Details';
  String get orderNow          => isArabic ? 'اطلب الآن'             : 'Order Now';
  // Legacy aliases
  String get orderInProgress    => orderOnTheWay;
  String get orderInProgressSub => orderOnTheWaySub;

  // ─── Drawer ───────────────────────────────────────────────────
  String get myOrders     => isArabic ? 'طلباتي'           : 'My Orders';
  String get myVehicles   => isArabic ? 'سياراتي'          : 'My Vehicles';
  String get help         => isArabic ? 'المساعدة'         : 'Help';
  String get logoutConfirm => isArabic ? 'تسجيل الخروج'   : 'Logout';

  // ─── Profile ──────────────────────────────────────────────────
  String get profile        => isArabic ? 'الملف الشخصي'          : 'Profile';
  String get personalInfo   => isArabic ? 'المعلومات الشخصية'     : 'Personal Information';
  String get stats          => isArabic ? 'الإحصائيات'            : 'Statistics';
  String get rating         => isArabic ? 'التقييم'               : 'Rating';
  String get orders         => isArabic ? 'الطلبات'               : 'Orders';
  String get editProfile    => isArabic ? 'تعديل البيانات'        : 'Edit Profile';
  String get saveChanges    => isArabic ? 'حفظ التعديلات'         : 'Save Changes';
  String get memberSince    => isArabic ? 'عضو منذ'               : 'Member since';
  String get address        => isArabic ? 'العنوان'               : 'Address';
  String get vehicle        => isArabic ? 'المركبة'               : 'Vehicle';

  // ─── Settings ─────────────────────────────────────────────────
  String get settings       => isArabic ? 'الاعدادات'             : 'Settings';
  String get generalSettings => isArabic ? 'الإعدادات العامة'     : 'General Settings';
  String get notifications  => isArabic ? 'الإشعارات'             : 'Notifications';
  String get notifHint      => isArabic ? 'تلقي إشعارات الطلبات'  : 'Receive order notifications';
  String get darkMode       => isArabic ? 'الوضع الليلي'          : 'Dark Mode';
  String get darkModeHint   => isArabic ? 'مظهر داكن للتطبيق'    : 'Dark app appearance';
  String get language       => isArabic ? 'اللغة'                 : 'Language';
  String get privacy        => isArabic ? 'الخصوصية والأمان'      : 'Privacy & Security';
  String get privacyPolicy  => isArabic ? 'سياسة الخصوصية'       : 'Privacy Policy';
  String get terms          => isArabic ? 'الشروط والاحكام'       : 'Terms & Conditions';
  String get helpSupport    => isArabic ? 'الدعم والمساعدة'       : 'Help & Support';
  String get helpCenter     => isArabic ? 'مركز المساعدة'         : 'Help Center';
  String get contactUs      => isArabic ? 'اتصل بنا'              : 'Contact Us';
  String get appVersion     => isArabic ? 'اصدار التطبيق'         : 'App Version';
  String get allRights      => isArabic ? '© 2024 خدمة صيانة السيارات. جميع الحقوق محفوظة.' : '© 2024 Car Maintenance Service. All rights reserved.';
  String get chooseLanguage => isArabic ? 'اختر اللغة'            : 'Choose Language';
  String get arabic         => isArabic ? 'العربية'               : 'Arabic';
  String get english        => isArabic ? 'الإنجليزية'            : 'English';
}

/// Extension to get localized strings easily from any widget
extension AppStringsExt on bool {
  AppStrings get s => AppStrings._(this);
}

/// Create from isArabic flag
AppStrings appStrings(bool isArabic) => AppStrings._(isArabic);

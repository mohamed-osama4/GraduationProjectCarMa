import 'dart:async';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:maplibre_gl/maplibre_gl.dart';

// ─── AWS Location Service config ──────────────────────────────────────────────
const _awsApiKey =
    'v1.public.eyJqdGkiOiI3ZTVkZGNiYi1lODFiLTRkMWMtYWFkMS01ZGZiNjFkODEzZDIifRUUDLz4RETMrN5-nHz8DmndDcm_3eTCfbPLlN-zz44M_fYW8fRa2VuDSED4FmTG0vy_REhuZg_u1EQpMTn1ZInAT_Xno8dcrBTuzMVRG8ptIQb8tJuLfPWRsLtbx89JpipKO4PlE8GZZjAm8jeD8DP0ZVp7M6JxHoCIWlNJ0ymt7zxG53s0i_5oCo-917iA3vxtmC5g7dLHJ6c6vG6ozPKUczun0ArGEwjNgjOyp1M9dou0muQFfqQcwpfxn-ysjI3bAZOMbAjdq7i2qkkhzERp04ggnHRkyMCQQ_HvnoX36SZnIdahiQfXpCHsXM4h_q5WcN-VWvWa4kl1YY17PoI.ZWU0ZWIzMTktMWRhNi00Mzg0LTllMzYtNzlmMDU3MjRmYTkx';
const _awsRegion  = 'us-east-1';
const _awsMapName = 'CarmaMaps';
const _styleUrl =
    'https://maps.geo.$_awsRegion.amazonaws.com/maps/v0/maps/$_awsMapName/style-descriptor?key=$_awsApiKey';

// ─── Default: Cairo, Egypt ─────────────────────────────────────────────────────
const _defaultLat  = 30.0444;
const _defaultLng  = 31.2357;
const _defaultZoom = 14.0;

/// Full-screen map picker backed by AWS Location Service.
/// Returns a [String] address (or null if cancelled) via [Navigator.pop].
class AwsMapPicker extends StatefulWidget {
  const AwsMapPicker({super.key});

  @override
  State<AwsMapPicker> createState() => _AwsMapPickerState();
}

class _AwsMapPickerState extends State<AwsMapPicker> {
  MapLibreMapController? _mapController;

  LatLng _center = const LatLng(_defaultLat, _defaultLng);
  String _address = '';
  bool _loadingAddress = false;
  bool _loadingLocation = true;

  Timer? _debounce;

  @override
  void initState() {
    super.initState();
    _fetchCurrentLocation();
  }

  @override
  void dispose() {
    _debounce?.cancel();
    super.dispose();
  }

  // ── Get GPS location ───────────────────────────────────────────────────────
  Future<void> _fetchCurrentLocation() async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        setState(() => _loadingLocation = false);
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          setState(() => _loadingLocation = false);
          return;
        }
      }
      if (permission == LocationPermission.deniedForever) {
        setState(() => _loadingLocation = false);
        return;
      }

      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
      );

      final latlng = LatLng(pos.latitude, pos.longitude);
      setState(() {
        _center = latlng;
        _loadingLocation = false;
      });

      _mapController?.animateCamera(
        CameraUpdate.newLatLngZoom(latlng, _defaultZoom),
      );

      await _reverseGeocode(latlng);
    } catch (_) {
      setState(() => _loadingLocation = false);
    }
  }

  // ── Reverse geocode ────────────────────────────────────────────────────────
  Future<void> _reverseGeocode(LatLng latlng) async {
    setState(() => _loadingAddress = true);
    try {
      final placemarks = await placemarkFromCoordinates(
        latlng.latitude,
        latlng.longitude,
      );
      if (placemarks.isNotEmpty && mounted) {
        final p = placemarks.first;
        final parts = [
          p.street,
          p.subLocality,
          p.locality,
          p.subAdministrativeArea,
        ].where((e) => e != null && e.isNotEmpty).toList();

        setState(() => _address = parts.join('، '));
      }
    } catch (_) {
      setState(() => _address = '');
    } finally {
      if (mounted) setState(() => _loadingAddress = false);
    }
  }

  // ── Map camera idle ────────────────────────────────────────────────────────
  void _onCameraIdle() {
    if (_mapController == null) return;
    final pos = _mapController!.cameraPosition;
    if (pos == null) return;

    setState(() => _center = pos.target);

    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 600), () {
      _reverseGeocode(pos.target);
    });
  }

  void _onMapCreated(MapLibreMapController controller) {
    _mapController = controller;
  }

  // ── Confirm ────────────────────────────────────────────────────────────────
  void _confirm() {
    final result = _address.isNotEmpty
        ? _address
        : '${_center.latitude.toStringAsFixed(5)}, ${_center.longitude.toStringAsFixed(5)}';
    Navigator.pop(context, result);
  }

  // ── Build ──────────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // ── Map ────────────────────────────────────────────────────────────
          MapLibreMap(
            styleString: _styleUrl,
            initialCameraPosition: CameraPosition(
              target: _center,
              zoom: _defaultZoom,
            ),
            onMapCreated: _onMapCreated,
            onCameraIdle: _onCameraIdle,
            myLocationEnabled: true,
            myLocationTrackingMode: MyLocationTrackingMode.none,
            myLocationRenderMode: MyLocationRenderMode.compass,
          ),

          // ── Centre pin ─────────────────────────────────────────────────────
          const Center(
            child: Padding(
              padding: EdgeInsets.only(bottom: 40),
              child: _MapPin(),
            ),
          ),

          // ── Top AppBar ─────────────────────────────────────────────────────
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Row(
                children: [
                  _CircleBtn(
                    icon: Icons.arrow_back_rounded,
                    onTap: () => Navigator.pop(context),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(28),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.12),
                            blurRadius: 10,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.search_rounded,
                              color: Color(0xFF2563EB), size: 20),
                          const SizedBox(width: 10),
                          Text(
                            'حرّك الخريطة لتحديد موقعك',
                            style: TextStyle(
                              color: Colors.grey.shade600,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  _CircleBtn(
                    icon: Icons.my_location_rounded,
                    onTap: _fetchCurrentLocation,
                    loading: _loadingLocation,
                  ),
                ],
              ),
            ),
          ),

          // ── Bottom card ────────────────────────────────────────────────────
          Align(
            alignment: Alignment.bottomCenter,
            child: SafeArea(
              child: Container(
                margin: const EdgeInsets.all(16),
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.12),
                      blurRadius: 20,
                      offset: const Offset(0, -4),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Label
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: const Color(0xFF2563EB).withValues(alpha: 0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.location_on_rounded,
                              color: Color(0xFF2563EB), size: 18),
                        ),
                        const SizedBox(width: 10),
                        const Text(
                          'الموقع المحدد',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            color: Color(0xFF1E293B),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    // Address
                    _loadingAddress
                        ? const Center(
                            child: SizedBox(
                              height: 24,
                              width: 24,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Color(0xFF2563EB),
                              ),
                            ),
                          )
                        : Text(
                            _address.isNotEmpty
                                ? _address
                                : 'جاري تحديد العنوان...',
                            style: TextStyle(
                              color: _address.isNotEmpty
                                  ? const Color(0xFF1E293B)
                                  : Colors.grey,
                              fontSize: 14,
                              height: 1.4,
                            ),
                          ),

                    const SizedBox(height: 16),

                    // Confirm button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: _loadingAddress ? null : _confirm,
                        icon: const Icon(Icons.check_circle_outline_rounded),
                        label: const Text('تأكيد الموقع'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2563EB),
                          foregroundColor: Colors.white,
                          padding:
                              const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                          textStyle: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                          ),
                        ),
                      ),
                    ),
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

// ─── Map pin widget ────────────────────────────────────────────────────────────
class _MapPin extends StatefulWidget {
  const _MapPin();

  @override
  State<_MapPin> createState() => _MapPinState();
}

class _MapPinState extends State<_MapPin>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _bounce;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    )..repeat(reverse: true);
    _bounce = Tween<double>(begin: 0, end: -8).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _bounce,
      builder: (_, child) => Transform.translate(
        offset: Offset(0, _bounce.value),
        child: child,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: const Color(0xFF2563EB),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF2563EB).withValues(alpha: 0.4),
                  blurRadius: 12,
                  spreadRadius: 2,
                ),
              ],
            ),
            child:
                const Icon(Icons.location_on, color: Colors.white, size: 26),
          ),
          CustomPaint(
            size: const Size(16, 8),
            painter: _ShadowPainter(),
          ),
        ],
      ),
    );
  }
}

class _ShadowPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black.withValues(alpha: 0.18)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);
    canvas.drawOval(
      Rect.fromCenter(
          center: Offset(size.width / 2, size.height / 2),
          width: size.width,
          height: size.height),
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// ─── Circle icon button ────────────────────────────────────────────────────────
class _CircleBtn extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  final bool loading;

  const _CircleBtn({
    required this.icon,
    required this.onTap,
    this.loading = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.12),
              blurRadius: 10,
            ),
          ],
        ),
        child: loading
            ? const Padding(
                padding: EdgeInsets.all(12),
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Color(0xFF2563EB),
                ),
              )
            : Icon(icon, color: const Color(0xFF2563EB), size: 22),
      ),
    );
  }
}

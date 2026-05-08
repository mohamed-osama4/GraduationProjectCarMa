import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:graduation_project/logic/providers/ai_provider.dart';
import 'package:graduation_project/views/services/towing_services.dart';
import 'package:graduation_project/views/services/carWash_services.dart';
import 'package:graduation_project/views/services/emergency_services.dart';

class AiChatPage extends StatefulWidget {
  const AiChatPage({super.key});

  @override
  State<AiChatPage> createState() => _AiChatPageState();
}

class _AiChatPageState extends State<AiChatPage> with TickerProviderStateMixin {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  static const Color _bg = Color(0xFF0A0A1A);
  static const Color _cardBg = Color(0xFF13132B);
  static const Color _inputBg = Color(0xFF1A1A35);
  static const Color _purplePrimary = Color(0xFF7C3AED);
  static const Color _purpleLight = Color(0xFFA78BFA);
  static const Color _purpleGlow = Color(0xFF5B21B6);

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _send() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    _controller.clear();
    context.read<AiProvider>().sendMessage(text);
    _scrollToBottom();
  }

  // ── Parse service buttons from bot response ──────────────────────────────
  bool _hasWinch(String text) => text.contains('[WINCH_BUTTON]');
  bool _hasWash(String text) => text.contains('[WASH_BUTTON]');
  bool _hasMaintenance(String text) => text.contains('[MAINTENANCE_BUTTON]');

  String _cleanText(String text) => text
      .replaceAll('[WINCH_BUTTON]', '')
      .replaceAll('[WASH_BUTTON]', '')
      .replaceAll('[MAINTENANCE_BUTTON]', '')
      .trim();

  // ── Navigate to service page ─────────────────────────────────────────────
  void _goToService(Widget page) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => page));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      appBar: AppBar(
        backgroundColor: _bg,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white70, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(
                  colors: [_purplePrimary, _purpleLight],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: [
                  BoxShadow(color: _purpleGlow.withValues(alpha: 0.5), blurRadius: 8)
                ],
              ),
              child: const Icon(Icons.auto_awesome, color: Colors.white, size: 16),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('CarMa AI', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
                Text('مساعدك الذكي', style: TextStyle(color: Colors.white54, fontSize: 11)),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: Consumer<AiProvider>(
              builder: (context, ai, _) {
                // Auto-scroll when new messages arrive
                if (ai.messages.isNotEmpty) _scrollToBottom();

                if (ai.messages.isEmpty) {
                  return _buildEmptyState();
                }

                return ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  itemCount: ai.messages.length + (ai.isLoading ? 1 : 0),
                  itemBuilder: (context, index) {
                    if (index == ai.messages.length) {
                      return _buildTypingIndicator();
                    }
                    final msg = ai.messages[index];
                    final isUser = msg['sender'] == 'user';
                    final text = msg['text'] ?? '';
                    return isUser
                        ? _buildUserBubble(text)
                        : _buildBotBubble(text);
                  },
                );
              },
            ),
          ),
          _buildInputBar(),
        ],
      ),
    );
  }

  // ── Empty State ───────────────────────────────────────────────────────────
  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          ScaleTransition(
            scale: _pulseAnimation,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    _purpleLight.withValues(alpha: 0.8),
                    _purplePrimary.withValues(alpha: 0.6),
                    _purpleGlow.withValues(alpha: 0.3),
                    Colors.transparent,
                  ],
                  stops: const [0.0, 0.4, 0.7, 1.0],
                ),
                boxShadow: [
                  BoxShadow(
                    color: _purplePrimary.withValues(alpha: 0.4),
                    blurRadius: 40,
                    spreadRadius: 10,
                  ),
                ],
              ),
              child: const Icon(Icons.auto_awesome, color: Colors.white, size: 48),
            ),
          ),
          const SizedBox(height: 32),
          const Text(
            'اسأل أي حاجة',
            style: TextStyle(
              color: Colors.white,
              fontSize: 26,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'هساعدك في أي مشكلة مع عربيتك',
            style: TextStyle(color: Colors.white54, fontSize: 14),
          ),
          const SizedBox(height: 40),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            alignment: WrapAlignment.center,
            children: [
              _buildSuggestionChip('عندي إطار واقف'),
              _buildSuggestionChip('عاوز أغسل عربيتي'),
              _buildSuggestionChip('فيه صوت غريب في الموتور'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSuggestionChip(String text) {
    return GestureDetector(
      onTap: () {
        _controller.text = text;
        _send();
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: _cardBg,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: _purplePrimary.withValues(alpha: 0.4)),
        ),
        child: Text(text, style: const TextStyle(color: _purpleLight, fontSize: 13)),
      ),
    );
  }

  // ── User Bubble ───────────────────────────────────────────────────────────
  Widget _buildUserBubble(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Flexible(
            child: Container(
              constraints: BoxConstraints(
                maxWidth: MediaQuery.of(context).size.width * 0.72,
              ),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [_purplePrimary, _purpleGlow],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(18),
                  topRight: Radius.circular(18),
                  bottomLeft: Radius.circular(18),
                  bottomRight: Radius.circular(4),
                ),
                boxShadow: [
                  BoxShadow(color: _purplePrimary.withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 3)),
                ],
              ),
              child: Text(
                text,
                textDirection: TextDirection.rtl,
                style: const TextStyle(color: Colors.white, fontSize: 14, height: 1.5),
              ),
            ),
          ),
          const SizedBox(width: 8),
          const CircleAvatar(
            radius: 14,
            backgroundColor: _purplePrimary,
            child: Icon(Icons.person, color: Colors.white, size: 16),
          ),
        ],
      ),
    );
  }

  // ── Bot Bubble ────────────────────────────────────────────────────────────
  Widget _buildBotBubble(String rawText) {
    final cleanText = _cleanText(rawText);
    final showWinch = _hasWinch(rawText);
    final showWash = _hasWash(rawText);
    final showMaintenance = _hasMaintenance(rawText);
    final hasButtons = showWinch || showWash || showMaintenance;

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const LinearGradient(
                colors: [_purplePrimary, _purpleLight],
              ),
              boxShadow: [BoxShadow(color: _purpleGlow.withValues(alpha: 0.4), blurRadius: 6)],
            ),
            child: const Icon(Icons.auto_awesome, color: Colors.white, size: 14),
          ),
          const SizedBox(width: 8),
          Flexible(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  constraints: BoxConstraints(
                    maxWidth: MediaQuery.of(context).size.width * 0.72,
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: _cardBg,
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(4),
                      topRight: Radius.circular(18),
                      bottomLeft: Radius.circular(18),
                      bottomRight: Radius.circular(18),
                    ),
                    border: Border.all(color: _purplePrimary.withValues(alpha: 0.2)),
                  ),
                  child: Text(
                    cleanText,
                    textDirection: TextDirection.rtl,
                    style: const TextStyle(color: Colors.white, fontSize: 14, height: 1.5),
                  ),
                ),
                if (hasButtons) ...[
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      if (showWinch)
                        _buildServiceButton(
                          icon: Icons.local_shipping_rounded,
                          label: '🚛 اطلب ونش',
                          color: const Color(0xFFEF4444),
                          onTap: () => _goToService(const TowingServices()),
                        ),
                      if (showWash)
                        _buildServiceButton(
                          icon: Icons.water_drop_rounded,
                          label: '💧 اطلب غسيل',
                          color: const Color(0xFF3B82F6),
                          onTap: () => _goToService(const CarWashServices()),
                        ),
                      if (showMaintenance)
                        _buildServiceButton(
                          icon: Icons.build_rounded,
                          label: '🔧 اطلب فني',
                          color: const Color(0xFF10B981),
                          onTap: () => _goToService(const EmergencyServices()),
                        ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildServiceButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withValues(alpha: 0.5)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: color, size: 16),
            const SizedBox(width: 6),
            Text(label, style: TextStyle(color: color, fontSize: 13, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }

  // ── Typing Indicator ──────────────────────────────────────────────────────
  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(colors: [_purplePrimary, _purpleLight]),
            ),
            child: const Icon(Icons.auto_awesome, color: Colors.white, size: 14),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: _cardBg,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: _purplePrimary.withValues(alpha: 0.2)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(3, (i) => _buildDot(i)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDot(int index) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.4, end: 1.0),
      duration: Duration(milliseconds: 600 + index * 200),
      curve: Curves.easeInOut,
      builder: (_, value, __) => Container(
        margin: const EdgeInsets.symmetric(horizontal: 3),
        width: 7,
        height: 7,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: _purpleLight.withValues(alpha: value),
        ),
      ),
    );
  }

  // ── Input Bar ─────────────────────────────────────────────────────────────
  Widget _buildInputBar() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      decoration: BoxDecoration(
        color: _bg,
        border: Border(top: BorderSide(color: _purplePrimary.withValues(alpha: 0.15))),
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: _inputBg,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: _purplePrimary.withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      textDirection: TextDirection.rtl,
                      style: const TextStyle(color: Colors.white, fontSize: 14),
                      decoration: const InputDecoration(
                        hintText: 'اسألني عن عربيتك...',
                        hintStyle: TextStyle(color: Colors.white38, fontSize: 14),
                        border: InputBorder.none,
                        isDense: true,
                        contentPadding: EdgeInsets.symmetric(vertical: 12),
                      ),
                      onSubmitted: (_) => _send(),
                    ),
                  ),
                  const SizedBox(width: 8),
                ],
              ),
            ),
          ),
          const SizedBox(width: 10),
          Consumer<AiProvider>(
            builder: (_, ai, __) => GestureDetector(
              onTap: ai.isLoading ? null : _send,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: ai.isLoading
                      ? const LinearGradient(colors: [Colors.grey, Colors.grey])
                      : const LinearGradient(
                          colors: [_purplePrimary, _purpleLight],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                  boxShadow: ai.isLoading
                      ? []
                      : [BoxShadow(color: _purplePrimary.withValues(alpha: 0.5), blurRadius: 12)],
                ),
                child: ai.isLoading
                    ? const Padding(
                        padding: EdgeInsets.all(12),
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                      )
                    : const Icon(Icons.send_rounded, color: Colors.white, size: 22),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

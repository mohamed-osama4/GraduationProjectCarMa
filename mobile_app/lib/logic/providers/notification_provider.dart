import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:signalr_netcore/signalr_client.dart';
import 'package:graduation_project/core/network/api_client.dart';
import 'package:graduation_project/data/models/notification_model.dart';

class NotificationProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();

  List<AppNotification> _notifications = [];
  int _unreadCount = 0;
  bool _isLoading = false;
  String? _errorMessage;
  bool _hasMore = true;
  int _currentPage = 1;
  static const int _pageSize = 20;

  HubConnection? _hubConnection;
  bool _isConnected = false;

  List<AppNotification> get notifications => _notifications;
  int get unreadCount => _unreadCount;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get hasMore => _hasMore;
  bool get isConnected => _isConnected;

  // ── Initialization ───────────────────────────────────────────
  Future<void> init() async {
    await Future.wait([
      fetchNotifications(refresh: true),
      _connectSignalR(),
    ]);
  }

  // ── REST: Fetch Notifications ────────────────────────────────
  Future<void> fetchNotifications({bool refresh = false}) async {
    if (_isLoading) return;

    if (refresh) {
      _currentPage = 1;
      _hasMore = true;
      _notifications = [];
    }

    if (!_hasMore) return;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiClient.dio.get(
        '/new-notifications',
        queryParameters: {
          'page': _currentPage,
          'pageSize': _pageSize,
        },
      );

      if (response.statusCode == 200) {
        final paged = PagedNotificationsResponse.fromJson(
          response.data as Map<String, dynamic>,
        );

        if (refresh) {
          _notifications = paged.items;
        } else {
          _notifications.addAll(paged.items);
        }

        _unreadCount = paged.unreadCount;
        _hasMore = _currentPage < paged.totalPages;
        _currentPage++;
      }
    } catch (e) {
      _errorMessage = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  // ── REST: Mark One As Read ───────────────────────────────────
  Future<void> markAsRead(int id) async {
    // Optimistic update
    final idx = _notifications.indexWhere((n) => n.id == id);
    if (idx != -1 && !_notifications[idx].isRead) {
      _notifications[idx].isRead = true;
      _unreadCount = (_unreadCount - 1).clamp(0, 9999);
      notifyListeners();
    }

    try {
      await _apiClient.dio.patch('/new-notifications/$id/read');
    } catch (_) {
      // Revert optimistic update on failure
      if (idx != -1) {
        _notifications[idx].isRead = false;
        _unreadCount++;
        notifyListeners();
      }
    }
  }

  // ── REST: Mark All As Read ───────────────────────────────────
  Future<void> markAllAsRead() async {
    // Optimistic update
    for (final n in _notifications) {
      n.isRead = true;
    }
    final prevCount = _unreadCount;
    _unreadCount = 0;
    notifyListeners();

    try {
      await _apiClient.dio.patch('/new-notifications/read-all');
    } catch (_) {
      // Revert on failure
      _unreadCount = prevCount;
      await fetchNotifications(refresh: true);
    }
  }

  // ── REST: Delete Notification ────────────────────────────────
  Future<void> deleteNotification(int id) async {
    // Optimistic remove
    final removed = _notifications.firstWhere(
      (n) => n.id == id,
      orElse: () => AppNotification(
        id: -1, type: '', severity: '', title: '', message: '',
        isRead: true, createdAt: DateTime.now(),
      ),
    );
    _notifications.removeWhere((n) => n.id == id);
    if (!removed.isRead && removed.id != -1) {
      _unreadCount = (_unreadCount - 1).clamp(0, 9999);
    }
    notifyListeners();

    try {
      await _apiClient.dio.delete('/new-notifications/$id');
    } catch (_) {
      // Revert on failure
      if (removed.id != -1) {
        _notifications.insert(0, removed);
        if (!removed.isRead) _unreadCount++;
        notifyListeners();
      }
    }
  }

  // ── REST: Clear All (delete from backend) ────────────────────
  Future<void> clearAll() async {
    if (_notifications.isEmpty) return;
    final toDelete = List<AppNotification>.from(_notifications);

    // Optimistic clear
    _notifications.clear();
    _unreadCount = 0;
    notifyListeners();

    // Delete each from backend in parallel (fire and forget – UI is already cleared)
    await Future.wait(
      toDelete.map((n) async {
        try {
          await _apiClient.dio.delete('/new-notifications/${n.id}');
        } catch (_) {}
      }),
    );
  }

  // ── SignalR: Connect ─────────────────────────────────────────
  Future<void> _connectSignalR() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) return;

      const hubUrl = 'https://carma-backend-api.onrender.com/hubs/notifications';

      _hubConnection = HubConnectionBuilder()
          .withUrl(
            hubUrl,
            options: HttpConnectionOptions(
              accessTokenFactory: () async => token,
              skipNegotiation: false,
            ),
          )
          .withAutomaticReconnect()
          .build();

      // ── Listen for events ──────────────────────────────────
      _hubConnection!.on('notification.created', (args) {
        if (args != null && args.isNotEmpty && args[0] != null) {
          try {
            final data = args[0] as Map<String, dynamic>;
            final notification = AppNotification.fromJson(data);
            _notifications.insert(0, notification);
            if (!notification.isRead) _unreadCount++;
            notifyListeners();
          } catch (_) {}
        }
      });

      _hubConnection!.on('notification.read', (args) {
        if (args != null && args.isNotEmpty && args[0] != null) {
          try {
            final data = args[0] as Map<String, dynamic>;
            final id = data['id'] as int?;
            if (id != null) {
              final idx = _notifications.indexWhere((n) => n.id == id);
              if (idx != -1 && !_notifications[idx].isRead) {
                _notifications[idx].isRead = true;
                _unreadCount = (_unreadCount - 1).clamp(0, 9999);
                notifyListeners();
              }
            }
          } catch (_) {}
        }
      });

      _hubConnection!.on('notifications.read_all', (_) {
        for (final n in _notifications) {
          n.isRead = true;
        }
        _unreadCount = 0;
        notifyListeners();
      });

      _hubConnection!.on('notification.deleted', (args) {
        if (args != null && args.isNotEmpty && args[0] != null) {
          try {
            final data = args[0] as Map<String, dynamic>;
            final id = data['id'] as int?;
            if (id != null) {
              final removed = _notifications.firstWhere(
                (n) => n.id == id,
                orElse: () => AppNotification(
                  id: -1, type: '', severity: '', title: '', message: '',
                  isRead: true, createdAt: DateTime.now(),
                ),
              );
              _notifications.removeWhere((n) => n.id == id);
              if (!removed.isRead && removed.id != -1) {
                _unreadCount = (_unreadCount - 1).clamp(0, 9999);
              }
              notifyListeners();
            }
          } catch (_) {}
        }
      });

      // ── Connection state callbacks ──────────────────────────
      _hubConnection!.onclose(({error}) {
        _isConnected = false;
        notifyListeners();
      });

      _hubConnection!.onreconnected(({connectionId}) {
        _isConnected = true;
        notifyListeners();
      });

      await _hubConnection!.start();
      _isConnected = true;
      notifyListeners();
    } catch (e) {
      _isConnected = false;
      // silently fail - the page will still show REST data
    }
  }

  // ── Disconnect ───────────────────────────────────────────────
  Future<void> disconnect() async {
    try {
      await _hubConnection?.stop();
    } catch (_) {}
    _isConnected = false;
  }

  @override
  void dispose() {
    disconnect();
    super.dispose();
  }
}

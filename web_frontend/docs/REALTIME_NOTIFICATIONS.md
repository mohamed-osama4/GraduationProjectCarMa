# Real-time Notifications - Frontend Integration

## Overview

The frontend connects to the backend's SignalR hub (`NotificationHub`) via WebSocket to receive real-time notification events. This eliminates the need for polling and provides instant updates across the entire dashboard.

---

## Backend Hub Details

- Hub Route: `/hubs/notifications`
- Full URL: `VITE_API_BASE_URL + /hubs/notifications`
- Authentication: JWT token passed via `access_token` query parameter
- User Identification: `CustomUserIdProvider` extracts user ID from JWT claims (`NameIdentifier`, `sub`, `userId`, or `id`)
- Transport: WebSocket (with `skipNegotiation: true` to bypass CORS issues on the negotiate HTTP endpoint)

---

## SignalR Events Emitted by Backend

### 1. `notification.created`

- Emitted when: A new notification is created for a user (e.g., order accepted, wallet credit added, service completed)
- Emitted by: `NewNotificationService.CreateAsync()`
- Target: Specific user (`Clients.User(userId)`)
- Payload: Full `NewNotificationDto` object

```json
{
  "id": 42,
  "type": "System",
  "severity": "Info",
  "title": "تم إنشاء الطلب",
  "message": "تم إنشاء طلب بطارية بنجاح. رقم الطلب #29",
  "isRead": false,
  "actionUrl": "/orders/29",
  "primaryAction": { "label": "عرض الطلب", "url": "/orders/29" },
  "secondaryAction": null,
  "targetType": "Order",
  "targetId": 29,
  "metadata": null,
  "createdAt": "2026-05-09T14:30:00Z",
  "readAt": null
}
```

### 2. `notification.read`

- Emitted when: A specific notification is marked as read
- Emitted by: `NewNotificationService.MarkAsReadAsync()`
- Target: Specific user (`Clients.User(userId)`)
- Payload:

```json
{
  "id": 42
}
```

### 3. `notifications.read_all`

- Emitted when: All notifications for a user are marked as read in bulk
- Emitted by: `NewNotificationService.MarkAllAsReadAsync()`
- Target: Specific user (`Clients.User(userId)`)
- Payload: None (empty)

### 4. `notification.deleted`

- Emitted when: A notification is soft-deleted
- Emitted by: `NewNotificationService.DeleteAsync()`
- Target: Specific user (`Clients.User(userId)`)
- Payload:

```json
{
  "id": 42
}
```

### 5. `OrderCreated`

- Emitted when: A new order is created
- Emitted by: `OrdersController.Create()`
- Target: All connected clients (`Clients.All`)
- Payload:

```json
{
  "orderId": 29,
  "status": "Pending"
}
```

### 6. `OrderUpdated`

- Emitted when: An order status changes (accepted, rejected, updated)
- Emitted by: `OrdersController.AcceptOrder()`, `RejectOrder()`, `UpdateStatus()`
- Target: All connected clients (`Clients.All`)
- Payload:

```json
{
  "orderId": 29,
  "status": "Accepted"
}
```

---

## Frontend Architecture

### File Structure

```
src/
  context/
    SignalRContext.jsx      -- SignalR connection manager + hooks
  component/
    dashboard/
      DashboardHeader.jsx   -- Bell icon popup (5 latest notifications + toast)
      Sidebar.jsx           -- Notification badge on sidebar menu item
  pages/
    dashboard/
      admin/
        Notifications.jsx   -- Full notifications page with real-time updates
```

### SignalRContext.jsx

Central context that manages a single WebSocket connection per authenticated session.

Exports:
- `SignalRProvider` - Wraps the dashboard routes in App.jsx
- `useSignalR()` - Returns `{ connectionState, subscribe }`
- `useSignalREvent(eventName, handler, deps)` - Convenience hook for subscribing to a specific event with automatic cleanup on unmount

Connection behavior:
- Connects when user is authenticated (has JWT token)
- Disconnects when user logs out
- Auto-reconnects with delays: 0s, 2s, 5s, 10s, 30s
- Uses `skipNegotiation: true` with WebSocket transport to avoid CORS issues

### How Components Subscribe

Each component uses the `useSignalREvent` hook:

```jsx
import { useSignalREvent } from '../../context/SignalRContext';

const MyComponent = () => {
  const handleNewNotif = useCallback((notif) => {
    // Update local state
  }, []);

  useSignalREvent('notification.created', handleNewNotif, []);
};
```

The hook automatically:
- Subscribes when the component mounts
- Unsubscribes when the component unmounts
- Re-subscribes if dependencies change

---

## Component-Level Event Handling

### Notifications.jsx (Full Page)

| Event | Action |
|---|---|
| `notification.created` | Increments totalCount and unreadCount. If user is on page 1 and filters match, prepends the new notification to the list with a flash animation |
| `notification.read` | Finds the notification by ID in local state and sets isRead = true |
| `notifications.read_all` | Maps over all notifications in state and sets isRead = true, resets unreadCount to 0 |
| `notification.deleted` | Removes the notification from local state by ID, decrements totalCount |

### DashboardHeader.jsx (Bell Popup)

| Event | Action |
|---|---|
| `notification.created` | Increments unreadCount on bell badge, prepends notification to popup list (max 5), shows toast popup for 5 seconds |
| `notification.read` | Updates isRead in popup list, decrements badge count |
| `notifications.read_all` | Marks all popup items as read, resets badge to 0 |
| `OrderCreated` | Re-fetches latest 5 notifications from API |
| `OrderUpdated` | Re-fetches latest 5 notifications from API |

The popup also has:
- "Mark all as read" button that calls `PATCH /api/new-notifications/read-all`
- "View all notifications" button that navigates to `/admin/notifications`

### Sidebar.jsx (Badge)

| Event | Action |
|---|---|
| `notification.created` | Increments a local counter shown as a red badge on the notifications menu item |
| `notifications.read_all` | Resets the badge counter to 0 |

The badge counter also resets when the user clicks on the notifications link.

---

## API Endpoints Used

| Endpoint | Method | Usage |
|---|---|---|
| `/api/new-notifications` | GET | Fetch paginated notifications with filters (page, pageSize, isRead, type) |
| `/api/new-notifications/unread-count` | GET | Fetch unread notification count |
| `/api/new-notifications/{id}/read` | PATCH | Mark a single notification as read |
| `/api/new-notifications/read-all` | PATCH | Mark all notifications as read |

---

## Connection Flow

1. User logs in and gets JWT token stored in localStorage
2. App.jsx renders ProtectedRoute > SignalRProvider > AdminDataProvider > DashboardLayout
3. SignalRProvider reads the token from AuthContext
4. HubConnectionBuilder creates a WebSocket connection to `/hubs/notifications?access_token=JWT`
5. Backend validates the JWT and adds the connection to a group matching the user ID
6. Components subscribe to events via `useSignalREvent`
7. When the backend emits an event, all subscribed components receive the payload and update their local state
8. On logout, the connection is stopped and cleaned up

---

## Notes

- The `skipNegotiation: true` option is required because the backend CORS policy uses `AllowAnyOrigin()` which does not support `AllowCredentials()`. Since the negotiate endpoint is a regular HTTP request subject to CORS, skipping it and connecting directly via WebSocket (which is not subject to CORS) solves this without backend changes.
- The 60-second polling in DashboardHeader serves as a fallback in case the WebSocket connection fails or drops.
- Toast notifications auto-dismiss after 5 seconds.
- Flash animations on new notifications in the full page last 2 seconds.

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr';
import { useAuth } from './AuthContext';

const SignalRContext = createContext(null);

const HUB_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5238') + '/hubs/notifications';

export const SignalRProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const connectionRef = useRef(null);
  const [connectionState, setConnectionState] = useState('disconnected'); // disconnected | connecting | connected | error
  const listenersRef = useRef(new Map()); // eventName -> Set of callbacks

  // Build and start the connection when authenticated
  useEffect(() => {
    if (!isAuthenticated || !token) {
      // If not authenticated, stop any existing connection
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
        setConnectionState('disconnected');
      }
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
        // Skip the negotiate HTTP call (which causes CORS error) and connect
        // directly via WebSocket. WebSockets are NOT subject to CORS restrictions.
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Reconnect delays
      .configureLogging(LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    // Connection lifecycle handlers
    connection.onreconnecting(() => {
      console.log('[SignalR] Reconnecting...');
      setConnectionState('connecting');
    });

    connection.onreconnected(() => {
      console.log('[SignalR] Reconnected.');
      setConnectionState('connected');
    });

    connection.onclose((error) => {
      console.log('[SignalR] Connection closed.', error);
      setConnectionState('disconnected');
    });

    // Re-attach any existing listeners to the new connection
    listenersRef.current.forEach((callbacks, eventName) => {
      callbacks.forEach((callback) => {
        connection.on(eventName, callback);
      });
    });

    // Start the connection
    setConnectionState('connecting');
    connection
      .start()
      .then(() => {
        console.log('[SignalR] Connected successfully.');
        setConnectionState('connected');
      })
      .catch((err) => {
        console.error('[SignalR] Connection failed:', err);
        setConnectionState('error');
      });

    return () => {
      connection.stop();
      connectionRef.current = null;
      setConnectionState('disconnected');
    };
  }, [isAuthenticated, token]);

  /**
   * Subscribe to a SignalR event.
   * Returns an unsubscribe function.
   */
  const subscribe = useCallback((eventName, callback) => {
    // Track in our listeners map
    if (!listenersRef.current.has(eventName)) {
      listenersRef.current.set(eventName, new Set());
    }
    listenersRef.current.get(eventName).add(callback);

    // If connection exists, attach immediately
    if (connectionRef.current) {
      connectionRef.current.on(eventName, callback);
    }

    // Return unsubscribe function
    return () => {
      listenersRef.current.get(eventName)?.delete(callback);
      if (connectionRef.current) {
        connectionRef.current.off(eventName, callback);
      }
    };
  }, []);

  const value = {
    connectionState,
    subscribe,
  };

  return (
    <SignalRContext.Provider value={value}>
      {children}
    </SignalRContext.Provider>
  );
};

/**
 * Hook to access SignalR context
 */
export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalR must be used within a SignalRProvider');
  }
  return context;
};

/**
 * Convenience hook: subscribe to a specific event with auto-cleanup.
 * @param {string} eventName - The SignalR event name
 * @param {Function} handler - Callback to invoke
 * @param {Array} deps - Additional dependencies for the handler
 */
export const useSignalREvent = (eventName, handler, deps = []) => {
  const { subscribe } = useSignalR();

  useEffect(() => {
    if (!eventName || !handler) return;
    const unsubscribe = subscribe(eventName, handler);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, subscribe, ...deps]);
};

export default SignalRContext;

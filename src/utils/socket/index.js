import SocketIOClient from 'socket.io-client';
import { socketConfig } from '..';
import { tripDetailRequest } from '../../module/App/actions';
import { ENV } from '../../config';
import { getCurrentLocation } from '../commonFunction';
// import {newMessageInGroup} from '../../modules/chats/action';
// import Sound from 'react-native-sound';
// const sound = new Sound(require('../../assets/music/friend_request.mp3'))

class WSService {
  constructor() {
    this.socket = null;
    this.reconnectionAttempts = 0;
    this.maxReconnectionAttempts = 5;
  }

  initializeSocket = (userToken, driverId, dispatch) => {
    try {
      console.log('=================================');
      console.log('🔌 SOCKET INITIALIZATION STARTED');
      console.log('=================================');
      console.log('User Token:', userToken ? `${userToken.substring(0, 15)}...` : 'No token');
      console.log('Driver ID:', driverId || 'No driver ID');
      console.log('Environment:', ENV);
      
      if (!driverId) {
        console.log('❌ Skipping socket initialization - driverId not found');
        return;
      }

      if (!userToken) {
        console.log('❌ Skipping socket initialization - userToken not found');
        return;
      }

      // Close existing socket connection if any
      if (this.socket) {
        console.log('Closing existing socket connection...');
        this.socket.disconnect();
        this.socket = null;
      }

      const SOCKET_URL = 'https://hrrxmgf8-8000.inc1.devtunnels.ms';
      console.log('🌐 Connecting to socket server:', SOCKET_URL);

      // WORKING CONFIGURATION - Using auth object instead of query params
      const socketOptions = {
        transports: ['websocket'],
        auth: {
          token: userToken,
          driverId: driverId
        },
        query: {
          driverId: driverId // Keep driverId in query if needed by other handlers
        },
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        forceNew: true,
        autoConnect: true
      };

      console.log('⚙️ Socket options:', JSON.stringify({
        ...socketOptions,
        auth: { token: '***hidden***', driverId: socketOptions.auth.driverId }
      }, null, 2));

      // Create new socket connection
      this.socket = SocketIOClient(SOCKET_URL, socketOptions);

      // Connection established
      this.socket.on('connect', () => {
        console.log('✅✅✅ SOCKET CONNECTED SUCCESSFULLY! ✅✅✅');
        console.log('Socket ID:', this.socket.id);
        console.log('Socket connected status:', this.socket.connected);
        console.log('Transport type:', this.socket.io.engine.transport.name);
        
        this.reconnectionAttempts = 0;

        // Get current location and emit to server
        console.log('📍 Getting current location...');
        getCurrentLocation(
          (current_location) => {
            if (current_location && current_location.coords) {
              const location = {
                lat: current_location.coords.latitude,
                lng: current_location.coords.longitude,
              };
              
              console.log('📍 Location obtained:', location);
              console.log('📤 Emitting "driversocket" event...');

              // Emit driver location with acknowledgment
              this.socket.emit(
                'driversocket',
                {
                  driverId,
                  driverLocation: location
                },
                (acknowledgment) => {
                  console.log('📨 "driversocket" acknowledgment:', acknowledgment);
                }
              );
            } else {
              console.log('❌ Failed to get location');
            }
          },
          (error) => {
            console.log('❌ Error getting location:', error);
          }
        );
      });

      // Reconnection events
      this.socket.on('reconnect_attempt', (attempt) => {
        this.reconnectionAttempts = attempt;
        console.log(`🔄 Reconnection attempt ${attempt}/${this.maxReconnectionAttempts}`);
      });

      this.socket.on('reconnect', (attempt) => {
        console.log(`✅✅✅ Socket reconnected after ${attempt} attempts!`);
      });

      this.socket.on('reconnect_error', (error) => {
        console.log('❌ Reconnection error:', error.message);
      });

      this.socket.on('reconnect_failed', () => {
        console.log('❌❌❌ Failed to reconnect after', this.maxReconnectionAttempts, 'attempts');
      });

      // Disconnection
      this.socket.on('disconnect', (reason) => {
        console.log('❌❌❌ Socket disconnected:', reason);
        console.log('Disconnection timestamp:', new Date().toISOString());
        
        if (reason === 'io server disconnect') {
          console.log('Server initiated disconnect, attempting to reconnect...');
          setTimeout(() => {
            if (this.socket) {
              this.socket.connect();
            }
          }, 1000);
        }
      });

      // Connection errors
      this.socket.on('connect_error', (error) => {
        console.log('❌❌❌ Socket connection error:');
        console.log('Error message:', error.message);
        console.log('Error description:', error.description);
        console.log('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        
        if (this.socket && this.socket.io && this.socket.io.engine) {
          console.log('Transport type:', this.socket.io.engine.transport?.name);
          console.log('Ready state:', this.socket.io.engine.readyState);
        }
      });

      // General errors
      this.socket.on('error', (error) => {
        console.log('❌❌❌ Socket general error:');
        console.log('Error:', error);
      });

      // Listen to all incoming events for debugging
      this.socket.onAny((eventName, ...args) => {
        console.log(`📡 Received event "${eventName}":`, args.length > 0 ? JSON.stringify(args[0], null, 2) : 'No data');
      });

      // Specific event listeners
      this.socket.on('newTripRequest', (data) => {
        console.log('🚕🚕🚕 NEW TRIP REQUEST RECEIVED! 🚕🚕🚕');
        console.log('Trip data:', JSON.stringify(data, null, 2));

        if (data?.isNewRequest == 'yes') {
          console.log('🔔 New trip request flag is YES');
          // sound.play()
        }

        console.log('Dispatching tripDetailRequest action...');
        dispatch(tripDetailRequest({ data: { tripId: data.tripId } }));
      });

      // Ping/Pong for connection health check
      this.socket.io.engine.on('ping', () => {
        console.log('🏓 Socket ping sent');
      });

      this.socket.io.engine.on('pong', (latency) => {
        console.log('🏓 Socket pong received, latency:', latency, 'ms');
      });

      console.log('Socket initialization complete. Waiting for connection...');

    } catch (error) {
      console.log('❌❌❌ CRITICAL ERROR in initializeSocket:');
      console.log('Error name:', error.name);
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);
    }
  };

  // Check if socket is connected
  isConnected = () => {
    const connected = this.socket?.connected || false;
    console.log('Socket connection status:', connected ? 'Connected' : 'Disconnected');
    if (this.socket && connected) {
      console.log('Socket ID:', this.socket.id);
    }
    return connected;
  };

  // Get socket instance
  getSocketInstance = () => {
    return this.socket;
  };

  // Emit event with acknowledgment
  emit = (event, data = {}, acknowledgment) => {
    console.log(`📤 Emitting event "${event}":`, data);
    
    if (!this.socket) {
      console.log('❌ Cannot emit - socket not initialized');
      return;
    }

    if (!this.socket.connected) {
      console.log('❌ Cannot emit - socket not connected');
      return;
    }

    this.socket.emit(event, data, acknowledgment);
  };

  // Listen to event
  on = (event, callback) => {
    console.log(`👂 Setting up listener for event: "${event}"`);
    
    if (!this.socket) {
      console.log(`❌ Cannot listen - socket not initialized`);
      return;
    }

    this.socket.on(event, callback);
  };

  // Remove listener
  removeListener = (listenerName) => {
    console.log(`🗑️ Removing listener: "${listenerName}"`);
    
    if (!this.socket) {
      console.log(`❌ Cannot remove listener - socket not initialized`);
      return;
    }

    this.socket.removeListener(listenerName);
  };

  // Remove all listeners
  removeAllListeners = () => {
    console.log('🗑️ Removing all listeners');
    
    if (!this.socket) {
      console.log('❌ Cannot remove listeners - socket not initialized');
      return;
    }

    this.socket.removeAllListeners();
  };

  // Send message (alias for emit)
  sendMessage = (event, data = {}, acknowledgment) => {
    this.emit(event, data, acknowledgment);
  };

  // Listen to server messages
  messageFromServer = (event, callback) => {
    this.on(event, callback);
  };

  // Disconnect socket
  disconnect = () => {
    console.log('🔌 Manually disconnecting socket...');
    
    if (!this.socket) {
      console.log('No socket to disconnect');
      return;
    }

    this.socket.disconnect();
    this.socket = null;
    console.log('✅ Socket disconnected and cleaned up');
  };

  // Reconnect socket
  reconnect = () => {
    console.log('🔄 Manually reconnecting socket...');
    
    if (!this.socket) {
      console.log('No socket to reconnect');
      return;
    }

    this.socket.connect();
  };
}

// Create singleton instance
const socketServices = new WSService();

export default socketServices;
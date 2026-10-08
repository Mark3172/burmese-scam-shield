import { NativeModules, NativeEventEmitter, Platform, PermissionsAndroid } from 'react-native';
import { HybridScamDetector } from '../engine/HybridScamDetector';
import { SmsMessage } from '../types/detector';

/**
 * Android Native SMS Bridge Interface
 * In a bare React Native project or custom Expo dev-client, 
 * this interfaces with the native SmsListener module.
 */
interface NativeSmsPayload {
  originatingAddress: string;
  body: string;
  timestamp: number;
}

export class NativeSmsIntegration {
  /**
   * Request standard Android SMS permissions at runtime
   */
  public static async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      ]);

      return (
        granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.READ_SMS] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  }

  /**
   * Subscribes to native incoming SMS broadcasts and performs on-device analysis
   */
  public static subscribeToIncomingSms(
    onMessageIntercepted: (msg: SmsMessage) => void
  ): () => void {
    if (Platform.OS !== 'android' || !NativeModules.SmsListenerModule) {
      console.log('Native SMS broadcast listener is only active on Android native device.');
      return () => {};
    }

    const eventEmitter = new NativeEventEmitter(NativeModules.SmsListenerModule);
    const subscription = eventEmitter.addListener(
      'onSmsReceived',
      (payload: NativeSmsPayload) => {
        // Run 100% On-Device Hybrid Engine
        const analysis = HybridScamDetector.analyze(payload.body);
        const smsMessage: SmsMessage = {
          id: `sms-${payload.timestamp}-${Math.random().toString(36).substr(2, 5)}`,
          sender: payload.originatingAddress,
          body: payload.body,
          timestamp: payload.timestamp || Date.now(),
          analysis,
          isRead: false
        };

        onMessageIntercepted(smsMessage);
      }
    );

    return () => {
      subscription.remove();
    };
  }
}

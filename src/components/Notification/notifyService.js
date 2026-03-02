import { Platform } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

class NotifyService {
  subscribeListener = async (onForegroundEvent, onBackgroundEvent) => {
    this.subscribleForgorund = await notifee.onForegroundEvent(
      async ({ type, detail }) => {
        switch (type) {
          case EventType.DISMISSED:
            console.log('User dismissed notification', detail);
            break;
          case EventType.PRESS:
            console.log('User pressed notification', detail);
            onForegroundEvent(detail);

            break;
        }
      },
    );

    this.subscribleBackground = await notifee.onBackgroundEvent(
      async ({ type, detail }) => {
        switch (type) {
          case EventType.DISMISSED:
            console.log('User dismissed notification background', detail);
            break;
          case EventType.PRESS:
            console.log('User pressed notification background', detail);
            // navigationRef?.navigate(SCREEN_NAMES.NotificationStack);
            onBackgroundEvent(detail);
            break;
        }
      },
    );
  };
  unSubscribeListener = () => {
    // this.subscribleBackground()
    // this.subscribleForgorund()
  };

  showNotification = async (title, body, data) => {
    if (Platform.OS === 'ios') {
      await notifee.requestPermission();
    }

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    console.log('displayNotification', {
      title: title,
      body: body,
      android: { channelId },
    });
    await notifee.displayNotification({
      title: title,
      body: body,
      android: { channelId },
      data: data,
    });
  };


  showForegroundNotification = async (title, body, data) => {
    if (Platform.OS === 'ios') {
      await notifee.requestPermission();
    }

    const channelId = await notifee.createChannel({
      id: 'forgoround',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,

    });

    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        asForegroundService: true,
        autoCancel: false,
        ongoing: true,
      },
      data: data,
    });
  };

  clearNotifiations = () => {
    notifee.cancelDisplayedNotifications();
  };
}

export const notifyService = new NotifyService();

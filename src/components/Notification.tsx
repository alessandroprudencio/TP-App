import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { NotificationResponse } from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useChallenge } from '../context/ChallengeContext';
import api from '../services/api';
import DialogAcceptChallenge from './DialogAcceptChallenge';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Notification(props: { children: any }) {
  const [_expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [_notification, setNotification] = useState<Notifications.Notification>();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  const { user } = useAuth();
  const { setIsRefreshChallenges } = useChallenge();

  useEffect(() => {
    getPushToken().then((pushToken) => {
      if (!pushToken) {
        registerForPushNotificationsAsync().then(async (token) => {
          if (token) {
            setExpoPushToken(token);

            await AsyncStorage.setItem('@pushToken', JSON.stringify(token));
          }
        });
      } else {
        setExpoPushToken(pushToken);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      async (response: NotificationResponse) => {
        const { notification }: any = response;

        const isAccept = await DialogAcceptChallenge(notification.request.content.data.challengeId);

        if (isAccept) {
          setIsRefreshChallenges(true);
        }
      },
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const getPushToken = async () => {
    const pushToken = await AsyncStorage.getItem('@pushToken');

    if (pushToken) return JSON.parse(pushToken);

    return null;
  };

  const registerForPushNotificationsAsync = async () => {
    try {
      let token;

      if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();

        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          Alert.alert('Failed to get push token for push notification!');
          return;
        }

        token = (await Notifications.getExpoPushTokenAsync()).data;

        await api.put(`/players/${user._id}/set-push-token`, { pushToken: token });
      } else {
      }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return token;
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    }
  };

  return <>{props.children}</>;
}

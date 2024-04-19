import * as React from 'react';
import * as Device from "expo-device";
import {Platform} from "react-native";
import * as Notifications from "expo-notifications";

export async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice && Platform.OS !== 'web') {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }
        const appConfig = require('../../app.config.js');
        const projectId = appConfig?.expo?.extra?.eas?.projectId;
        token = (await Notifications.getExpoPushTokenAsync({
            projectId
        })).data;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

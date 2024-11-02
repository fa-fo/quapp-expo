import * as Device from "expo-device";
import {Platform} from "react-native";
import * as Notifications from "expo-notifications";
import appConfig from '../../app.config.js';

export async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice && Platform.OS !== 'web' && process?.env?.NODE_ENV !== 'development') {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }
        const projectId = appConfig?.extra?.eas?.projectId;
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

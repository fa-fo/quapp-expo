import * as Device from "expo-device";
import {Platform} from "react-native";
import * as Notifications from "expo-notifications";
import appConfig from '../../app.config.js';
import {parseISO} from "date-fns";
import * as DateFunctions from "./DateFunctions";

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

export const setLocalPushNotifications = (matches) => {
    // configure local push notifications
    if (Device.isDevice && Platform.OS !== 'web') {
        Notifications.cancelAllScheduledNotificationsAsync() // cancel notifications for old team
            .then(r => {
                if (global.myTeamId > 0) {
                    matches.map(item => {
                        const trigger = parseISO(item.matchStartTime);
                        trigger.setMinutes(Number(parseInt(trigger.getMinutes().toString()) - 10));

                        Notifications.scheduleNotificationAsync({
                            content: {
                                title: (item.isRefereeJob ? '!! SR-Einsatz !!' : 'Dein nächstes Spiel') + ' um ' + DateFunctions.getFormatted(item.matchStartTime) + ' Uhr!',
                                body: item.sport.name + ' Feld ' + item.group_name + (item.isRefereeJob ? '' : ': ' + item.teams1.name + ' vs. ' + item.teams2.name),
                            },
                            trigger,
                        })
                    })
                }
            })
    }
};

import {Platform} from 'react-native';
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {parseISO} from "date-fns";
import * as DateFunctions from "./functions/DateFunctions";

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

import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import MyDrawer from "./navigation/DrawerNavigator";
import {NavigationContainer} from "@react-navigation/native";
import {ActivityIndicator, Platform} from "react-native";
import styles from './assets/styles.js';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
    const [isLoading, setLoading] = useState(true);
    const [expoPushToken, setExpoPushToken] = useState(''); // sic! needed

    global.settings = {};
    global.currentDayName = '';
    global.currentYearName = '';
    global.currentYearId = 0;

    global.hintAutoUpdateResults = 'In dieser Spielrunde werden die Ergebnisse erst nach Ende des Turniertages bekanntgegeben!';
    global.hintTestData = 'Testmodus! Gruppeneinteilung ist vorläufig, Spielpaarungen ändern sich noch bis zur Bekanntgabe des entgültigen Spielplans am Turniertag!\nFehlermeldungen, Fragen und Verbesserungsvorschläge bitte an info@quattfo.de';

    if (window?.location?.hostname === 'api.quattfo.de') {
        global.myTeamId = 0;  // reason: do not show TeamSelectScreen for this host!
    }

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => {
                setExpoPushToken(token);
                global.expoPushToken = (token !== undefined ? token : '');
            })

        async function getStorage() {
            await AsyncStorage.getItem('myTeamId')
                .then(response => response !== null ? response.toString() : null)
                .then((string) => global.myTeamId = (string !== null ? parseInt(JSON.parse(string)) : null))
                .catch((error) => console.error(error));

            await AsyncStorage.getItem('myTeamName')
                .then(response => response !== null ? response.toString() : null)
                .then((string) => global.myTeamName = (string !== null ? JSON.parse(string) : ''))
                .catch((error) => console.error(error));
        }

        getStorage().then(r => setLoading(false));
    }, []);

    return (
        <NavigationContainer>
            {isLoading ?
                <ActivityIndicator size="large" color="#00ff00" style={styles.actInd}/>
                :
                <MyDrawer/>
            }
        </NavigationContainer>
    );
}

async function registerForPushNotificationsAsync() {
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
        const appConfig = require('./app.json');
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


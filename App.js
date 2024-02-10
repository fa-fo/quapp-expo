import 'react-native-gesture-handler';
import React, {useCallback, useEffect, useState} from 'react';
import MyDrawer from "./navigation/DrawerNavigator";
import {NavigationContainer} from "@react-navigation/native";
import * as SplashScreen from 'expo-splash-screen';
import * as PushFunctions from './components/functions/PushFunctions';
import {loadStorageTeam} from "./components/functions/AsyncStorageFunctions";

SplashScreen.preventAutoHideAsync().then(r => null);

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
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
        async function prepare() {
            try {
                await PushFunctions.registerForPushNotificationsAsync()
                    .then(token => {
                        setExpoPushToken(token);
                        global.expoPushToken = (token !== undefined ? token : '');
                    })

                await loadStorageTeam().then(r => null);

                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare().then(r => null);
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <NavigationContainer onReady={onLayoutRootView}>
            <MyDrawer/>
        </NavigationContainer>
    );
}



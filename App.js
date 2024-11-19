import 'expo-dev-client';
import 'react-native-gesture-handler';
import {useCallback, useEffect, useState} from 'react';
import MyDrawer from "./navigation/DrawerNavigator";
import {DarkTheme, DefaultTheme, NavigationContainer} from "@react-navigation/native";
import * as SplashScreen from 'expo-splash-screen';
import * as PushFunctions from './components/functions/PushFunctions';
import {setGlobalVariables} from "./components/functions/GlobalVariablesFunctions";
import {loadStorageData} from "./components/functions/AsyncStorageFunctions";

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
    /* reloading the app might trigger some race conditions, ignore them */
});

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    const [expoPushToken, setExpoPushToken] = useState(''); // sic! needed

    useEffect(() => {
        async function prepare() {
            try {
                setGlobalVariables();

                await PushFunctions.registerForPushNotificationsAsync()
                    .then(token => {
                        setExpoPushToken(token);
                        global.expoPushToken = (token !== undefined ? token : '');
                    })

                await loadStorageData().then(r => null);

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

    const myTheme = global.colorScheme === 'dark' ? DarkTheme : DefaultTheme;

    return (
        <NavigationContainer theme={myTheme} onReady={onLayoutRootView}>
            <MyDrawer/>
        </NavigationContainer>
    );
}

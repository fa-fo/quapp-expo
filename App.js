import 'expo-dev-client';
import 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import AnimatedSplashScreen from "./screens/initials/AnimatedSplashScreen";
import {Appearance} from "react-native";

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
    /* reloading the app might trigger some race conditions, ignore them */
});

export default function App() {

    return (
        <AnimatedSplashScreen
            image={{
                uri: Appearance.getColorScheme() === 'dark' ?
                    require('./assets/images/splash-dark.png')
                    : require('./assets/images/splash.png')
            }}/>
    );
}

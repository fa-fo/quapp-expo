import {useCallback, useEffect, useMemo, useState} from 'react';
import {Animated, Easing, StyleSheet, useWindowDimensions, View} from 'react-native';
import {DarkTheme, DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {setStatusBarBackgroundColor, setStatusBarStyle} from "expo-status-bar";
import * as SplashScreen from 'expo-splash-screen';
import * as Progress from 'react-native-progress';
import MyDrawer from "../../navigation/DrawerNavigator";
import {setGlobalVariables} from "../../components/functions/GlobalVariablesFunctions";
import {loadStorageData} from "../../components/functions/AsyncStorageFunctions";
import * as ColorFunctions from "../../components/functions/ColorFunctions";
import * as PushFunctions from "../../components/functions/PushFunctions";
import TextC from "../../components/customText";

export default function AnimatedSplashScreen({image}) {
    const animation = useMemo(() => new Animated.Value(1), []);
    const [progress, setProgress] = useState(0);
    const [appIsReady, setAppIsReady] = useState(false);
    const [showSplash, setShowSplash] = useState(true);
    const [expoPushToken, setExpoPushToken] = useState(''); // sic! needed

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(200),
                Animated.timing(animation, {
                    toValue: 0.9,
                    duration: 1000,
                    useNativeDriver: true,
                    easing: Easing.bounce
                }),
                Animated.delay(200),
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                    easing: Easing.bounce
                }),
            ])
        ).start();
    });

    const onImageLoaded = useCallback(async () => {
        try {
            setProgress(.4);
            await SplashScreen.hideAsync();

            setProgress(.5);
            setGlobalVariables();

            setProgress(.6);
            await PushFunctions.registerForPushNotificationsAsync()
                .then(token => {
                    setExpoPushToken(token);
                    global.expoPushToken = (token !== 'undefined' && token !== undefined ? token : '');
                })

            setProgress(.7);
            await loadStorageData().then(r => setAppIsReady(true));

            for (let i = 0; i < 2; i++) {
                setProgress(.8 + .1 * i);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            setProgress(1);
        } catch (e) {
            console.warn(e);
        } finally {
            setProgress(1);
            setShowSplash(false);

            setStatusBarStyle(global.colorScheme === 'dark' ? 'light' : 'dark');
            setStatusBarBackgroundColor(ColorFunctions.getColor('primaryBg'));
        }
    }, []);

    const myTheme = global.colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    const dimensions = useWindowDimensions();

    return (
        <View style={{flex: 1}}>
            {appIsReady ?
                <NavigationContainer theme={myTheme}>
                    <MyDrawer/>
                </NavigationContainer>
                : null}

            {showSplash ?
                <Animated.View style={[StyleSheet.absoluteFill,
                    {
                        backgroundColor: ColorFunctions.getColor('primaryBgBlackWhite'),
                        height: '100%', alignItems: 'center', display: 'flex',
                        pointerEvents: 'none'
                    }]}>
                    <Animated.Image
                        style={{
                            flex: 1,
                            width: 200,
                            height: 200,
                            transform: [{scale: animation}],
                        }}
                        resizeMode={'contain'}
                        source={image.uri}
                        onLoadEnd={onImageLoaded}
                    />
                    <Progress.Bar progress={progress} width={200}
                                  color={ColorFunctions.getColor('GoldBg')}
                                  style={{position: 'absolute', top: dimensions.height / 2 + 200}}/>
                    <TextC style={{
                        position: 'absolute',
                        textAlign: 'center',
                        top: dimensions.height / 2 + 215,
                        width: '95%'
                    }}>
                        QuattFo is loading
                    </TextC>
                </Animated.View>
                : null}
        </View>
    );
}

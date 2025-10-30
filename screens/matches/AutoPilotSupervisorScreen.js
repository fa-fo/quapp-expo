// re-add "expo-speech": "~11.3.0","expo-av": "~13.4.1",

import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, View} from 'react-native';
import fetchApi from "../../components/fetchApi";
import {differenceInSeconds, format, parse} from "date-fns";
import {Cell, Section, TableView} from "react-native-tableview-simple";
import {style} from "../../assets/styles";
//import {Audio} from 'expo-av';
//import * as Speech from 'expo-speech';
import * as DateFunctions from "../../components/functions/DateFunctions";
import {useAutoReload} from "../../components/useAutoReload";
import {useRoute} from "@react-navigation/native";
import {setHeaderRightOptions} from "../../components/setHeaderRightOptions";

export default function AutoPilotSupervisorScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [now, setNow] = useState(new Date());
    const [matchTime, setMatchTime] = useState(null);
    const [currentRoundId, setCurrentRoundId] = useState(null);
    const [autoPilot, setAutoPilot] = useState(true);

    const loadScreenData = () => {
        setLoading(true);
        fetchApi('rounds/all/0/10') // offset: 10
            .then((json) => {
                setData(json);
                setCurrentRoundId(json?.object?.currentRoundId ?? 0);
                setHeaderRightOptions(navigation, route, json, loadScreenData);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const interval =
            setInterval(() => {
                getMatchTime();
            }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [currentRoundId, autoPilot, data])

    function getMatchTime() {
        let now = new Date();
        let currentRound = data?.object?.rounds?.find((e) => e.id === currentRoundId);

        if (currentRound) {
            let countdown = '';
            const zeroPad = (num) => String(num).padStart(2, "0");

            let start = parse(currentRound.timeStart.slice(-8), 'HH:mm:ss', now);

            if (global.settings.isTest) {
                now.setHours(now.getMinutes() < 50 ? start.getHours() : start.getHours() - 1);
            }

            let diffSecs = Math.abs(differenceInSeconds(now, start)) % (30 * 60);
            let minute = Math.floor(diffSecs / 60);
            let second = diffSecs % 60;

            let mainTimer = start > now ? '-' : '';
            mainTimer += zeroPad(minute) + ':' + zeroPad(second);

            if (autoPilot && currentRoundId !== 0) {
                // additional countdown
                let arr = [9, 19];
                if (arr.indexOf(minute) > -1 && second > 49) {
                    countdown = '-00:' + zeroPad(60 - second)
                }

                playSpeechAndSound(mainTimer).then(r => {
                    //console.log(second)
                });
            }

            setMatchTime(
                <View>
                    <TextC style={[style().big1, start > now ? style().textRed : null]}>{mainTimer}</TextC>
                    <TextC style={[style().big1, style().big3, style().textRed]}>{countdown}</TextC>
                </View>);
        }

        setNow(now);
    }

    function getSpeechString(mainTimer) {
        let spString = '';

        if (global.settings.isTest) {
            if (mainTimer.substring(0, 1) === '-' && mainTimer.substring(2, 3) !== '0' && mainTimer.substring(4, 6) === '10') {
                spString = 'Noch ' + mainTimer.substring(2, 3) + ' Minuten bis Spiel-Beginn Runde ' + currentRoundId;
            } else if (mainTimer.substring(0, 1) === '0' && mainTimer.substring(1, 2) !== '9' && mainTimer.substring(3, 5) === '50') {
                spString = 'Noch ' + (9 - mainTimer.substring(1, 2)) + ' Minuten bis zum Seitenwechsel Runde ' + currentRoundId;
            } else if (mainTimer.substring(0, 1) === '1' && mainTimer.substring(1, 2) !== '9' && mainTimer.substring(3, 5) === '50') {
                spString = 'Noch ' + (9 - mainTimer.substring(1, 2)) + ' Minuten bis Spiel-Ende Runde ' + currentRoundId;
            }
        }

        switch (mainTimer) {
            case '-00:15':
            case '09:45':
            case '19:45':
                spString = 'Countdown';
                break;

            case '-05:10':
                spString = 'Noch 5 Minuten bis Spiel-Beginn Runde ' + currentRoundId;
                break;
            case '-03:10':
                spString = 'Noch 3 Minuten bis Spiel-Beginn Runde ' + currentRoundId;
                break;
            case '-01:10':
                spString = 'Noch eine Minute bis Spiel-Beginn Runde ' + currentRoundId;
                break;
            case '-00:10':
                spString = 'Spiel-Beginn Runde ' + currentRoundId;
                break;

            case '08:50':
                spString = 'Noch eine Minute bis zum Seitenwechsel';
                break;
            case '09:50':
                spString = 'Seitenwechsel';
                break;

            case '18:50':
                spString = 'Noch eine Minute bis Spiel-Ende';
                break;
            case '19:20':
                spString = 'Noch 30 Sekunden bis Spiel-Ende';
                break;
            case '19:50':
                spString = 'Spiel-Ende Runde ' + currentRoundId;
                break;
        }

        return spString;
    }

    async function playSpeechAndSound(mainTimer) {
        let file = getSpeechString(mainTimer);

        if (mainTimer === '19:59')
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 sec

        if (file !== '') {
            console.log(file);
            //Speech.speak(file, {rate: 1.0, language: 'de'});
        }

        try {
            if (file !== '') {
                /*
                const sound = new Audio.Sound();
                await sound.loadAsync(
                    require('./../../assets/sounds/alarm.mp3'),
                    {shouldPlay: true});
                await sound.setPositionAsync(0);
                await sound.playAsync();
                 */
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        return navigation.addListener('focus', () => {
            loadScreenData();
        });
    }, []);

    useAutoReload(route, data, loadScreenData, !isLoading);

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            <View style={{position: 'absolute', right: 5, top: 5}}>
                <TextC>{format(now, "HH:mm:ss")}</TextC>
            </View>
            <Pressable
                style={[style().button1, style().buttonBigBB1, (autoPilot ? style().buttonRed : style().buttonGreen)]}
                onPress={() => setAutoPilot(!autoPilot)}>
                <TextC numberOfLines={1} style={style().textButton1}>
                    Auto-Pilot {autoPilot ? 'ausschalten' : 'einschalten'}
                </TextC>
            </Pressable>
            {isLoading ? null :
                (data?.status === 'success' && data?.object?.rounds?.length > 0 ? (
                    <TableView appearance={global.colorScheme}>
                        <Section header={global.currentDayName}>
                            {data.object.rounds.map(item =>
                                (item.id >= currentRoundId ?
                                        <View key={item.id}>
                                            <Cell
                                                title={'Spielrunde ' + item.id + ' um ' + DateFunctions.getFormatted(item.timeStart) + ' Uhr'}
                                                titleTextColor={item.id === currentRoundId ? 'red' : null}
                                            />
                                            {item.id === currentRoundId ?
                                                <View>
                                                    {matchTime}
                                                </View> : null}
                                        </View> : null
                                ))}
                        </Section>
                    </TableView>
                ) : <TextC>Keine Spielrunden gefunden!</TextC>)}
        </ScrollView>
    );
}

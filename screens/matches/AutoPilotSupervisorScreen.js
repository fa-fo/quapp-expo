// re-add "expo-av": "~13.0.2",
import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import fetchApi from "../../components/fetchApi";
import {useFocusEffect} from "@react-navigation/native";
import {format} from "date-fns";
import {Cell, Section, TableView} from "react-native-tableview-simple";
import styles from "../../assets/styles";
import {Audio} from 'expo-av';
import * as Speech from 'expo-speech';
import * as DateFunctions from "../../components/functions/DateFunctions";


export default function AutoPilotSupervisorScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [now, setNow] = useState(new Date());
    const [matchTime, setMatchTime] = useState(null);
    const [soundFile, setSoundFile] = useState('');
    const [currentRoundId, setCurrentRoundId] = useState(null);
    const [autoPilot, setAutoPilot] = useState(true);

    useEffect(() => {
        loadScreenData();
    }, []);

    const loadScreenData = () => {
        fetchApi('rounds/all')
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    useFocusEffect(
        useCallback(() => {
            const interval =
                setInterval(() => {
                    if (data.year?.settings?.currentDay_id)
                        getMatchTime(data.year.settings.currentDay_id);
                }, 1000);

            return () => {
                clearInterval(interval);
            };
        }, [currentRoundId, autoPilot, data]),
    );

    function getCurrentRoundId(currentDay_id) {
        let time = new Date();
        time.setMinutes(time.getMinutes() + 10);
        time.setHours(time.getHours() - (currentDay_id === 2 ? 1 : 2));
        let cycle = Math.floor(time.getHours() / 8);

        if (cycle !== 1 && data.day === format(now, "yyyy-MM-dd")) {
            return 0; // on real match day only play real times
        }

        return (time.getHours() % 8 * 2 + 1) + Math.floor(time.getMinutes() / 30);
    }

    function getMatchTime(currentDay_id) {
        let now = new Date();
        let mainTimer = '';
        let neg = 0;
        let countdown = '';
        const zeroPad = (num) => String(num).padStart(2, "0");

        if (now.getMinutes() % 30 < 20) {
            // positive timer
            mainTimer = zeroPad(now.getMinutes() % 30)
                + ':'
                + zeroPad(now.getSeconds())
        } else {
            // negative timer
            neg = 1;
            mainTimer = '-'
                + zeroPad(30 - now.getMinutes() % 30 - 1)
                + ':'
                + zeroPad(59 - now.getSeconds())
        }

        if (mainTimer === '-09:59' || mainTimer === '-09:56' || currentRoundId === null) { // round change
            setCurrentRoundId(getCurrentRoundId(currentDay_id));
        }

        if (autoPilot && currentRoundId !== 0) {
            let arr = [9, 19];
            if (arr.indexOf(now.getMinutes() % 30) > -1 && now.getSeconds() > 49) {
                countdown = '-00:' + zeroPad(59 - now.getSeconds())
            }

            playSound(mainTimer).then(r => {
                //console.log(now.getSeconds())
            });
        }

        setNow(now);
        setMatchTime(
            <View>
                <Text style={[styles.big1, neg ? styles.textRed : null]}>{mainTimer}</Text>
                <Text style={[styles.big1, styles.big3, styles.textRed]}>{countdown}</Text>
            </View>);
    }

    function getSoundFileName(mainTimer) {
        let file = ' ';

        if (global.settings.isTest) {
            if (mainTimer.substring(0, 1) === '-' && mainTimer.substring(2, 3) !== '0' && mainTimer.substring(4, 6) === '10') {
                file = 'startRound' + currentRoundId + 'In' + mainTimer.substring(2, 3) + 'minutes';
            } else if (mainTimer.substring(0, 1) === '0' && mainTimer.substring(1, 2) !== '9' && mainTimer.substring(3, 5) === '50') {
                file = 'changeSides-Round' + currentRoundId + 'In' + (10 - mainTimer.substring(1, 2)) + 'minutes';
            } else if (mainTimer.substring(0, 1) === '1' && mainTimer.substring(1, 2) !== '9' && mainTimer.substring(3, 5) === '50') {
                file = 'endRound' + currentRoundId + 'In' + (10 - mainTimer.substring(1, 2)) + 'minutes';
            }
        }

        switch (mainTimer) {
            case '-00:20':
            case '09:40':
            case '19:40':
                file = 'countdown9and8and7and6and5and4and3and2and1and0';
                break;

            case '-05:10':
                file = 'startRound' + currentRoundId + 'In5minutes';
                break;
            case '-03:10':
                file = 'startRound' + currentRoundId + 'In3minutes';
                break;
            case '-01:10':
                file = 'startRound' + currentRoundId + 'In1minute';
                break;
            case '-00:10':
                file = 'startRound' + currentRoundId;
                break;

            case '08:50':
                file = 'changeSides-In1minute';
                break;
            case '09:50':
                file = 'changeSides';
                break;

            case '18:50':
                file = 'endIn1minute';
                break;
            case '19:20':
                file = 'endIn30seconds';
                break;
            case '19:49':
                file = 'endRound' + currentRoundId;
                break;
        }
        //console.log(currentRoundId);
        return file;
    }

    async function playSound(mainTimer) {
        let file = getSoundFileName(mainTimer);

        if (mainTimer.substring(mainTimer.length - 1) === '5') file = ' '; // reset status text file after 5 sec
        if (mainTimer === '19:59') await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 sec

        if (0 && file) {
            setSoundFile(file);
            if (file !== ' ') {
                Speech.speak(file, {rate: 0.6});
            }
        }

        try {
            if (file && file !== ' ') {
                setSoundFile(file);
                const sound = new Audio.Sound();
                await sound.loadAsync(
                    require('./../../assets/sounds/alam.mp3'),
                    {shouldPlay: true});
                await sound.setPositionAsync(0);
                await sound.playAsync();
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            <View style={{position: 'absolute', right: 5, top: 5}}>
                <Text>{format(now, "HH:mm:ss")}</Text>
            </View>
            <Pressable
                style={[styles.button1, styles.buttonBigBB1, (autoPilot ? styles.buttonRed : styles.buttonGreen)]}
                onPress={() => setAutoPilot(!autoPilot)}>
                <Text numberOfLines={1} style={styles.textButton1}>
                    Auto-Pilot {autoPilot ? 'ausschalten' : 'einschalten'}
                </Text>
            </Pressable>
            {isLoading ? null :
                (data?.status === 'success' && data?.object?.rounds?.length > 0 ? (
                    <TableView appearance="light">
                        <Section header={global.currentDayName}>
                            {data.object.rounds.map(item => (
                                <View key={item.id}>
                                    <Cell
                                        title={'Spielrunde ' + item.id + ' um ' + DateFunctions.getFormatted(item.timeStart) + ' Uhr'}
                                        titleTextColor={item.id === currentRoundId ? 'red' : null}
                                    />
                                    {item.id === currentRoundId ?
                                        <View>
                                            {matchTime}
                                            <Text style={styles.textRankingStats}>{' ' + soundFile + ' '}</Text>
                                        </View>
                                        : null}
                                </View>
                            ))}
                        </Section>
                    </TableView>
                ) : <Text>Keine Spielrunden gefunden!</Text>)}
        </ScrollView>
    );
}

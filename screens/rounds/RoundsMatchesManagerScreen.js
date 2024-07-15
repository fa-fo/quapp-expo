import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Platform, Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useKeepAwake} from "expo-keep-awake";
import fetchApi from '../../components/fetchApi';
import CellVariantMatchesManager from "../../components/cellVariantMatchesManager";
import CellVariantMatchesManagerProblem from "../../components/cellVariantMatchesManagerProblem";
import {format} from "date-fns";
import * as Speech from 'expo-speech';
import styles from "../../assets/styles";
import * as DateFunctions from "../../components/functions/DateFunctions";
import * as SportFunctions from "../../components/functions/SportFunctions";

export default function RoundsMatchesManagerScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState(false);
    const [issuesLength, setIssuesLength] = useState(null);
    const [now, setNow] = useState(new Date());
    const [speecher, setSpeecher] = useState('');
    const [lastUpdate, setLastUpdate] = useState(null); // check for too long time not updated
    const problemsRef = useRef(null);

    if (Platform.OS !== 'web') {
        useKeepAwake()
    }

    useEffect(() => {
        setLoading(true);
        loadScreenData();

        return () => {
            setData(null);
            setLoading(false);
        };
    }, [navigation, route]);

    useEffect(() => {
        const interval1 = setInterval(() => {
            loadScreenData();
        }, 3000);

        const interval2 = setInterval(() => {
            getTime();
        }, 1000);

        return () => {
            clearInterval(interval1);
            clearInterval(interval2);
        };
    }, [])

    function getTime() {
        let n = new Date();
        global.criticalIssuesCount = 0;
        setNow(n);
    }

    const loadScreenData = () => {
        fetchApi('matches/byRound/0/1/0/0/10') // offset: 10
            .then((json) => {
                global.criticalIssuesCount = 0;
                setData(json);

                let then = new Date();
                then.setSeconds(Number(parseInt(then.getSeconds().toString()) + 10));
                setLastUpdate(then);

                navigation.setOptions({headerRight: () => null}); // needed for iOS
                navigation.setOptions({
                    headerRight: () => (
                        <Text>
                            <Pressable style={[styles.buttonTopRight, styles.buttonOrange]}
                                       onPress={() => navigation.navigate('RoundsMatchesSupervisor', {
                                           id: json.object?.round?.id,
                                           roundsCount: route.params.roundsCount,
                                       })}
                            >
                                <Text
                                    style={styles.textButtonTopRight}>{'zur klassischen Ansicht'}</Text>
                            </Pressable>
                        </Text>
                    ),
                });
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        setIssuesLength(getIssuesLength());
    }, [data]);

    function getIssuesLength() {
        return data ? parseInt((problemsRef?.current?.childNodes?.length ?? 0)  // for Web
            + (problemsRef?.current?._children?.length ?? 0))   // for Android
            : null
    }

    useEffect(() => {
        if (issuesLength !== null) {
            let s = global.criticalIssuesCount > 0 ? global.criticalIssuesCount
                : ('ok and ' + issuesLength.toString());
            global.criticalIssuesCount = 0;
            setSpeecher(s);
        }
    }, [data, now]);

    useEffect(() => {
        if (speecher !== '') {
            let min = parseInt(format(now, "mm")) % 30;
            let sec = parseInt(format(now, "ss"));

            if (([26, 27, 28, 29, 0, 1, 2].includes(min) && [10, 30, 50].includes(sec)) // before match start
                || (min < 20 && min > 2 && [20, 50].includes(sec))) { // during the match

                if ([27, 28, 29, 9, 19].includes(min)) {
                    Speech.speak(min.toString() + ' min ' + sec.toString(), {rate: 1.5, language: 'de'});
                }

                setTimeout(() => {
                    Speech.speak(speecher.toString(), {rate: 1.5, language: 'en'});
                }, 2000);
            }
        }
    }, [now]);

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}
            style={lastUpdate && data && now > lastUpdate ? styles.buttonRed
                : issuesLength === 0 ? styles.buttonGreen : null}
        >
            <View style={{alignItems: 'flex-end', paddingTop: 4, paddingRight: 8}}>
                <Text>{format(now, "HH:mm:ss")}</Text>
            </View>
            {isLoading ? null :
                (data?.status === 'success' ?
                    <View>
                        <View style={styles.matchflexRowView}>
                            <View style={{flex: 3}}>
                                <Text
                                    style={{
                                        color: 'orange',
                                        alignSelf: 'center'
                                    }}>
                                    {'Runde ' + data.object.round?.id + ' um '
                                    + DateFunctions.getFormatted(data.object.round['timeStartDay' + data.year.settings.currentDay_id]) + ' Uhr'}
                                </Text>
                                <View ref={problemsRef}>
                                    {data.object.groups?.map(group =>
                                        group.matches.map(item => (
                                            <CellVariantMatchesManagerProblem
                                                key={item.id}
                                                item={item}
                                            />
                                        ))
                                    )}
                                </View>
                                {issuesLength === 0 ?
                                    <Text style={{fontSize: 32}}>Spielbetrieb läuft ohne Probleme!</Text>
                                    : null}
                            </View>
                            <View style={{flex: 1}}>
                                {data.object.groups?.map(group =>
                                    group.matches.map((item, i) => (
                                        <Pressable
                                            key={item.id}
                                            onPress={() => navigation.navigate('MatchDetailsSupervisor', {item})}>
                                            <CellVariantMatchesManager
                                                i={i}
                                                item={item}
                                            />
                                        </Pressable>
                                    ))
                                )}
                            </View>
                        </View>
                        {SportFunctions.getRemarksAdmin(data.object.remarks)}
                    </View>
                    : <Text>Fehler: keine Spiele gefunden!</Text>)}
        </ScrollView>
    );
}

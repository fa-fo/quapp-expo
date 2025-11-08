import TextC from "../../components/customText";
import {useEffect, useRef, useState} from 'react';
import {Platform, RefreshControl, ScrollView, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useKeepAwake} from "expo-keep-awake";
import fetchApi from '../../components/fetchApi';
import CellVariantMatchesManager from "../../components/cellVariantMatchesManager";
import CellVariantMatchesManagerProblem from "../../components/cellVariantMatchesManagerProblem";
import {format} from "date-fns";
//import * as Speech from 'expo-speech';
import {style} from "../../assets/styles";
import * as DateFunctions from "../../components/functions/DateFunctions";
import * as SportFunctions from "../../components/functions/SportFunctions";
import {useAutoReload} from "../../components/useAutoReload";
import {setHeaderRightOptions} from "../../components/setHeaderRightOptions";

export default function RoundsMatchesManagerScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState(false);
    const [issuesLength, setIssuesLength] = useState(null);
    const [now, setNow] = useState(new Date());
    const [speecher, setSpeecher] = useState('');
    const [lastUpdate, setLastUpdate] = useState(null); // check for too long time not updated
    const problemsRef = useRef(null);

    function getTime() {
        let n = new Date();
        global.criticalIssuesCount = 0;
        setNow(n);
    }

    function getIssuesLength() {
        return data ? parseInt((problemsRef?.current?.childNodes?.length ?? 0)  // for Web
                + (problemsRef?.current?._children?.length ?? 0))   // for Android
            : null
    }

    const loadScreenData = () => {
        fetchApi('matches/byRound/0/1/0/0/10') // offset: 10
            .then((json) => {
                global.criticalIssuesCount = 0;
                setData(json);

                let then = new Date();
                then.setSeconds(Number(parseInt(then.getSeconds().toString()) + 10));
                setLastUpdate(then);

                setHeaderRightOptions(navigation, route, json, loadScreenData);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    if (Platform.OS !== 'web') {
        useKeepAwake()
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getTime();
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        setLoading(true);
        loadScreenData();

        return () => setData(null);
    }, []);

    useAutoReload(route, data, loadScreenData);

    useEffect(() => {
        setIssuesLength(getIssuesLength());
    }, [data]);

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
                    //Speech.speak(min.toString() + ' min ' + sec.toString(), {rate: 1.5, language: 'de'});
                }

                setTimeout(() => {
                    //Speech.speak(speecher.toString(), {rate: 1.5, language: 'en'});
                }, 2000);
            }
        }
    }, [now]);

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}
            style={lastUpdate && data && now > lastUpdate ? style().buttonRed
                : issuesLength === 0 ? style().buttonGreenLight : null}
        >
            <View style={{alignItems: 'flex-end', paddingTop: 4, paddingRight: 8}}>
                <TextC style={style().big3}>{format(now, "HH:mm:ss")}</TextC>
            </View>
            {isLoading ? null :
                (data?.status === 'success' && data.object.round ?
                    <View>
                        <View style={style().matchflexRowView}>
                            <View style={{flex: 3}}>
                                <TextC
                                    style={{
                                        color: 'orange',
                                        alignSelf: 'center',
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        marginBottom: 14,
                                        shadowOffset: {width: 5, height: 5},
                                        shadowColor: 'orange',
                                        shadowRadius: 4,
                                        shadowOpacity: 0.4,
                                        backgroundColor: "white"
                                    }}>
                                    {' Runde ' + data.object.round.id + ' um '
                                        + DateFunctions.getFormatted(data.year.day + ' '
                                            + data.object.round['timeStartDay'
                                            + data.year.settings.currentDay_id]) + ' Uhr '}
                                </TextC>
                                <View ref={problemsRef}>
                                    {data.object.groups ? data.object.groups.map(group =>
                                        group.matches ? group.matches.map(item => (
                                            <CellVariantMatchesManagerProblem
                                                key={item.id}
                                                item={item}
                                            />
                                        )) : null
                                    ) : null}
                                </View>
                                {issuesLength === 0 ?
                                    <TextC style={{fontSize: 32}}>Spielbetrieb läuft ohne Probleme!</TextC>
                                    : null}
                            </View>
                            <View style={{flex: 1}}>
                                {data.object.groups ? data.object.groups.map((group, groupIndex) =>
                                    group.matches.length ? group.matches.map((item, matchIndex) => (
                                        <CellVariantMatchesManager
                                            key={item.id}
                                            groupIndex={groupIndex}
                                            matchIndex={matchIndex}
                                            item={item}
                                        />
                                    )) : null
                                ) : null}
                            </View>
                        </View>
                        {SportFunctions.getRemarksAdmin(data.object.remarks)}
                    </View>
                    : <TextC>Keine Spiele gefunden! currentRoundId: {data.object?.currentRoundId}</TextC>)}
        </ScrollView>
    );
}

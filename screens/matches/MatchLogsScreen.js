import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, KeyboardAvoidingView, Pressable, ScrollView, Text, TextInput, View} from 'react-native';
import {useIsFocused, useRoute} from '@react-navigation/native';
import fetchApi from '../../components/fetchApi';
import MatchLogsAddEventModal from './modals/MatchLogsAddEventModal';
import MatchLogsCancelEventModal from './modals/MatchLogsCancelEventModal';
import FouledOutModal from "../../components/modals/FouledOutModal";
import DoubleYellowModal from "../../components/modals/DoubleYellowModal";
import * as ScoreAsyncStorageFunctions from "../../components/functions/ScoreAsyncStorageFunctions";
import * as FoulFunctions from '../../components/functions/FoulFunctions';
import IconIon from "react-native-vector-icons/Ionicons";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import {format} from "date-fns";
import {useKeepAwake} from 'expo-keep-awake';
import styles from '../../assets/styles.js';

export default function MatchLogsScreen({navigation}) {
    useKeepAwake();
    const isFocused = useIsFocused();
    const route = useRoute();
    const scrollRef = useRef();
    const [isLoading, setLoading] = useState(true);
    const [isSendingEvent, setIsSendingEvent] = useState(false);
    const [allEvents, setAllEvents] = useState([]);
    const [liveLogsCalc, setLiveLogsCalc] = useState(route.params.item.logsCalc);
    const [submitData, setSubmitData] = useState({'teamId': null});
    const [remarks, setRemarks] = useState('');
    const [diff, setDiff] = useState(0);
    const [showBlinking, setShowBlinking] = useState(true);
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);

    const [addEvent, setAddEvent] = useState(false);
    const [addEventDirectly, setAddEventDirectly] = useState(false);
    const [addEventModalVisible, setAddEventModalVisible] = useState(false);
    const [cancelEventDirectly, setCancelEventDirectly] = useState(false);
    const [cancelEventModalVisible, setCancelEventModalVisible] = useState(false);
    const [fouledOutModalVisible, setFouledOutModalVisible] = useState(false);
    const [doubleYellowModalVisible, setDoubleYellowModalVisible] = useState(false);

    function setNextSendAlive() {
        global.nextSendAliveTime = new Date();
        global.nextSendAliveTime.setSeconds(Number(parseInt(global.nextSendAliveTime.getSeconds()) + 20));
    }

    useEffect(() => {
        return navigation.addListener('focus', () => {
            setNextSendAlive(); // initial
        });
    }, [route]);

    // auto-logout
    useEffect(() => {
        if (isFocused && liveLogsCalc && liveLogsCalc.isLoggedIn !== 1 && !liveLogsCalc.isMatchConcluded) {
            navigation.goBack(); // send logout and go back via before listener
        }
    }, [isFocused, liveLogsCalc, navigation]);

    // send alive message
    useEffect(() => {
        setDiff(0);

        const interval = setInterval(() => {
            let now = new Date();
            if (now > global.nextSendAliveTime && isFocused && !liveLogsCalc?.isMatchConcluded) {
                let postData = {
                    'refereePIN': global['refereePIN' + route.params.item.id],
                    'matchEventCode': 'IS_ALIVE',
                    'datetimeSent': format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };

                fetchApi('matcheventLogs/add/' + route.params.item.id, 'POST', postData)
                    .then((json) => {
                        if (json.status === 'success') {
                            setLiveLogsCalc(json.object);
                            setNextSendAlive();
                        }
                    })
                    .catch((error) => console.error(error));
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [liveLogsCalc, isFocused]);

    // interval for suspension time difference since last api-call
    useEffect(() => {
        const interval = setInterval(() => {
            setDiff(diff + 1);
        }, 1000);

        if (liveLogsCalc?.showFoulOutModal) {
            liveLogsCalc.showFoulOutModal = 0;
            setFouledOutModalVisible(true)
        } else if (liveLogsCalc?.showDoubleYellowModal) {
            liveLogsCalc.showDoubleYellowModal = 0;
            setDoubleYellowModalVisible(true)
        }

        return () => clearInterval(interval);
    }, [liveLogsCalc, diff]);

    // set Score
    useEffect(() => {
        if (isSendingEvent === false) {
            ScoreAsyncStorageFunctions.getScore()
                .then(response => response !== null ? response.toString() : null)
                .then((string) => {
                    let json = string !== null ? JSON.parse(string) : null;
                    if (json && json[route.params.item.id]) {
                        setScore1(parseInt(json[route.params.item.id][route.params.item.team1_id]) || 0);
                        setScore2(parseInt(json[route.params.item.id][route.params.item.team2_id]) || 0);
                    }
                })
                .catch((error) => console.error(error));
        }
    }, [allEvents, isSendingEvent]);

    useEffect(() => {
        // add log directly without modal
        function addMatcheventlogDirectly(data) {
            if (addEventDirectly.code.substring(0, 9) !== 'ON_PLACE_') {
                setIsSendingEvent(true); // prevent accidentally multiple clicks
            }
            let postData = {
                'refereePIN': global['refereePIN' + route.params.item.id],
                'matchEventCode': addEventDirectly.code,
                'datetimeSent': format(new Date(), "yyyy-MM-dd HH:mm:ss"),
            };
            if (data.teamId) {
                postData = {'team_id': data.teamId, ...postData};
                ScoreAsyncStorageFunctions.setScore(addEventDirectly.code, route.params.item.id, data.teamId);
            }

            fetchApi('matcheventLogs/add/' + route.params.item.id, 'POST', postData)
                .then((json) => {
                    if (addEventDirectly.code === 'LOGOUT') {
                        if (addEventDirectly.fromListener) {
                            // came to here from beforeListener: no further function necessary
                        } else {
                            navigation.goBack(); // from logout button after match conclude
                        }
                    } else if (json.status === 'success') {
                        setLiveLogsCalc(json.object);
                        setNextSendAlive();
                    }
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    setTimeout(() => { // wait for setScore before trigger setScore1 and setScore2
                        setIsSendingEvent(false);
                    }, 500);
                });
        }

        if (addEventDirectly.code) {
            addMatcheventlogDirectly(submitData);
        }

        // initial
        if (allEvents.length === 0) {
            fetchApi('matchevents/all/')
                .then((json) => {
                    ScoreAsyncStorageFunctions.syncScore(route.params.item, route.params.item.logsCalc.score);
                    setAllEvents(json);
                })
                .catch((error) => console.error(error))
                .finally(() => setLoading(false));
        }

        return () => {
            setSubmitData(false);
            setAddEvent(false);
            setAddEventDirectly(false);
            setAddEventModalVisible(false);
            setCancelEventModalVisible(false);
        };
    }, [navigation, allEvents, addEventDirectly]);

    useEffect(() => {
        if (allEvents.object) {
            navigation.addListener('beforeRemove', (e) => {
                if (isFocused) {
                    e.preventDefault();
                    let logoutEvent = allEvents.object.find(x => x.code === 'LOGOUT');
                    logoutEvent.fromListener = 1;

                    setAddEventDirectly(logoutEvent);
                    setTimeout(() => {
                        navigation.dispatch(e.data.action)
                    }, 500); // wait because of sending LOGOUT event
                }
            });

            return () => {
                navigation.removeListener('beforeRemove');
            };
        }
    }, [navigation, allEvents, isFocused]);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setShowBlinking(!!(++i % 2));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (showButtonArrow(liveLogsCalc)) {
            scrollRef.current?.scrollToEnd();
        }
    }, [liveLogsCalc]);

    useEffect(() => {
        // cancel log directly without modal
        function cancelMatcheventlogDirectly() {
            if (cancelEventDirectly.code.substring(0, 9) !== 'ON_PLACE_') {
                setIsSendingEvent(true); // prevent accidentally multiple clicks
            }
            let postData = {
                'refereePIN': global['refereePIN' + route.params.item.id],
                'matchEventCode': cancelEventDirectly.code,
            };

            fetchApi('matcheventLogs/cancel/' + route.params.item.id + '/0', 'POST', postData)
                .then((json) => {
                    if (json.status === 'success') {
                        setLiveLogsCalc(json.object);
                        setNextSendAlive();
                    }
                })
                .catch((error) => console.error(error))
                .finally(() => setIsSendingEvent(false));
        }

        if (cancelEventDirectly.code && isCancelButton(cancelEventDirectly.code)) {
            cancelMatcheventlogDirectly();
        }

        return () => {
            setCancelEventDirectly(false);
        };
    }, [cancelEventDirectly]);

    let showButtonArrow = function (liveLogsCalc) {
        return !!(
            (liveLogsCalc.isMatchReadyToStart && !liveLogsCalc.isMatchStarted)
            || (liveLogsCalc.isTime2confirm && liveLogsCalc.isMatchStarted && !liveLogsCalc.isMatchEnded)
            || (liveLogsCalc.isMatchEnded && liveLogsCalc.teamWon !== undefined && !liveLogsCalc.isMatchConcluded)
        );
    };

    let showRelatedOnMatchPhase = function (code) {
        return !!(
            (code.substring(0, 9) === 'ON_PLACE_' && !liveLogsCalc.isMatchStarted)
            || (code === 'MATCH_START' && liveLogsCalc.isMatchReadyToStart && !liveLogsCalc.isMatchStarted)
            || (
                (code.substring(0, 5) === 'GOAL_'
                    || code.substring(0, 5) === 'FOUL_'
                    || code === 'MATCH_END')
                && liveLogsCalc.isMatchStarted && !liveLogsCalc.isMatchEnded
            )
            || (code.substring(0, 11) === 'RESULT_WIN_' && liveLogsCalc.isMatchEnded && !liveLogsCalc.isMatchConcluded)
            || (code === 'MATCH_CONCLUDE' && liveLogsCalc.teamWon !== undefined && !liveLogsCalc.isMatchConcluded)
            || (code === 'LOGOUT' && liveLogsCalc.isMatchConcluded)
        );
    };

    let showRelatedOnSports = function (showOnSportsOnly) {
        return !!(
            showOnSportsOnly === null
            || route.params.item.sport_id === showOnSportsOnly
            || (showOnSportsOnly < 0 && route.params.item.sport_id !== (showOnSportsOnly * (-1)))
        );
    };

    let getButtonBorderWidth = function (code) {
        let width = 4;
        switch (code) {
            case 'RESULT_WIN_NONE':
                if ((liveLogsCalc.score ? (parseInt(liveLogsCalc.score[route.params.item.team1_id]) || 0) : 0) === (liveLogsCalc.score ? (parseInt(liveLogsCalc.score[route.params.item.team2_id]) || 0) : 0))
                    return width;
                break;
            case 'RESULT_WIN_TEAM1':
                if ((liveLogsCalc.score ? (parseInt(liveLogsCalc.score[route.params.item.team1_id]) || 0) : 0) > (liveLogsCalc.score ? (parseInt(liveLogsCalc.score[route.params.item.team2_id]) || 0) : 0))
                    return width;
                break;
            case 'RESULT_WIN_TEAM2':
                if ((liveLogsCalc.score ? (parseInt(liveLogsCalc.score[route.params.item.team1_id]) || 0) : 0) < (liveLogsCalc.score ? (parseInt(liveLogsCalc.score[route.params.item.team2_id]) || 0) : 0))
                    return width;
                break;
        }
        return 0;
    }

    let getButtonStyle = function (code, tagName) {
        if ((code === 'ON_PLACE_REF' && !liveLogsCalc.isRefereeOnPlace)
            || (code === 'ON_PLACE_TEAM1' && !liveLogsCalc.isTeam1OnPlace)
            || (code === 'ON_PLACE_TEAM2' && !liveLogsCalc.isTeam2OnPlace)) {
            return tagName === 'Text' ? styles.textButton1 : styles.buttonGreyDark;

        } else if ((code === 'RESULT_WIN_NONE' && liveLogsCalc.teamWon !== 0)
            || (code === 'RESULT_WIN_TEAM1' && liveLogsCalc.teamWon !== 1)
            || (code === 'RESULT_WIN_TEAM2' && liveLogsCalc.teamWon !== 2)) {
            return tagName === 'Text' ? styles.textButton1 : [styles.buttonGreyDark, {borderWidth: getButtonBorderWidth(code)}];

        } else if (code.substring(0, 5) === 'FOUL_') {
            return tagName === 'Text' ? [styles.textButton1, styles.textButtonFoul, {textDecorationColor: FoulFunctions.getFoulColor(code)}] : styles.buttonGrey;

        } else if (code === 'MATCH_START' || code === 'MATCH_END' || code === 'MATCH_CONCLUDE') {
            return tagName === 'Text' ? [styles.textButton1, showButtonArrow(liveLogsCalc) ? styles.big3 : null] : styles.buttonGreen;

        } else {
            return tagName === 'Text' ? styles.textButton1 : styles.buttonGreen;
        }
    };

    let getButtonIcon = function (code) {
        switch (code) {
            case 'ON_PLACE_REF':
                return <IconMat
                    name={liveLogsCalc.isRefereeOnPlace ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                    size={30}/>
            case 'ON_PLACE_TEAM1':
                return <IconMat
                    name={liveLogsCalc.isTeam1OnPlace ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                    size={30}/>
            case 'ON_PLACE_TEAM2':
                return <IconMat
                    name={liveLogsCalc.isTeam2OnPlace ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                    size={30}/>
            case 'GOAL_1POINT':
                switch (route.params.item.sport.code) {
                    case 'BB':
                        return <IconIon name="basketball" size={15}/>
                    case 'FB':
                        return <IconIon name="football" size={15}/>
                    case 'HB':
                        return <IconIon name="football-outline" size={15}/>
                    case 'VB':
                        return <IconMat name="volleyball" size={15}/>
                    default:
                        return null;
                }
            case 'GOAL_2POINT':
                return <Text>
                    <IconIon name="basketball" size={15}/>
                    <IconIon name="basketball" size={15}/>
                </Text>
            case 'GOAL_3POINT':
                return <Text>
                    <IconIon name="basketball" size={15}/>
                    <IconIon name="basketball" size={15}/>
                    <IconIon name="basketball" size={15}/>
                </Text>
            case 'FOUL_CARD_YELLOW':
            case 'FOUL_CARD_RED_FB':
            case 'FOUL_CARD_RED_HB':
            case 'FOUL_CARD_RED_VB':
                return <IconMat name="cards" size={15} style={{color: FoulFunctions.getFoulColor(code)}}/>
            case 'FOUL_SUSP_FB':
            case 'FOUL_SUSP_HB':
                return <IconMat name="hand-peace" size={15} style={{color: FoulFunctions.getFoulColor(code)}}/>
            case 'MATCH_START':
            case 'MATCH_CONCLUDE':
                return <IconMat name="arrow-right" size={30}
                                style={{color: showBlinking ? '#fff' : '#3d8d02'}}/>
            case 'MATCH_END':
                return <IconMat name="arrow-right" size={30}
                                style={{color: liveLogsCalc.isTime2confirm && showBlinking ? '#fff' : '#3d8d02'}}/>
            case 'RESULT_WIN_NONE':
                return <IconMat
                    name={liveLogsCalc.teamWon === 0 ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                    size={30}/>
            case 'RESULT_WIN_TEAM1':
                return <IconMat
                    name={liveLogsCalc.teamWon === 1 ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                    size={30}/>
            case 'RESULT_WIN_TEAM2':
                return <IconMat
                    name={liveLogsCalc.teamWon === 2 ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                    size={30}/>
            case 'LOGOUT':
                return <IconMat name="logout" size={30}/>
            default:
                return null;
        }
    };

    let getButtonText = function (code, name) {
        return (
            code === 'GOAL_1POINT' && route.params.item.sport.name === 'Basketball') ? '1 Punkt'
            : (code === 'GOAL_1POINT' && route.params.item.sport.name === 'Volleyball') ? 'Punktgewinn'
                : name.replace(/: /i, ':\n').replace(/Team 1/i, route.params.item.teams1.name).replace(/Team 2/i, route.params.item.teams2.name)
    };

    let getButtonSize = function (code) {
            if (code === 'GOAL_1POINT' && route.params.item.sport.name !== 'Basketball') {
                return styles.buttonBigBB3;
            } else if (code === 'GOAL_1POINT' && route.params.item.sport.name === 'Basketball') {
                return styles.buttonBigBB1;
            } else if (code === 'GOAL_2POINT' && route.params.item.sport.name === 'Basketball') {
                return styles.buttonBigBB2;
            } else if (code === 'GOAL_3POINT' && route.params.item.sport.name === 'Basketball') {
                return styles.buttonBigBB3;
            } else if (
                code === 'MATCH_START'
                || code === 'MATCH_END'
                || code === 'MATCH_CONCLUDE'
                || code === 'LOGOUT'
            ) {
                return styles.buttonBig1;
            } else {
                return '';
            }
        }
    ;

    let isButtonDisabled = function (code) {
            return !!(
                (code === 'RESULT_WIN_NONE' && liveLogsCalc.teamWon === 0)
                || (code === 'RESULT_WIN_TEAM1' && liveLogsCalc.teamWon === 1)
                || (code === 'RESULT_WIN_TEAM2' && liveLogsCalc.teamWon === 2)
                || isSendingEvent
            );
        }
    ;

    let isCancelButton = function (code) {
            return !!(
                (code === 'ON_PLACE_REF' && liveLogsCalc.isRefereeOnPlace)
                || (code === 'ON_PLACE_TEAM1' && liveLogsCalc.isTeam1OnPlace)
                || (code === 'ON_PLACE_TEAM2' && liveLogsCalc.isTeam2OnPlace)
            );
        }
    ;

    function getButton(eventItem, teamId, teamName) {
        return (
            <Pressable
                style={[styles.button1, styles.buttonEvent, {width: '80%'},
                    getButtonStyle(eventItem.code, 'Pressable'),
                    getButtonSize(eventItem.code)]}
                onPress={async () => {
                    if (eventItem.logsAddableWithoutModal) {
                        if (teamId !== null) {
                            await setSubmitData({'teamId': teamId});
                        }
                        if (isCancelButton(eventItem.code)) {
                            setCancelEventDirectly(eventItem);
                        } else {
                            setAddEventDirectly(eventItem);
                        }
                    } else {
                        setAddEvent(eventItem);
                        setAddEventModalVisible(true);
                    }
                }}
                disabled={isButtonDisabled(eventItem.code)}
            >
                <Text
                    style={getButtonStyle(eventItem.code, 'Text')}
                    numberOfLines={eventItem.code.substring(0, 5) === 'FOUL_' ? 1 : 2}
                >
                    {getButtonIcon(eventItem.code)}
                    {getButtonText(eventItem.code, eventItem.name)}
                    {teamName !== null ? '\n' : null}
                    {teamName !== null ? <Text numberOfLines={1}>{teamName}</Text> : null}
                </Text>
            </Pressable>
        );
    }

    return (
        (liveLogsCalc ?
            <ScrollView ref={scrollRef} contentContainerStyle={styles.matchDetailsView}>
                <View style={styles.matchflexRowView}>
                    <View style={{flex: 5}}>
                        <Text style={styles.big2} numberOfLines={2}
                              adjustsFontSizeToFit>{route.params.item.teams1.name}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={styles.big2}>-</Text>
                    </View>
                    <View style={{flex: 5}}>
                        <Text style={styles.big2} numberOfLines={2}
                              adjustsFontSizeToFit>{route.params.item.teams2.name}</Text>
                    </View>
                </View>
                <View style={styles.matchflexEventsView}>
                    <Text adjustsFontSizeToFit>{liveLogsCalc.isMatchEnded ? 'Endstand' : 'Spielstand'}:</Text>
                    <View style={styles.matchflexRowView}>
                        <View style={{flex: 5}}>
                            <Text
                                style={[styles.big1, styles.textRed]}>{score1}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={[styles.big1, styles.textRed]}>{isSendingEvent ?
                                <ActivityIndicator size="large" color="#00ff00"/> : ':'}</Text>
                        </View>
                        <View style={{flex: 5}}>
                            <Text
                                style={[styles.big1, styles.textRed]}>{score2}</Text>
                        </View>
                    </View>
                    {liveLogsCalc.isMatchLive
                    && liveLogsCalc.inserted_id
                    && liveLogsCalc.score !== undefined
                    && (isSendingEvent ||
                        (score1 <= (parseInt(liveLogsCalc.score[route.params.item.team1_id]) || 0)
                            && score2 <= (parseInt(liveLogsCalc.score[route.params.item.team2_id]) || 0)))
                        ?
                        <View style={styles.matchPressableView}>
                            <Pressable
                                style={[styles.button1, styles.buttonConfirm, styles.buttonGreyBright, {width: '50%'}]}
                                onPress={() => {
                                    setCancelEventModalVisible(true);
                                }}
                            >
                                <Text numberOfLines={1} style={styles.small}>
                                    <IconMat name="undo-variant" size={15}/> Letzte Eingabe rückgängig
                                </Text>
                            </Pressable>
                        </View>
                        : null}
                </View>
                <KeyboardAvoidingView style={styles.matchflexEventsView}>
                    {!liveLogsCalc.isMatchStarted ?
                        <Text style={styles.big3}>{'Herzlich Willkommen zum heutigen Spiel!\n  '}</Text> : null}
                    {liveLogsCalc.isMatchConcluded ? <Text style={styles.big3}>Vielen Dank!</Text> : null}
                    {isLoading ? <ActivityIndicator size="large" color="#00ff00" style={styles.actInd}/> :
                        (allEvents.status === 'success' ?
                            allEvents.object.map(eventItem =>
                                showRelatedOnMatchPhase(eventItem.code) ?
                                    showRelatedOnSports(eventItem.showOnSportsOnly) ?
                                        <View key={eventItem.id} style={{width: '100%'}}>
                                            {eventItem.textHeaderBeforeButton !== null ?
                                                <Text>{eventItem.textHeaderBeforeButton}</Text> : null}
                                            {eventItem.code.substring(0, 5) === 'GOAL_' ? // two buttons (for each Team) for goals events
                                                <View style={styles.matchflexRowView}>
                                                    <View style={[styles.viewRight, {flex: 1}]}>
                                                        {getButton(eventItem, route.params.item.team1_id, route.params.item.teams1.name)}
                                                    </View>
                                                    <View style={[styles.viewLeft, {flex: 1}]}>
                                                        {getButton(eventItem, route.params.item.team2_id, route.params.item.teams2.name)}
                                                    </View>
                                                </View>
                                                :
                                                <View style={styles.matchflexRowView}>
                                                    {FoulFunctions.getFoulCards(liveLogsCalc, eventItem.code, route.params.item.team1_id, diff)}
                                                    <View style={[styles.viewCentered, {flex: 2}]}>
                                                        {getButton(eventItem, null, null)}
                                                    </View>
                                                    {FoulFunctions.getFoulCards(liveLogsCalc, eventItem.code, route.params.item.team2_id, diff)}
                                                </View>
                                            }
                                            {eventItem.code === 'RESULT_WIN_TEAM2' && liveLogsCalc.isMatchEnded && !liveLogsCalc.isMatchConcluded && liveLogsCalc.teamWon !== undefined ?
                                                <View>
                                                    <Text>Besondere Vorkommnisse bzw. Kommentar des
                                                        Schiedsrichters:</Text>
                                                    <TextInput
                                                        style={styles.textInput}
                                                        multiline={true}
                                                        numberOfLines={4}
                                                        onChangeText={setRemarks}
                                                        value={remarks}
                                                        placeholder="Hier eingeben"
                                                    />
                                                </View>
                                                : null}
                                        </View>
                                        : null : null
                            )
                            : <Text>Fehler!</Text>)}
                    {!liveLogsCalc.isMatchReadyToStart && !liveLogsCalc.isMatchStarted ?
                        <Text>Alle 3 Buttons müssen <Text style={styles.textGreen}>grün</Text> sein, damit es losgehen
                            kann!</Text>
                        : null}
                </KeyboardAvoidingView>

                <MatchLogsAddEventModal
                    match={route.params.item}
                    addEvent={addEvent}
                    setLiveLogsCalc={setLiveLogsCalc}
                    setAddEventModalVisible={setAddEventModalVisible}
                    addEventModalVisible={addEventModalVisible}
                    remarks={remarks}
                    setNextSendAlive={setNextSendAlive}
                    showBlinking={showBlinking}
                />
                <MatchLogsCancelEventModal
                    match={route.params.item}
                    lastInsertedId={liveLogsCalc.inserted_id}
                    setLiveLogsCalc={setLiveLogsCalc}
                    setCancelEventModalVisible={setCancelEventModalVisible}
                    cancelEventModalVisible={cancelEventModalVisible}
                    setNextSendAlive={setNextSendAlive}
                    setIsSendingEvent={setIsSendingEvent}
                />
                <FouledOutModal
                    setModalVisible={setFouledOutModalVisible}
                    modalVisible={fouledOutModalVisible}
                />
                <DoubleYellowModal
                    setModalVisible={setDoubleYellowModalVisible}
                    modalVisible={doubleYellowModalVisible}
                />
            </ScrollView>
            : null)
    );
}

import * as React from 'react';
import {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import styles from '../../assets/styles.js';
import {useRoute} from '@react-navigation/native';
import fetchApi from '../../components/fetchApi';
import MatchDetailsLoginModal from './modals/MatchDetailsLoginModal';
import * as ConfirmFunctions from "../../components/functions/ConfirmFunctions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as DateFunctions from "../../components/functions/DateFunctions";

export default function MatchDetailsScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        return navigation.addListener('focus', () => {
            setLoading(true);
            loadScreenData();
        });
    }, [route]);

    const loadScreenData = () => {
        fetchApi('matches/byId/' + route.params.item.id)
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        isLoading ? <ActivityIndicator size="large" color="#00ff00" style={styles.actInd}/> :
            (data.status === 'success' ?
                data.object.map(item =>
                    <ScrollView key={item.id}
                                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}
                                contentContainerStyle={styles.matchDetailsView}>
                        {global.settings.isTest && item.group.year.id === data.year.id ?
                            <Text style={styles.testMode}>{global.hintTestData}</Text> : null}
                        <Text>QuattFo {item.group.year.name}, Tag {item.group.day_id}</Text>
                        <Text>Runde {item.round.id}, Gruppe {item.group_name}</Text>
                        <Text style={styles.big2} numberOfLines={2} adjustsFontSizeToFit>{item.teams1.name}</Text>
                        <Text style={styles.small}>vs</Text>
                        <Text style={styles.big2} numberOfLines={2} adjustsFontSizeToFit>{item.teams2.name}</Text>
                        <Text> </Text>
                        <Text>SR: {item.teams3.name}</Text>
                        <Text> </Text>
                        <Text>Spielbeginn: {DateFunctions.getDateTimeFormatted(item.matchStartTime) + ' Uhr: '}</Text>
                        <Text style={styles.big3}>{item.sport.name} Feld {item.group_name}</Text>

                        {!item.logsCalc.isMatchStarted && !item.logsCalc.isResultConfirmed ?
                            <Text style={styles.big1}>_:_</Text>
                            : null}

                        {item.logsCalc.isResultConfirmed ?
                            <View>
                                {item.round.autoUpdateResults ?
                                    <View style={styles.viewCentered}>
                                        <Text style={styles.small}>Endstand</Text>
                                        <Text
                                            style={styles.big3}>{item.logsCalc.score ? parseInt(item.logsCalc.score[route.params.item.team1_id]) || 0 : 0} : {item.logsCalc.score ? parseInt(item.logsCalc.score[route.params.item.team2_id]) || 0 : 0}
                                        </Text>
                                        <Text style={styles.small}>nach Toren</Text>
                                        {item.resultTrend > 2 ? (
                                            <Text
                                                style={styles.textRed}>{ConfirmFunctions.getConfirmResultText(item.resultTrend)}-Wertung</Text>) : null}
                                        <Text> </Text>
                                        <Text style={styles.small}>Wertung mit Faktor {item.sport.goalFactor}</Text>
                                        <Text
                                            style={styles.big1}>{parseInt(item.resultGoals1) || 0} : {parseInt(item.resultGoals2) || 0}</Text>
                                        <Text>Ergebnis bestätigt</Text>
                                    </View>
                                    : <Text style={styles.textRed}>{global.hintAutoUpdateResults}</Text>}
                            </View> : null}

                        {item.logsCalc.isMatchStarted && !item.logsCalc.isResultConfirmed ?
                            <View style={styles.viewCentered}>
                                {item.round.autoUpdateResults || global.myTeamId === item.team1_id || global.myTeamId === item.team2_id ?
                                    <Text
                                        style={[styles.big1, styles.textRed]}>{item.logsCalc.score ? parseInt(item.logsCalc.score[route.params.item.team1_id] ?? 0) || 0 : 0} : {item.logsCalc.score ? parseInt(item.logsCalc.score[route.params.item.team2_id]) || 0 : 0}
                                    </Text>
                                    :
                                    <Text style={styles.textRed}>{global.hintAutoUpdateResults}</Text>
                                }
                                {item.logsCalc.isMatchLive ? <Text style={styles.textRed}>Live!</Text> : null}
                                {item.logsCalc.isMatchEnded ?
                                    <Text style={styles.textRed}>Spiel beendet</Text> : null}
                                {item.logsCalc.isMatchEnded && !item.logsCalc.isResultConfirmed ?
                                    <Text style={styles.textRed}>Ergebnis noch nicht bestätigt</Text> : null}
                            </View> : null}
                        <Text> </Text>
                        {item.canceled > 0 ? <Text style={styles.textRed}>Das Spiel fällt aus!</Text> : null}
                        {item.canceled === 1 || item.canceled === 3 ?
                            <Text style={styles.textRed}>{item.teams1.name} zurückgezogen</Text> : null}
                        {item.canceled === 2 || item.canceled === 3 ?
                            <Text style={styles.textRed}>{item.teams2.name} zurückgezogen</Text> : null}

                        {item.isTime2login
                        && !item.canceled
                        && !item.logsCalc.isMatchConcluded
                        && !item.logsCalc.isResultConfirmed ?
                            (window?.location?.hostname === 'api.quattfo.de' ? null
                                :
                                <Pressable
                                    style={[styles.button1, (item.logsCalc.isLoggedIn ? styles.buttonGrey : styles.buttonGreen)]}
                                    onPress={() => setModalVisible(true)}
                                    disabled={(!!item.logsCalc.isLoggedIn)}
                                >
                                    <Text style={styles.textButton1}>
                                        <Icon name="login" size={30}/>
                                        {(item.logsCalc.isLoggedIn ? 'Spielprotokollierung bereits gestartet' :
                                            (item.logsCalc.isMatchStarted ? 'Spielprotokollierung fortsetzen' :
                                                'Jetzt einloggen\nund Spielprotokollierung starten'))
                                        }
                                    </Text>
                                </Pressable>) : null}

                        <MatchDetailsLoginModal
                            setModalVisible={setModalVisible}
                            modalVisible={modalVisible}
                            navigation={navigation}
                            item={item}
                        />
                    </ScrollView>
                )
                : <Text>Fehler!</Text>)
    );
}

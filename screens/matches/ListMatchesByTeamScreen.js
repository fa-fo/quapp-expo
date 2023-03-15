import * as React from 'react';
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Section, TableView} from 'react-native-tableview-simple';
import CellVariantMatches from '../../components/cellVariantMatches';
import styles from '../../assets/styles.js';
import fetchApi from '../../components/fetchApi';
import setAsyncStorage from '../../components/setAsyncStorage';
import {setLocalPushNotifications} from "../../components/setLocalPushNotifications";
import * as DateFunctions from "../../components/functions/DateFunctions";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import * as ScoreAsyncStorageFunctions from "../../components/functions/ScoreAsyncStorageFunctions";

export default function ListMatchesByTeamScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [localScore, setLocalScore] = useState(null);

    let team_id_prev = 0; // previously called team_id
    let team_id = route.params?.item?.team_id ?? global.myTeamId;
    let team_name = route.params?.item?.team?.name ?? global.myTeamName;

    useEffect(() => {
        return navigation.addListener('focus', () => {
            if (team_id_prev !== team_id) {
                team_id_prev = team_id;
                setLoading(true);
                loadScreenData();
            }
        });
    }, [navigation, route]);

    const loadScreenData = () => {
        fetchApi('matches/byTeam/' + (team_id ?? 0) + '/' + (route.params?.year_id ?? 0) + '/' + (route.params?.day_id ?? 0) + (route.name === 'ListMatchesByTeamAdmin' ? '/1' : ''))
            .then((json) => {
                setData(json);

                // set MyTeam
                if (route.params?.setMyTeam && global.myTeamId !== (route.params?.item?.team_id ?? 0)) {
                    global.myTeamId = (route.params.item?.team_id ?? 0);
                    global.myTeamName = (route.params.item?.team?.name ?? '');
                    setAsyncStorage('myTeamId', global.myTeamId);
                    setAsyncStorage('myTeamName', global.myTeamName);

                    let postData = {
                        'my_team_id': global.myTeamId,
                        'expoPushToken': global.expoPushToken,
                    };

                    fetchApi('pushTokens/add', 'POST', postData)
                        .catch((error) => console.error(error));
                }

                if (global.myTeamId === team_id || (route.params?.setMyTeam && global.myTeamId === 0)) {
                    setLocalPushNotifications(json.object.matches);
                }

                if (json.year?.settings?.showLocalStorageScore) {
                    ScoreAsyncStorageFunctions.getScore()
                        .then(response => response !== null ? response.toString() : null)
                        .then((string) => {
                            let jsonScore = string !== null ? JSON.parse(string) : null;
                            setLocalScore(jsonScore);
                        })
                        .catch((error) => console.error(error));
                }
            })
            .catch((error) => {
                console.error(error)
                navigation.navigate('MyMatches', {screen: 'NoInternetModal'});
            })
            .finally(() => {
                setLoading(false);
                if (global.myTeamId === null) {
                    navigation.navigate('MyMatches', {screen: 'MyTeamSelect'});
                }
            });
    }

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (route.params?.setMyTeam && team_name === '' ?
                    <Text>Einstellung erfolgreich geändert: kein Team mehr ausgewählt</Text>
                    :
                    (data.status === 'success' ?
                            (data.object?.showTime ?
                                <Text>Zeitpunkt der Veröffentlichung des
                                    Spielplans: {DateFunctions.getDateTimeFormatted(data.object.showTime) + ' Uhr'}</Text>
                                :
                                (data.object.group && data.object.matches ?
                                        <TableView appearance="light">
                                            <Section headerComponent={
                                                <View>
                                                    <View style={[styles.matchflexRowView, styles.headerComponentView]}>
                                                        <View style={{flex: 2}}>
                                                            <Text>
                                                                {DateFunctions.getDateFormatted(data.yearSelected?.day ?? data.year.day)}
                                                                {'\n'}
                                                                {
                                                                    (team_name === global.myTeamName ? 'Mein Team: ' : '')
                                                                    + team_name + '\n'
                                                                    + 'Spielen in '}
                                                                <Text
                                                                    style={styles.textBlue}>{'Gruppe ' + data.object.group.group_name}</Text>{'\n'}
                                                                {data.yearSelected === undefined ?
                                                                    <Text>
                                                                        <Text
                                                                            style={styles.textViolet}>SR</Text>{' in Gruppe ' + data.object.referee_group_name}
                                                                    </Text>
                                                                    : null}
                                                            </Text>
                                                        </View>
                                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                                            <Pressable
                                                                style={styles.buttonTopRight}
                                                                onPress={() => navigation.navigate('RankingInGroups', {item: data.object.group})}
                                                            >
                                                                <Text style={styles.textButtonTopRight}
                                                                      numberOfLines={1}>
                                                                    <IconMat name="table-large"
                                                                             size={15}/>{' Tabelle Gr. ' + data.object.group.group_name}
                                                                </Text>
                                                            </Pressable>
                                                        </View>
                                                    </View>
                                                    {global.settings.isTest && data.yearSelected === undefined && route.name !== 'ListMatchesByTeamAdmin' ?
                                                        <View><Text
                                                            style={styles.testMode}>{global.hintTestData}</Text></View> : null}
                                                </View>
                                            }>
                                                {data.object.matches.map(item =>
                                                    (!item.isRefereeJob || data.yearSelected === undefined ?
                                                        <CellVariantMatches
                                                            key={item.id}
                                                            item={item}
                                                            timeText={DateFunctions.getFormatted(item.matchStartTime) + ' Uhr: '}
                                                            team1Result={item.resultGoals1 !== null ? (parseInt(item.resultGoals1) || 0) : null}
                                                            team2Result={item.resultGoals2 !== null ? (parseInt(item.resultGoals2) || 0) : null}
                                                            isMyTeam={(item.team1_id === global.myTeamId ? 1 : (item.team2_id === global.myTeamId ? 2 : 0))}
                                                            isRefereeJob={item.isRefereeJob ? 1 : 0}
                                                            localScore={localScore ? localScore[item.id] : null}
                                                            onPress={() => route.name !== 'ListMatchesByTeamAdmin' ? navigation.navigate('MatchDetails', {item}) : null}
                                                        /> : null)
                                                )}
                                            </Section>
                                        </TableView>
                                        :
                                        data.year.currentDay_id === 1 ?
                                            <View>
                                                <Text>Team nicht gefunden!</Text>
                                                {team_name === global.myTeamName ?
                                                    <View>
                                                        <Text>Bitte Team neu auswählen:</Text>
                                                        <Pressable style={[styles.button1, styles.buttonGreen]}
                                                                   onPress={() => navigation.navigate('MyTeamSelect')}>
                                                            <Text
                                                                style={styles.textButton1}>{'Mein Team auswählen'}</Text>
                                                        </Pressable>
                                                    </View>
                                                    : null}
                                            </View>
                                            :
                                            <View>
                                                <Text>Der Spielplan ist derzeit noch in Bearbeitung und wird in Kürze
                                                    veröffentlicht!</Text>
                                            </View>
                                ))
                            :
                            <Text>Fehler: keine Spiele gefunden!</Text>
                    ))
            }
        </ScrollView>
    );
}

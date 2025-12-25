import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Section, TableView} from 'react-native-tableview-simple';
import CellVariantMatches from '../../components/cellVariantMatches';
import {style} from '../../assets/styles.js';
import fetchApi from '../../components/fetchApi';
import * as AsyncStorageFunctions from "../../components/functions/AsyncStorageFunctions";
import * as DateFunctions from "../../components/functions/DateFunctions";
import * as PushFunctions from "../../components/functions/PushFunctions";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import MyTeamSelectModal from "../initials/modals/MyTeamSelectModal";
import {useAutoReload} from "../../components/useAutoReload";
import {setHeaderRightOptions} from "../../components/setHeaderRightOptions";
import {parse} from "date-fns";

export default function ListMatchesByTeamScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [localScore, setLocalScore] = useState(null);
    const [myTeamSelectModalVisible, setMyTeamSelectModalVisible] = useState(false);

    let team_id = route.params?.item?.team_id ?? global.myTeamId;
    let team_name = route.params?.item?.team?.name ?? global.myTeamName;
    let new_team_id = route.params?.setMyTeam ? route.params.item?.team_id ?? 0 : global.myTeamId; // for team change
    let new_team_name = route.params?.setMyTeam ? route.params.item?.team?.name ?? '' : global.myTeamName;

    const loadScreenData = () => {
        if (team_id !== null || new_team_id === 0) {
            fetchApi('matches/byTeam/' + (team_id ?? 0) + '/' + (route.params?.year_id ?? 0) + '/' + (route.params?.day_id ?? 0) + (route.name === 'ListMatchesByTeamAdmin' ? '/1' : ''))
                .then((json) => {
                    setData(json);
                    setMyTeam();
                    setMyTeamChangedLate(json.object?.matches?.[0].matchStartTime);
                    setPushToken(json.year?.settings);
                    updateGlobalVariables(json.year?.settings);
                    showLocalStorageScore(json.year?.settings);
                    setMatchesServices(json.object.matches, json.year?.settings);
                    setHeaderRightOptions(navigation, route, json, loadScreenData);
                })
                .catch((error) => {
                    console.error(error)
                    navigation.navigate('MyMatches', {screen: 'NoInternetModal'});
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }

    function setMyTeam() {
        if (route.params?.setMyTeam && global.myTeamId !== new_team_id) {
            AsyncStorageFunctions.setAsyncStorage('myTeamId', new_team_id);
            AsyncStorageFunctions.setAsyncStorage('myTeamName', new_team_name);
        }
    }

    function setMyTeamChangedLate(firstMatchStartTime) {
        if (firstMatchStartTime) {
            let setLate = null;
            let now = new Date();
            let start = parse(firstMatchStartTime.slice(-8), 'HH:mm:ss', now);

            if (now > start && route.params?.setMyTeam && global.myTeamId !== new_team_id) {
                setLate = 1;
            }
            if (now <= start) {
                setLate = 0;
            }
            if (setLate !== null && setLate !== global.myTeamChangedLate) {
                global.myTeamChangedLate = setLate;
                AsyncStorageFunctions.setAsyncStorage('myTeamChangedLate', setLate);
            }
        }
    }

    function setPushToken(settings) {
        if ((route.params?.setMyTeam && global.myTeamId !== new_team_id) || global.myYearId !== settings?.currentYear_id) {
            if (settings?.currentYear_id) {
                if (global.myYearId !== settings.currentYear_id) {
                    AsyncStorageFunctions.clearScores();
                    AsyncStorageFunctions.setAsyncStorage('myYearId', settings.currentYear_id);
                }

                if (settings?.usePush) {
                    let postData = {
                        'my_team_id': new_team_id,
                        'my_year_id': settings.currentYear_id,
                        'expoPushToken': global.expoPushToken
                    };

                    fetchApi('pushTokens/add', 'POST', postData)
                        .catch((error) => console.error(error));
                }
            }
        }
    }

    function updateGlobalVariables(settings) {
        if (route.params?.setMyTeam && global.myTeamId !== new_team_id) {
            global.myTeamId = new_team_id;
            global.myTeamName = new_team_name;
        }

        global.myYearId = settings?.currentYear_id ?? global.myYearId;
    }

    function showLocalStorageScore(settings) {
        if (settings?.showLocalStorageScore) {
            AsyncStorageFunctions.getScore()
                .then(response => response !== null ? response.toString() : null)
                .then((string) => {
                    let jsonScore = string !== null ? JSON.parse(string) : null;
                    setLocalScore(jsonScore);
                })
                .catch((error) => console.error(error));
        }
    }

    function setMatchesServices(matches, settings) {
        if (global.myTeamId === team_id || (route.params?.setMyTeam && global.myTeamId === 0)) {
            if (settings?.usePush) {
                PushFunctions.setLocalPushNotifications(matches);
            }
            if (settings?.useLiveScouting) {
                AsyncStorageFunctions.setAsyncStorage('myMatches', matches);
            }
        }
    }

    // initial load
    useEffect(() => {
        setMyTeamSelectModalVisible(team_id === null && new_team_id === null); // first app start

        const loadData = () => {
            setLoading(true);
            loadScreenData();
        };

        return route.name === 'MyMatchesCurrent' ? navigation.addListener('focus', loadData) : loadData();
    }, []);

    useAutoReload(route, data, loadScreenData);

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (route.params?.setMyTeam && team_name === '' ?
                    <TextC>Einstellung erfolgreich geändert: kein Team mehr ausgewählt</TextC>
                    :
                    (data?.status === 'success' ?
                            (data.object?.showTime ?
                                <TextC>Zeitpunkt der Veröffentlichung des
                                    Spielplans: {DateFunctions.getDateTimeFormatted(data.object.showTime) + ' Uhr'}</TextC>
                                :
                                (data.object.group && data.object.matches ?
                                        <TableView appearance={global.colorScheme}>
                                            <Section headerComponent={
                                                <View>
                                                    <View
                                                        style={[style().matchflexRowView, style().headerComponentView]}>
                                                        <View style={{flex: 2}}>
                                                            <TextC>
                                                                {DateFunctions.getDateFormatted(data.yearSelected?.day ?? data.year.day)}
                                                                {'\n'}
                                                                {
                                                                    (team_name === global.myTeamName ? 'Mein Team: ' : '')
                                                                    + team_name + '\n'
                                                                    + 'Spielen in '}
                                                                <TextC
                                                                    style={style().textBlue}>{'Gruppe ' + data.object.group.group_name}</TextC>{'\n'}
                                                                {data.yearSelected === undefined && data.object.referee_group_name ?
                                                                    <TextC>
                                                                        <TextC style={style().textViolet}>SR</TextC>
                                                                        {' in Gruppe ' + data.object.referee_group_name}
                                                                    </TextC>
                                                                    : null}
                                                            </TextC>
                                                        </View>
                                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                                            <Pressable
                                                                style={style().buttonTopRight}
                                                                onPress={() => navigation.navigate('RankingInGroups', {item: data.object.group}, {pop: true})}
                                                            >
                                                                <TextC style={style().textButtonTopRight}
                                                                       numberOfLines={1}>
                                                                    <IconMat name="table-large"
                                                                             size={15}/>{' Tabelle Gr. ' + data.object.group.group_name}
                                                                </TextC>
                                                            </Pressable>
                                                        </View>
                                                    </View>
                                                    {global.settings.isTest && data.yearSelected === undefined && route.name !== 'ListMatchesByTeamAdmin' ?
                                                        <View><TextC
                                                            style={style().testMode}>{global.hintTestData}</TextC></View> : null}
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
                                                            isCurrentRound={data.object.currentRoundId === item.round_id ? 1 : 0}
                                                            nextIsCurrentRound={(data.object.currentRoundId + 1) === item.round_id ? 1 : 0}
                                                            isMyTeam={(item.team1_id === global.myTeamId ? 1 : (item.team2_id === global.myTeamId ? 2 : 0))}
                                                            isRefereeJob={item.isRefereeJob ? 1 : 0}
                                                            refereeGroupName={data.object.referee_group_name}
                                                            localScore={localScore ? localScore[item.id] : null}
                                                            onPress={() => route.name === 'ListMatchesByTeamAdmin' ?
                                                                navigation.navigate('MatchDetailsAdmin', {item})
                                                                : navigation.navigate('MatchDetails', {item})}
                                                        /> : null)
                                                )}
                                            </Section>
                                        </TableView>
                                        :
                                        data.year.settings.currentDay_id === 1 ? //  todo: better index for not-available teamYearsId
                                            <View>
                                                <TextC>Team nicht gefunden!</TextC>
                                                {team_name === global.myTeamName ?
                                                    <View>
                                                        <TextC>Bitte Team neu auswählen:</TextC>
                                                        <Pressable style={[style().button1, style().buttonGreen]}
                                                                   onPress={() => setMyTeamSelectModalVisible(true)}>
                                                            <TextC
                                                                style={style().textButton1}>{'Mein Team auswählen'}</TextC>
                                                        </Pressable>
                                                    </View>
                                                    : null}
                                            </View>
                                            :
                                            <View>
                                                <TextC>{global.hintSchedule}</TextC>
                                            </View>
                                ))
                            :
                            <TextC>Fehler: keine Spiele gefunden!</TextC>
                    ))
            }
            {global.isProductionWebview ? null :
                <MyTeamSelectModal
                    navigation={navigation}
                    setModalVisible={setMyTeamSelectModalVisible}
                    modalVisible={myTeamSelectModalVisible}
                />}
        </ScrollView>
    );
}

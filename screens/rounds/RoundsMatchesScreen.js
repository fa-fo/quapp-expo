import TextC from "../../components/customText";
import {useCallback, useEffect, useState} from 'react';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {Pressable, RefreshControl, ScrollView, View} from 'react-native';
import {Section, TableView} from 'react-native-tableview-simple';
import {style} from '../../assets/styles.js';
import CellVariantMatches from '../../components/cellVariantMatches';
import CellVariantMatchesAdmin from '../../components/cellVariantMatchesAdmin';
import fetchApi from '../../components/fetchApi';
import * as DateFunctions from "../../components/functions/DateFunctions";
import * as ConfirmFunctions from "../../components/functions/ConfirmFunctions";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";

export default function RoundsMatchesScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [matchesToConfirm, setMatchesToConfirm] = useState([]);
    const [count2ConfirmUpcoming, setCount2ConfirmUpcoming] = useState(0);
    let round_id_prev = 0; // previously called round_id

    function getHeaderButtons() {
        return (
            <View style={[style().matchflexRowView, {
                marginHorizontal: 10,
                marginTop: 5,
                maxWidth: route.name !== 'RoundsMatches' && !global.settings.useLiveScouting ? 300 : 150,
                height: '90%',
                alignSelf: 'flex-end'
            }]}>
                {route.name !== 'RoundsMatches' && !global.settings.useLiveScouting ?
                    <View style={{flex: 2}}>
                        <Pressable
                            style={[style().button1, style().buttonEvent, style().buttonGreen]}
                            onPress={() => loadScreenData()}
                        >
                            <TextC style={style().textButton1}>
                                <IconMat name='reload' size={24} color='#fff'/>
                            </TextC>
                        </Pressable>
                    </View>
                    : null}

                <View style={{flex: 1}}>
                    <Pressable
                        style={[style().buttonHeader, style().buttonOrange, (route.params.id > 1 ? null : style().hiddenElement)]}
                        onPress={() => navigation.navigate(route.name, {
                            id: route.params.id - 1,
                            roundsCount: route.params.roundsCount,
                        })}
                    >
                        <TextC style={[style().textButtonTopRight, style().centeredText100]}>{'\u276E'}</TextC>
                    </Pressable>
                </View>
                <View style={{flex: 1}}>
                    <Pressable
                        style={[style().buttonHeader, style().buttonOrange, (route.params.id < route.params.roundsCount ? null : style().hiddenElement)]}
                        onPress={() => navigation.navigate(route.name, {
                            id: route.params.id + 1,
                            roundsCount: route.params.roundsCount,
                        })}
                    >
                        <TextC style={[style().textButtonTopRight, style().centeredText100]}>{'\u276F'}</TextC>
                    </Pressable>
                </View>
            </View>
        )
    }

    useEffect(() => {
        if (round_id_prev !== route.params.id) {
            round_id_prev = route.params.id;
            setLoading(true);
            loadScreenData(route.params.id);

            navigation.setOptions({headerRight: () => null}); // needed for iOS
            navigation.setOptions({headerRight: () => getHeaderButtons()});

            return () => {
                setData(null);
                setLoading(false);
            };
        }
    }, [navigation, route]);

    useFocusEffect(
        useCallback(() => {
            const interval = route.name !== 'RoundsMatches' && global.settings.useLiveScouting ?
                setInterval(() => {
                    loadScreenData(route.params.id);
                }, 3000) : '';

            return () => {
                clearInterval(interval);
            };
        }, [route]),
    );

    const loadScreenData = (roundId) => {
        fetchApi('matches/byRound/' + (roundId ?? route.params.id) + (route.name === 'RoundsMatches' ? '' : '/1'))
            .then((json) => {
                setData(json);

                if (route.name === 'RoundsMatchesAdmin') {
                    let m = ConfirmFunctions.getMatches2Confirm(json.object);
                    setMatchesToConfirm(m.matches);
                    setCount2ConfirmUpcoming(m.count2ConfirmUpcoming);
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    function confirmAllResults() {
        if (matchesToConfirm.length > 0) {
            ConfirmFunctions.confirmResults(matchesToConfirm, null, loadScreenData, null);
        }
    }

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' ?
                    (data.object?.showTime ?
                            <TextC>Zeitpunkt der Veröffentlichung des
                                Spielplans: {DateFunctions.getDateTimeFormatted(data.object.showTime) + ' Uhr'}</TextC>
                            :
                            <View>
                                {global.settings.isTest && data.yearSelected === undefined && route.name === 'RoundsMatches' ?
                                    <TextC style={style().testMode}>{global.hintTestData}</TextC> : null}
                                {data.yearSelected === undefined && !data.year.settings.alwaysAutoUpdateResults && data.object.round?.autoUpdateResults === 0 && route.name === 'RoundsMatches' ?
                                    <TextC style={style().textRed}>{global.hintAutoUpdateResults}</TextC>
                                    : null}
                                {data.object.groups ?
                                    <TableView appearance={global.colorScheme}>
                                        {data.object.groups?.map(group => (
                                            <Section
                                                key={group.id}
                                                headerComponent={
                                                    <View
                                                        style={[style().matchflexRowView, style().headerComponentView]}>
                                                        <View style={{flex: 2}}>
                                                            <TextC style={style().textBlue}>
                                                                {route.name !== 'RoundsMatches' ?
                                                                    <TextC
                                                                        style={{color: 'orange'}}>{'Runde ' + route.params.id}  </TextC>
                                                                    : '\n'}
                                                                {'Gruppe ' + group.name + ':'}</TextC>
                                                        </View>
                                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                                            {route.name === 'RoundsMatches' ?
                                                                (group.name !== 'Endrunde' ?
                                                                    <Pressable
                                                                        style={style().buttonTopRight}
                                                                        onPress={() => navigation.navigate('RankingInGroups', {item: group})}
                                                                    >
                                                                        <TextC style={style().textButtonTopRight}
                                                                               numberOfLines={1}>
                                                                            <IconMat name="table-large"
                                                                                     size={15}/>{' Tabelle Gr. ' + group.name}
                                                                        </TextC>
                                                                    </Pressable> : null)
                                                                :
                                                                (route.name === 'RoundsMatchesAdmin' && group.name === 'A' && global.settings.useLiveScouting ?
                                                                        <Pressable
                                                                            style={[style().button1, style().buttonConfirm, style().buttonGreen]}
                                                                            onPress={() => confirmAllResults()}
                                                                        >
                                                                            <TextC numberOfLines={1}
                                                                                   style={style().textButton1}>
                                                                                {'Alles regulär werten: ' +
                                                                                    matchesToConfirm.length + ' (' + count2ConfirmUpcoming + ')'}
                                                                            </TextC>
                                                                        </Pressable>
                                                                        :
                                                                        (!global.settings.useLiveScouting && group.name !== 'Endrunde' ?
                                                                            <TextC>Ergebniseingabe ohne
                                                                                Faktor</TextC> : null)
                                                                )
                                                            }
                                                        </View>
                                                    </View>
                                                }>
                                                {group.matches ?
                                                    group.matches.map(item => (
                                                        route.name === 'RoundsMatches' ?
                                                            <CellVariantMatches
                                                                key={item.id}
                                                                item={item}
                                                                timeText={DateFunctions.getFormatted(item.matchStartTime) + ' Uhr: '}
                                                                team1Result={item.resultGoals1 !== null ? (parseInt(item.resultGoals1) || 0) : null}
                                                                team2Result={item.resultGoals2 !== null ? (parseInt(item.resultGoals2) || 0) : null}
                                                                isCurrentRound={data.object.currentRoundId === item.round_id ? 1 : 0}
                                                                isMyTeam={(item.team1_id === global.myTeamId ? 1 : (item.team2_id === global.myTeamId ? 2 : 0))}
                                                                onPress={() => navigation.navigate('MatchDetails', {item})}
                                                            /> :
                                                            <CellVariantMatchesAdmin
                                                                key={item.id}
                                                                item={item}
                                                                timeText={DateFunctions.getFormatted(item.matchStartTime) + ' Uhr: '}
                                                                team1Result={item.resultGoals1 !== null ? (parseInt(item.resultGoals1) || 0) : null}
                                                                team2Result={item.resultGoals2 !== null ? (parseInt(item.resultGoals2) || 0) : null}
                                                                fromRoute={route.name}
                                                                loadScreenData={loadScreenData}
                                                                playOffTeams={group.playOffTeams}
                                                            />
                                                    ))
                                                    :
                                                    <View>
                                                        <TextC>{global.hintSchedule}</TextC>
                                                    </View>
                                                }
                                            </Section>
                                        ))}
                                    </TableView>
                                    :
                                    <View>
                                        <TextC>{global.hintSchedule}</TextC>
                                    </View>
                                }
                            </View>
                    ) : <TextC>Fehler: keine Spiele gefunden!</TextC>)}
        </ScrollView>
    );
}

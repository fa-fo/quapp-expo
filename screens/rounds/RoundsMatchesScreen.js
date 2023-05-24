import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import styles from '../../assets/styles.js';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {Section, TableView} from 'react-native-tableview-simple';
import CellVariantMatches from '../../components/cellVariantMatches';
import CellVariantMatchesAdmin from '../../components/cellVariantMatchesAdmin';
import fetchApi from '../../components/fetchApi';
import * as DateFunctions from "../../components/functions/DateFunctions";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import {confirmResult} from "../../components/functions/ConfirmFunctions";

export default function RoundsMatchesScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    let round_id_prev = 0; // previously called round_id

    useEffect(() => {
        if (round_id_prev !== route.params.id) {
            round_id_prev = route.params.id;
            setLoading(true);
            loadScreenData(route.params.id);

            navigation.setOptions({
                headerRight: () => (
                    <Text>
                        {route.params.id > 1 ?
                            <Pressable style={[styles.buttonTopRight, styles.buttonOrange]}
                                       onPress={() => navigation.navigate(route.name, {
                                           id: route.params.id - 1,
                                           roundsCount: route.params.roundsCount,
                                       })}
                            >
                                <Text
                                    style={styles.textButtonTopRight}>{'<'}</Text>
                            </Pressable> : null}
                        <Text> </Text>
                        {route.params.id < route.params.roundsCount ?
                            <Pressable style={[styles.buttonTopRight, styles.buttonOrange]}
                                       onPress={() => navigation.navigate(route.name, {
                                           id: route.params.id + 1,
                                           roundsCount: route.params.roundsCount,
                                       })}
                            >
                                <Text
                                    style={styles.textButtonTopRight}>{'>'}</Text>
                            </Pressable> : null}
                    </Text>
                ),
            });

            return () => {
                setData(null);
                setLoading(false);
            };
        }
    }, [navigation, route]);

    useFocusEffect(
        useCallback(() => {
            const interval = route.name !== 'RoundsMatches' ?
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
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    function confirmAllResults(groups) {
        groups.map(group =>
            group.matches.map(item => {
                    if (item.isResultOk && item.resultTrend === null) // todo: remove bug: overlapping post requests cause duplicate calcRanking
                        confirmResult(item.id, 0, null, null, null)
                }
            ));
        loadScreenData();
    }

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data.status === 'success' ?
                    (data.object?.showTime ?
                            <Text>Zeitpunkt der Veröffentlichung des
                                Spielplans: {DateFunctions.getDateTimeFormatted(data.object.showTime) + ' Uhr'}</Text>
                            :
                            <View>
                                {global.settings.isTest && data.yearSelected === undefined && route.name === 'RoundsMatches' ?
                                    <Text style={styles.testMode}>{global.hintTestData}</Text> : null}
                                {data.yearSelected === undefined && !data.year.settings.alwaysAutoUpdateResults && data.object.round?.autoUpdateResults === 0 && route.name === 'RoundsMatches' ?
                                    <Text style={styles.textRed}>{global.hintAutoUpdateResults}</Text>
                                    : null}
                                <TableView appearance="light">
                                    {data.object.groups?.map(group => (
                                        <Section
                                            key={group.id}
                                            headerComponent={
                                                <View style={[styles.matchflexRowView, styles.headerComponentView]}>
                                                    <View style={{flex: 2}}>
                                                        <Text style={styles.textBlue}>
                                                            {route.name !== 'RoundsMatches' ?
                                                                <Text
                                                                    style={{color: 'orange'}}>{'Runde ' + route.params.id}  </Text>
                                                                : '\n'}
                                                            {'Gruppe ' + group.name + ':'}</Text>
                                                    </View>
                                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                                        {route.name === 'RoundsMatches' ?
                                                            <Pressable
                                                                style={styles.buttonTopRight}
                                                                onPress={() => navigation.navigate('RankingInGroups', {item: group})}
                                                            >
                                                                <Text style={styles.textButtonTopRight}
                                                                      numberOfLines={1}>
                                                                    <IconMat name="table-large"
                                                                             size={15}/>{' Tabelle Gr. ' + group.name}
                                                                </Text>
                                                            </Pressable>
                                                            :
                                                            (route.name === 'RoundsMatchesAdmin' && group.name === 'A' ?
                                                                <Pressable
                                                                    style={[styles.button1, styles.buttonConfirm, styles.buttonGreen]}
                                                                    onPress={() => confirmAllResults(data.object.groups)}
                                                                >
                                                                    <Text numberOfLines={1} style={styles.textButton1}>
                                                                        {'Alles regulär werten'}
                                                                    </Text>
                                                                </Pressable>
                                                                : null)
                                                        }
                                                    </View>
                                                </View>
                                            }>
                                            {group.matches.map(item => (
                                                route.name === 'RoundsMatches' ?
                                                    <CellVariantMatches
                                                        key={item.id}
                                                        item={item}
                                                        timeText={DateFunctions.getFormatted(item.matchStartTime) + ' Uhr: '}
                                                        team1Result={item.resultGoals1 !== null ? (parseInt(item.resultGoals1) || 0) : null}
                                                        team2Result={item.resultGoals2 !== null ? (parseInt(item.resultGoals2) || 0) : null}
                                                        isMyTeam={(item.team1_id === global.myTeamId ? 1 : (item.team2_id === global.myTeamId ? 2 : 0))}
                                                        onPress={() => navigation.navigate('MatchDetails', {item})}
                                                    /> :
                                                    <CellVariantMatchesAdmin
                                                        key={item.id}
                                                        item={item}
                                                        timeText={DateFunctions.getFormatted(item.matchStartTime) + ' Uhr: '}
                                                        team1Result={item.resultGoals1 !== null ? (parseInt(item.resultGoals1) || 0) : null}
                                                        team2Result={item.resultGoals2 !== null ? (parseInt(item.resultGoals2) || 0) : null}
                                                        isMyTeam={(item.team1_id === global.myTeamId ? 1 : (item.team2_id === global.myTeamId ? 2 : 0))}
                                                        fromRoute={route.name}
                                                        loadScreenData={loadScreenData}
                                                    />
                                            ))}
                                        </Section>
                                    ))}
                                </TableView>
                            </View>
                    ) : <Text>Fehler: keine Spiele gefunden!</Text>)}
        </ScrollView>
    );
}

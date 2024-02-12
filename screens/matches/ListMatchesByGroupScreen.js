import * as React from 'react';
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import styles from '../../assets/styles.js';
import {useRoute} from '@react-navigation/native';
import {Section, TableView} from 'react-native-tableview-simple';
import CellVariantMatches from '../../components/cellVariantMatches';
import fetchApi from '../../components/fetchApi';
import {setGroupHeaderOptions} from '../../components/setGroupHeaderOptions';
import * as DateFunctions from "../../components/functions/DateFunctions";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";

export default function ListMatchesByGroupScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    let group_id_prev = 0; // previously called group_id

    useEffect(() => {
        if (group_id_prev !== route.params.item.group_id) {
            group_id_prev = route.params.item.group_id;
            setLoading(true);
            loadScreenData();
        }

        return () => {
            setData(null);
            setLoading(false);
        };
    }, [navigation, route]);

    const loadScreenData = () => {
        fetchApi('matches/byGroup/' + route.params.item.group_id + (route.name === 'ListMatchesByGroupAdmin' ? '/1' : ''))
            .then((json) => {
                setData(json);
                navigation.setOptions({headerRight: () => null}); // needed for iOS
                setGroupHeaderOptions(navigation, route, json);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data.status === 'success' ?
                    (data.object?.showTime ?
                            <Text>Zeitpunkt der Veröffentlichung des
                                Spielplans: {DateFunctions.getDateTimeFormatted(data.object.showTime) + ' Uhr'}</Text>
                            :
                            <TableView appearance="light">
                                {data.object.rounds?.map(round => (
                                    <Section
                                        key={round.id}
                                        headerComponent={
                                            <View>
                                                <View style={[styles.matchflexRowView, styles.headerComponentView]}>
                                                    <View style={{flex: 2}}>
                                                        <Text>{DateFunctions.getDateFormatted(data.yearSelected?.day ?? data.year.day)}
                                                            <Text
                                                                style={{color: 'orange'}}>{'\nRunde ' + round.id} </Text>
                                                            {data.yearSelected === undefined && !data.year.settings.alwaysAutoUpdateResults && !round.autoUpdateResults ?
                                                                <Text
                                                                    style={styles.textRed}>{'\n' + global.hintAutoUpdateResults}</Text>
                                                                : null}
                                                        </Text>
                                                    </View>
                                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                                        <Pressable
                                                            style={styles.buttonTopRight}
                                                            onPress={() => navigation.navigate(route.name === 'ListMatchesByGroupAdmin' ? 'RankingInGroupsAdmin' : 'RankingInGroups', {item: route.params.item})}
                                                        >
                                                            <Text style={styles.textButtonTopRight}
                                                                  numberOfLines={1}>
                                                                <IconMat name="table-large"
                                                                         size={15}/>{' Tabelle Gr. ' + route.params.item.group_name}
                                                            </Text>
                                                        </Pressable>
                                                    </View>
                                                </View>
                                                {global.settings.isTest && data.yearSelected === undefined && round.id === 1 && route.name === 'ListMatchesByGroup' ?
                                                    <View><Text
                                                        style={styles.testMode}>{global.hintTestData}</Text></View> : null}

                                            </View>
                                        }>
                                        {round.matches ?
                                            round.matches.map(item => (
                                                <CellVariantMatches
                                                    key={item.id}
                                                    item={item}
                                                    timeText={DateFunctions.getFormatted(item.matchStartTime) + ' Uhr: '}
                                                    team1Result={item.resultGoals1 !== null ? (parseInt(item.resultGoals1) || 0) : null}
                                                    team2Result={item.resultGoals2 !== null ? (parseInt(item.resultGoals2) || 0) : null}
                                                    isMyTeam={(item.team1_id === global.myTeamId ? 1 : (item.team2_id === global.myTeamId ? 2 : 0))}
                                                    onPress={() => route.name === 'ListMatchesByGroup' ? navigation.navigate('MatchDetails', {item}) : null}
                                                />
                                            ))
                                            :
                                            <View>
                                                <Text>{global.hintSchedule}</Text>
                                            </View>
                                        }
                                    </Section>
                                ))}
                            </TableView>
                    ) : <Text>Fehler: keine Spiele gefunden!</Text>)}
        </ScrollView>
    );
}

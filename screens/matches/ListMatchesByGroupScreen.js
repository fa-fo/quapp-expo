import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, View} from 'react-native';
import {style} from '../../assets/styles.js';
import {useRoute} from '@react-navigation/native';
import {Section, TableView} from 'react-native-tableview-simple';
import CellVariantMatches from '../../components/cellVariantMatches';
import fetchApi from '../../components/fetchApi';
import {setGroupHeaderOptions} from '../../components/setGroupHeaderOptions';
import * as DateFunctions from "../../components/functions/DateFunctions";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import {useAutoReload} from "../../components/useAutoReload";

export default function ListMatchesByGroupScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    let group_id = route.params.item?.group_id ?? 0;
    let group_id_prev = -1; // previously called group_id
    let group_name = route.params.item?.group_name ?? 'A';

    const loadScreenData = () => {
        fetchApi('matches/byGroup/' + group_id + (route.name === 'ListMatchesByGroupAdmin' ? '/1' : ''))
            .then((json) => {
                setData(json);
                setGroupHeaderOptions(navigation, route, json, loadScreenData);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    // initial load
    useEffect(() => {
        if (group_id_prev !== group_id) {
            group_id_prev = group_id;
            setLoading(true);
            loadScreenData();
        }

        return () => {
            setData(null);
            setLoading(false);
        };
    }, [navigation, route]);

    useAutoReload(route, data, loadScreenData);

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' ?
                    (data.object?.showTime ?
                            <TextC>Zeitpunkt der Veröffentlichung des
                                Spielplans: {DateFunctions.getDateTimeFormatted(data.object.showTime) + ' Uhr'}</TextC>
                            :
                            <TableView appearance={global.colorScheme}>
                                {data.object.rounds?.map(round =>
                                    (round.matches ?
                                        <Section
                                            key={round.id}
                                            headerComponent={
                                                <View>
                                                    <View
                                                        style={[style().matchflexRowView, style().headerComponentView]}>
                                                        <View style={{flex: 2}}>
                                                            <TextC>{DateFunctions.getDateFormatted(data.yearSelected?.day ?? data.year.day)}
                                                                <TextC
                                                                    style={{color: 'orange'}}>{'\nRunde ' + round.id} </TextC>
                                                                {data.yearSelected === undefined && !data.year.settings.alwaysAutoUpdateResults && !round.autoUpdateResults ?
                                                                    <TextC
                                                                        style={style().textRed}>{'\n' + global.hintAutoUpdateResults}</TextC>
                                                                    : null}
                                                            </TextC>
                                                        </View>
                                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                                            <Pressable
                                                                style={style().buttonTopRight}
                                                                onPress={() => navigation.navigate(route.name === 'ListMatchesByGroupAdmin' ? 'RankingInGroupsAdmin' : 'RankingInGroups', {item: route.params.item})}
                                                            >
                                                                <TextC style={style().textButtonTopRight}
                                                                       numberOfLines={1}>
                                                                    <IconMat name="table-large"
                                                                             size={15}/>{' Tabelle Gr. ' + group_name}
                                                                </TextC>
                                                            </Pressable>
                                                        </View>
                                                    </View>
                                                    {global.settings.isTest && data.yearSelected === undefined && round.id === 1 && route.name === 'ListMatchesByGroup' ?
                                                        <View><TextC
                                                            style={style().testMode}>{global.hintTestData}</TextC></View> : null}

                                                </View>
                                            }>
                                            {round.matches.map(item => (
                                                <CellVariantMatches
                                                    key={item.id}
                                                    item={item}
                                                    timeText={DateFunctions.getFormatted(item.matchStartTime) + ' Uhr: '}
                                                    team1Result={item.resultGoals1 !== null ? (parseInt(item.resultGoals1) || 0) : null}
                                                    team2Result={item.resultGoals2 !== null ? (parseInt(item.resultGoals2) || 0) : null}
                                                    isCurrentRound={data.object.currentRoundId === item.round_id ? 1 : 0}
                                                    isMyTeam={(item.team1_id === global.myTeamId ? 1 : (item.team2_id === global.myTeamId ? 2 : 0))}
                                                    onPress={() => route.name === 'ListMatchesByGroupAdmin' ?
                                                        navigation.navigate('MatchDetailsAdmin', {item})
                                                        : navigation.navigate('MatchDetails', {item})}
                                                />
                                            ))
                                            }
                                        </Section> : null)
                                )}
                            </TableView>
                    ) : <TextC>Fehler: keine Spiele gefunden!</TextC>)}
        </ScrollView>
    );
}

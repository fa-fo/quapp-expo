import * as React from 'react';
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import styles from '../../assets/styles.js';
import {useRoute} from '@react-navigation/native';
import {Section, TableView} from 'react-native-tableview-simple';
import CellVariantRanking from '../../components/cellVariantRanking';
import fetchApi from '../../components/fetchApi';
import {setGroupHeaderOptions} from '../../components/setGroupHeaderOptions';
import * as DateFunctions from "../../components/functions/DateFunctions";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";

export default function RankingInGroupsScreen({navigation}) {
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
        fetchApi('groupTeams/all/' + route.params.item.group_id + (route.name === 'RankingInGroupsAdmin' ? '/1' : ''))
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
                    <TableView appearance="light">
                        <Section headerComponent={
                            <View>
                                <View style={[styles.matchflexRowView, styles.headerComponentView]}>
                                    <View style={{flex: 1}}>
                                        <Text>{DateFunctions.getDateFormatted(data.yearSelected?.day ?? data.year.day)}
                                            <Text
                                                style={styles.textBlue}>{'\nGruppe ' + route.params.item.group_name + ':'}</Text>
                                        </Text>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <Pressable style={styles.buttonTopRight}
                                                   onPress={() => navigation.navigate(route.name === 'RankingInGroupsAdmin' ? 'ListMatchesByGroupAdmin' : 'ListMatchesByGroup', {item: route.params.item})}
                                        >
                                            <Text style={styles.textButtonTopRight}>
                                                <IconMat name="format-list-bulleted" size={15}/>
                                                {' '}
                                                {'Spielplan Gr. ' + route.params.item.group_name}
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                                {global.settings.isTest && data.yearSelected === undefined && route.name === 'RankingInGroups' ?
                                    <View><Text style={styles.testMode}>{global.hintTestData}</Text></View> : null}
                                {data.object.showRanking ?
                                    <View style={styles.matchflexRowView}>
                                        <View style={{alignSelf: 'center', flex: 1}}>
                                            <Text numberOfLines={1} style={styles.textRankingStats}> </Text>
                                        </View>
                                        <View style={{alignSelf: 'center', flex: 2}}>
                                            <Text numberOfLines={1} style={styles.textRankingStats}>
                                                Spiele
                                            </Text>
                                        </View>
                                        <View style={{alignSelf: 'center', flex: 2}}>
                                            <Text numberOfLines={1} style={styles.textRankingStats}>
                                                Torverh.
                                            </Text>
                                        </View>
                                        <View style={{alignSelf: 'center', flex: 2}}>
                                            <Text numberOfLines={1} style={styles.textRankingStats}>
                                                Tordiff.
                                            </Text>
                                        </View>
                                        <View style={{alignSelf: 'center', flex: 2}}>
                                            <Text numberOfLines={1} style={styles.textRankingStats}>
                                                Punkte
                                            </Text>
                                        </View>
                                        <View style={{flex: 0.4}}>
                                            <Text> </Text>
                                        </View>
                                    </View> : null}
                            </View>
                        }>
                            {data.object.showRanking && data.object.groupTeams?.map(item =>
                                <CellVariantRanking
                                    key={item.id}
                                    item={item}
                                    isMyTeam={(item.team_id === global.myTeamId ? 1 : 0)}
                                    dayId={data.object.day_id}
                                    onPress={() => navigation.navigate((route.name === 'RankingInGroupsAdmin' ? 'ListMatchesByTeamAdmin' : 'ListMatchesByTeam'), {
                                        item: item,
                                        year_id: data.object.year_id,
                                        day_id: data.object.day_id
                                    })}
                                />
                            )}
                            {!data.object.showRanking ?
                                <View style={{alignSelf: 'center'}}>
                                    <Text style={{marginTop: 30, marginBottom: 30, fontWeight: 'bold', fontSize: 24}}>Bekanntgabe
                                        der Endtabelle bei der Siegerehrung!</Text>
                                </View> : null}
                        </Section>
                    </TableView>
                    : <Text>Fehler!</Text>)}
        </ScrollView>
    );
}

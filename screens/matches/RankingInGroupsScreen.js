import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, View} from 'react-native';
import {style} from '../../assets/styles.js';
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

    let item = route.params?.item ?? {group_id: 0, group_name: 'A'};
    let group_id = item.group_id;
    let group_id_prev = -1; // previously called group_id
    let group_name = item.group_name;

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

    const loadScreenData = () => {
        fetchApi('groupTeams/all/' + group_id + (route.name === 'RankingInGroupsAdmin' ? '/1' : ''))
            .then((json) => {
                setData(json);
                navigation.setOptions({headerRight: () => null}); // needed for iOS
                setGroupHeaderOptions(navigation, route, json, loadScreenData);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' ?
                    <TableView appearance={global.colorScheme}>
                        <Section headerComponent={
                            <View>
                                <View style={[style().matchflexRowView, style().headerComponentView]}>
                                    <View style={{flex: 1}}>
                                        <TextC>{DateFunctions.getDateFormatted(data.yearSelected?.day ?? data.year.day)}
                                            <TextC
                                                style={style().textBlue}>{'\nGruppe ' + group_name + ':'}</TextC>
                                        </TextC>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <Pressable style={style().buttonTopRight}
                                                   onPress={() => navigation.navigate(route.name === 'RankingInGroupsAdmin' ? 'ListMatchesByGroupAdmin' : 'ListMatchesByGroup', {item: item})}
                                        >
                                            <TextC style={style().textButtonTopRight} numberOfLines={1}>
                                                <IconMat name="format-list-bulleted"
                                                         size={15}/>{' Spielplan Gr. ' + group_name}
                                            </TextC>
                                        </Pressable>
                                    </View>
                                </View>
                                {global.settings.isTest && data.yearSelected === undefined && route.name === 'RankingInGroups' ?
                                    <View><TextC style={style().testMode}>{global.hintTestData}</TextC></View> : null}
                                {data.object.showRanking ?
                                    <View style={style().matchflexRowView}>
                                        <View style={{alignSelf: 'center', flex: 1}}>
                                            <TextC numberOfLines={1} style={style().textRankingStats}> </TextC>
                                        </View>
                                        <View style={{alignSelf: 'center', flex: 2}}>
                                            <TextC numberOfLines={1} style={style().textRankingStats}>
                                                Spiele
                                            </TextC>
                                        </View>
                                        <View style={{alignSelf: 'center', flex: 2}}>
                                            <TextC numberOfLines={1} style={style().textRankingStats}>
                                                Torverh.
                                            </TextC>
                                        </View>
                                        <View style={{alignSelf: 'center', flex: 2}}>
                                            <TextC numberOfLines={1} style={style().textRankingStats}>
                                                Tordiff.
                                            </TextC>
                                        </View>
                                        <View style={{alignSelf: 'center', flex: 2}}>
                                            <TextC numberOfLines={1} style={style().textRankingStats}>
                                                Punkte
                                            </TextC>
                                        </View>
                                        <View style={{flex: 0.4}}>
                                            <TextC> </TextC>
                                        </View>
                                    </View> : null}
                            </View>
                        }>
                            {data.object.showRanking && data.object.groupTeams?.map(item =>
                                <CellVariantRanking
                                    key={item.id}
                                    item={item}
                                    isMyTeam={(item.team_id === global.myTeamId ? 1 : 0)}
                                    isTest={data.object.isTest}
                                    dayId={data.object.day_id}
                                    daysCount={data.year.daysCount}
                                    onPress={() => navigation.navigate((route.name === 'RankingInGroupsAdmin' ? 'ListMatchesByTeamAdmin' : 'ListMatchesByTeam'), {
                                        item: item,
                                        year_id: data.object.year_id,
                                        day_id: data.object.day_id
                                    })}
                                />
                            )}
                            {!data.object.showRanking ?
                                <View style={{alignSelf: 'center'}}>
                                    <TextC style={{marginTop: 30, marginBottom: 30, fontWeight: 'bold', fontSize: 24}}>Bekanntgabe
                                        der Endtabelle bei der Siegerehrung!</TextC>
                                </View> : null}
                        </Section>
                    </TableView>
                    : <TextC>Fehler!</TextC>)}
        </ScrollView>
    );
}

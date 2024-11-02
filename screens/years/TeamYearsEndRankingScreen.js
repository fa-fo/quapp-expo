import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, ScrollView, View} from 'react-native';
import {style} from '../../assets/styles.js';
import {useRoute} from '@react-navigation/native';
import {Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../components/fetchApi';
import CellVariant from '../../components/cellVariant';

export default function TeamYearsEndRankingScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    let year_id_prev = 0; // previously called year_id

    useEffect(() => {
        return navigation.addListener('focus', () => {
            if (year_id_prev !== route.params.item.year_id) {
                year_id_prev = route.params.item.year_id;
                setLoading(true);

                fetchApi('teamYears/getEndRanking/' + route.params.item.year_id + (route.name === 'TeamYearsEndRankingAdmin' ? '/1' : ''))
                    .then((json) => setData(json))
                    .catch((error) => console.error(error))
                    .finally(() => setLoading(false));
            }
        });
    }, [navigation, route]);

    return (
        <ScrollView>
            {isLoading ? <ActivityIndicator size="large" color="#00ff00" style={style().actInd}/> :
                (data?.status === 'success' ? (
                    <TableView appearance={global.colorScheme}>
                        <Section headerComponent={
                            <View>
                                <View style={[style().matchflexRowView, style().headerComponentView]}>
                                    <View style={{flex: 1}}>
                                        <TextC>{route.params.item.year_name}</TextC>
                                    </View>
                                    {data.yearSelected?.daysWithGroups > 0 ? ([...Array(data.yearSelected.daysWithGroups).keys()]).map(day_id => (
                                        <View key={day_id} style={{flex: 1, alignItems: 'center'}}>
                                            <Pressable style={style().buttonTopRight}
                                                       onPress={() => navigation.navigate('GroupsAll', {
                                                           year_id: route.params.item.year_id,
                                                           day_id: (day_id + 1)
                                                       })}
                                            >
                                                <TextC style={style().textButtonTopRight}
                                                      numberOfLines={1}>{'Archiv Tag ' + (day_id + 1)}</TextC>
                                            </Pressable>
                                        </View>
                                    )) : null}
                                </View>
                            </View>
                        }>
                            {data?.object ? data.object.map(item => (
                                <CellVariant
                                    key={item.id}
                                    title={(item.endRanking !== null ? item.endRanking + '. ' : '') + item.team_name}
                                    detail="Teaminfo"
                                    isMyTeam={(item.team_id === global.myTeamId ? 1 : 0)}
                                    onPress={() => (route.name === 'TeamYearsEndRankingAdmin' ? null : navigation.navigate('TeamYearsInfo', {item}))}
                                />
                            )) : null}
                            {data.object.showRanking === 0 ?
                                <View style={{alignSelf: 'center'}}>
                                    <TextC style={{marginTop: 30, marginBottom: 30, fontWeight: 'bold', fontSize: 24}}>Bekanntgabe
                                        der Endtabelle bei der Siegerehrung!</TextC>
                                </View> : null}
                        </Section>
                    </TableView>
                ) : <TextC>Keine Teams gefunden!</TextC>)}
        </ScrollView>
    );
}

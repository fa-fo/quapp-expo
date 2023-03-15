import * as React from 'react';
import {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, ScrollView, Text, View} from 'react-native';
import styles from '../../assets/styles.js';
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
            {isLoading ? <ActivityIndicator size="large" color="#00ff00" style={styles.actInd}/> :
                (data && data.status === 'success' ? (
                    <TableView appearance="light">
                        <Section headerComponent={
                            <View>
                                <View style={[styles.matchflexRowView, styles.headerComponentView]}>
                                    <View style={{flex: 1}}>
                                        <Text>{route.params.item.year_name}</Text>
                                    </View>
                                    {data.yearSelected?.daysWithGroups > 0 ? ([...Array(data.yearSelected.daysWithGroups).keys()]).map(day_id => (
                                        <View key={day_id} style={{flex: 1, alignItems: 'center'}}>
                                            <Pressable style={styles.buttonTopRight}
                                                       onPress={() => navigation.navigate('GroupsAll', {
                                                           year_id: route.params.item.year_id,
                                                           day_id: (day_id + 1)
                                                       })}
                                            >
                                                <Text
                                                    style={styles.textButtonTopRight}>{'Archiv Tag ' + (day_id + 1)}</Text>
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
                                    <Text style={{marginTop: 30, marginBottom: 30, fontWeight: 'bold', fontSize: 24}}>Bekanntgabe
                                        der Endtabelle bei der Siegerehrung!</Text>
                                </View> : null}
                        </Section>
                    </TableView>
                ) : <Text>Keine Teams gefunden!</Text>)}
        </ScrollView>
    );
}

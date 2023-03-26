import * as React from 'react';
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import styles from '../../assets/styles.js';
import {useRoute} from '@react-navigation/native';
import {Section, TableView} from 'react-native-tableview-simple';
import CellVariant from '../../components/cellVariant';
import fetchApi from '../../components/fetchApi';

export default function TeamYearsInfoScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        setLoading(true);
        loadScreenData();

        return () => {
            setData(null);
            setLoading(false);
        };
    }, [route]);

    const loadScreenData = () => {
        fetchApi('teams/byId/' + route.params.item.team_id)
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data.status === 'success' ? (
                    <View>
                        <TableView appearance="light">
                            <Section headerComponent={
                                <View>
                                    <View style={[styles.matchflexRowView, styles.headerComponentView]}>
                                        <View style={{flex: 2}}>
                                            <Text style={{fontSize: 18}}>{data.object[0].team_name}</Text>
                                            <Text>{'Teilnahmen: ' + data.object[0].calcTotalYears}</Text>
                                            <Text>{'Gesamtplatzierungspunkte: ' + (data.object[0].calcTotalRankingPoints ? data.object[0].calcTotalRankingPoints : 0)}</Text>
                                            <Text>{'Platzierungspunkte/Jahr: ' + (data.object[0].calcTotalPointsPerYear ? data.object[0].calcTotalPointsPerYear : 0)}</Text>
                                            <Text>{'Platz in der Ewigen Tabelle: ' + (data.object[0].calcTotalRankingPoints ? data.object[0].calcTotalRanking : '-')}</Text>
                                            <Text>{' '}</Text>
                                        </View>
                                        {data.object[0].team_years[0].year_id > 24 ?
                                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                                <Pressable style={styles.buttonTopRight}
                                                           onPress={() => navigation.navigate('TeamYearsInfoBalance', {team: route.params.item})}
                                                >
                                                    <Text style={styles.textButtonTopRight}
                                                          numberOfLines={1}>{'Bilanz seit 2022'}</Text>
                                                </Pressable>
                                            </View>
                                            : null}
                                    </View>
                                </View>
                            }>
                                {data.object[0].team_years.map(item => (
                                    <CellVariant
                                        key={item.id}
                                        title={item.year_name + (item.endRanking ? (': ' + item.endRanking + '. Platz') : '')}
                                        detail="Tabelle"
                                        backgroundColor={(item.endRanking === 1 ? 'rgba(224,196,13,0.37)' : '')}
                                        onPress={() => navigation.navigate('TeamYearsEndRanking', {item})}
                                    />
                                ))}
                            </Section>
                        </TableView>
                    </View>
                ) : <Text>Fehler!</Text>)}
        </ScrollView>
    );
}

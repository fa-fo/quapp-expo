import * as React from 'react';
import {useEffect, useState} from 'react';
import {RefreshControl, ScrollView, Text, View} from 'react-native';
import styles from '../../assets/styles.js';
import {useRoute} from '@react-navigation/native';
import {Section, TableView} from 'react-native-tableview-simple';
import CellVariantBalance from '../../components/cellVariantBalance';
import fetchApi from '../../components/fetchApi';

export default function TeamYearsInfoBalanceScreen({navigation}) {
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
        fetchApi('teams/balance/' + route.params.team.team_id)
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
                                            <Text style={{fontSize: 18}}>{route.params.team.team_name}</Text>
                                            <Text>{'Gesamtbilanz seit 2022 (nur ausgetragene Spiele):'}</Text>
                                            <Text>{(data.object['total'][1] ?? 0) + ' Siege'} - {(data.object['total'][0] ?? 0) + ' Unentschieden'} - {(data.object['total'][2] ?? 0) + ' Niederlagen'}</Text>
                                            <Text>{'\n'}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.matchflexRowView}>
                                        <View style={{alignSelf: 'center', flex: 2.4}}>
                                            <Text numberOfLines={1} style={styles.textRankingStats}> </Text>
                                        </View>
                                        <View style={{alignSelf: 'center', flex: 2}}>
                                            <Text numberOfLines={1} style={styles.textRankingStats}>
                                                Siege
                                            </Text>
                                        </View>
                                        <View style={{alignSelf: 'center', flex: 2}}>
                                            <Text numberOfLines={1} style={styles.textRankingStats}>
                                                Unent.
                                            </Text>
                                        </View>
                                        <View style={{alignSelf: 'center', flex: 2}}>
                                            <Text numberOfLines={1} style={styles.textRankingStats}>
                                                Nied.
                                            </Text>
                                        </View>
                                        <View style={{flex: 1}}>
                                            <Text> </Text>
                                        </View>
                                    </View>
                                </View>
                            }>
                                {data.object.sports.map(sport => (
                                    <CellVariantBalance
                                        key={sport.id}
                                        item={sport}
                                        object={data.object}
                                        detail={'Spiele'}
                                        onPress={() => navigation.navigate('TeamYearsInfoBalanceMatches', {
                                            team: route.params.team,
                                            sport: sport
                                        })}
                                    />
                                ))}
                            </Section>
                        </TableView>
                    </View>
                ) : <Text>keine Spiele gefunden!</Text>)}
        </ScrollView>
    );
}

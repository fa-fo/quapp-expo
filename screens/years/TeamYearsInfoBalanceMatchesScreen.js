import * as React from 'react';
import {useEffect, useState} from 'react';
import {Image, RefreshControl, ScrollView, Text, View} from 'react-native';
import styles from '../../assets/styles.js';
import {useRoute} from '@react-navigation/native';
import {Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../components/fetchApi';
import CellVariantMatches from "../../components/cellVariantMatches";
import * as SportFunctions from "../../components/functions/SportFunctions";
import * as DateFunctions from "../../components/functions/DateFunctions";

export default function TeamYearsInfoBalanceMatchesScreen({navigation}) {
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
        fetchApi('teams/balanceMatches/' + route.params.team.team_id + '/' + route.params.sport.id)
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
                                            <Text>
                                                <Image
                                                    style={styles.sportImage}
                                                    source={SportFunctions.getSportImage(route.params.sport.code)}
                                                />
                                                {route.params.sport.name}
                                            </Text>
                                            <Text>Alle ausgetragene Spiele seit 2022: </Text>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>

                                        </View>
                                    </View>
                                </View>
                            }>
                                {data.object.map(item =>
                                    <CellVariantMatches
                                        key={item.id}
                                        item={item}
                                        timeText={DateFunctions.getDateYearFormatted(item.matchStartTime)}
                                        timeText2={DateFunctions.getFormatted(item.matchStartTime) + ' Uhr'}
                                        team1Result={item.resultGoals1 !== null ? (parseInt(item.resultGoals1) || 0) : null}
                                        team2Result={item.resultGoals2 !== null ? (parseInt(item.resultGoals2) || 0) : null}
                                        isMyTeam={(item.team1_id === global.myTeamId ? 1 : (item.team2_id === global.myTeamId ? 2 : 0))}
                                        onPress={() => navigation.navigate('MatchDetails', {item})}
                                    />
                                )}
                            </Section>
                        </TableView>
                    </View>
                ) : <Text>Fehler!</Text>)}
        </ScrollView>
    );
}

import * as React from 'react';
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import styles from '../../assets/styles.js';
import {useRoute} from '@react-navigation/native';
import {Section, TableView} from 'react-native-tableview-simple';
import CellVariant from '../../components/cellVariant';
import fetchApi from '../../components/fetchApi';
import * as SportFunctions from "../../components/functions/SportFunctions";

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

    function getTeamsData(team, depth) {
        return team ? (
            <View>
                <Section headerComponent={
                    <View>
                        <View style={[styles.matchflexRowView, styles.headerComponentView]}>
                            <View style={{flex: 2}}>
                                {depth === 1 ?
                                    <Text style={styles.textViolet}>Frühere Team-Namen:</Text> : null}
                                <Text style={{fontSize: 18}}>
                                    {team.team_name ?? team.name ?? ''}
                                    {team.calcTotalChampionships ? SportFunctions.getChampionshipStars(team.calcTotalChampionships) : null}
                                </Text>
                                <Text>{'Teilnahmen: ' + team.calcTotalYears}</Text>
                                <Text>{'Gesamtplatzierungspunkte: ' + (team.calcTotalRankingPoints ?? 0)}</Text>
                                {team.calcTotalPointsPerYear ?
                                    <Text>{'Platzierungspunkte/Jahr: ' + team.calcTotalPointsPerYear}</Text> : null}
                                {team.calcTotalRanking ?
                                    <Text>{'Platz in der Ewigen Tabelle: ' + team.calcTotalRanking}</Text> : null}
                            </View>
                            {depth === 0 && team.team_years[0].year_id > 24 ?
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
                    {team.team_years.map(item => (
                        <CellVariant
                            key={item.id}
                            title={item.year_name + (item.endRanking ? (': ' + item.endRanking + '. Platz') : '')}
                            detail="Tabelle"
                            backgroundColor={(item.endRanking === 1 ? 'rgba(224,196,13,0.37)' : '')}
                            onPress={() => navigation.navigate('TeamYearsEndRanking', {item})}
                        />
                    ))}
                </Section>

                {getTeamsData(team.prev_team, depth + 1)}
            </View>
        ) : null
    }

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' ? (
                    <View>
                        <TableView appearance="light">
                            {getTeamsData(data.object[0], 0)}
                        </TableView>
                    </View>
                ) : <Text>Fehler!</Text>)}
        </ScrollView>
    );
}

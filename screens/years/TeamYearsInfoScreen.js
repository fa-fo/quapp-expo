import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, View} from 'react-native';
import {style} from '../../assets/styles.js';
import {useRoute} from '@react-navigation/native';
import {Section, TableView} from 'react-native-tableview-simple';
import CellVariant from '../../components/cellVariant';
import fetchApi from '../../components/fetchApi';
import * as SportFunctions from "../../components/functions/SportFunctions";
import * as ColorFunctions from "../../components/functions/ColorFunctions";

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
                        <View style={[style().matchflexRowView, style().headerComponentView]}>
                            <View style={{flex: 2}}>
                                {depth === 1 ?
                                    <TextC style={style().textViolet}>Frühere Team-Namen:</TextC> : null}
                                <TextC style={{fontSize: 18}}>
                                    {team.team_name ?? team.name ?? ''}
                                    {team.calcTotalChampionships ? SportFunctions.getChampionshipStars(team.calcTotalChampionships) : null}
                                </TextC>
                                <TextC>{'Teilnahmen: ' + team.calcTotalYears}</TextC>
                                <TextC>{'Gesamtplatzierungspunkte: ' + (team.calcTotalRankingPoints ?? 0)}</TextC>
                                {team.calcTotalPointsPerYear ?
                                    <TextC>{'Platzierungspunkte/Jahr: ' + team.calcTotalPointsPerYear}</TextC> : null}
                                {team.calcTotalRanking ?
                                    <TextC>{'Platz in der Ewigen Tabelle: ' + team.calcTotalRanking}</TextC> : null}
                            </View>
                            {depth === 0 && team.team_years[0].year_id > 24 ?
                                <View style={{flex: 1, alignItems: 'flex-end'}}>
                                    <Pressable style={style().buttonTopRight}
                                               onPress={() => navigation.navigate('TeamYearsInfoBalance', {team: route.params.item})}
                                    >
                                        <TextC style={style().textButtonTopRight}>{'Bilanz seit 2022'}</TextC>
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
                            backgroundColor={(item.endRanking === 1 ? ColorFunctions.getColor('GoldBg') : '')}
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
                        <TableView appearance={global.colorScheme}>
                            {getTeamsData(data.object[0], 0)}
                        </TableView>
                    </View>
                ) : <TextC>Fehler!</TextC>)}
        </ScrollView>
    );
}

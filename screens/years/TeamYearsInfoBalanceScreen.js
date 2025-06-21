import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import {style} from '../../assets/styles.js';
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
                (data?.status === 'success' ? (
                    <View>
                        <TableView appearance={global.colorScheme}>
                            <Section headerComponent={
                                <View>
                                    <View style={[style().matchflexRowView, style().headerComponentView]}>
                                        <View style={{flex: 2}}>
                                            <TextC style={{fontSize: 18}}>{route.params.team.team_name}</TextC>
                                            <TextC>{'Gesamtbilanz seit 2022 (nur ausgetragene Spiele):'}</TextC>
                                            <TextC>{(data.object['total'][1] ?? 0) + ' Siege'} - {(data.object['total'][0] ?? 0) + ' Unentschieden'} - {(data.object['total'][2] ?? 0) + ' Niederlagen'}</TextC>
                                            <TextC>{'\n'}</TextC>
                                        </View>
                                    </View>
                                    <View style={style().matchflexRowView}>
                                        <View style={{alignSelf: 'center', flex: 2.4}}>
                                            <TextC numberOfLines={1} style={style().textRankingStats}> </TextC>
                                        </View>
                                        <View style={{alignSelf: 'center', flex: 2}}>
                                            <TextC numberOfLines={1} style={style().textRankingStats}>
                                                Siege
                                            </TextC>
                                        </View>
                                        <View style={{alignSelf: 'center', flex: 2}}>
                                            <TextC numberOfLines={1} style={style().textRankingStats}>
                                                Unent.
                                            </TextC>
                                        </View>
                                        <View style={{alignSelf: 'center', flex: 2}}>
                                            <TextC numberOfLines={1} style={style().textRankingStats}>
                                                Nied.
                                            </TextC>
                                        </View>
                                        <View style={{flex: 1}}>
                                            <TextC> </TextC>
                                        </View>
                                    </View>
                                </View>
                            }>
                                {data.object.sports.map(sport => (
                                    data.object[sport.id] ?
                                        <CellVariantBalance
                                            key={sport.id}
                                            item={sport}
                                            object={data.object}
                                            detail={'Spiele'}
                                            onPress={() => navigation.navigate('TeamYearsInfoBalanceMatches', {
                                                team: route.params.team,
                                                sport: sport
                                            })}
                                        /> : null
                                ))}
                            </Section>
                        </TableView>
                    </View>
                ) : <TextC>keine Spiele gefunden!</TextC>)}
        </ScrollView>
    );
}

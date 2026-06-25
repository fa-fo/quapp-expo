import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {RefreshControl, View} from 'react-native';
import {Section, TableView} from 'react-native-tableview-simple';
import {useRoute} from '@react-navigation/native';
import fetchApi from '../../components/fetchApi';
import CellVariant from '../../components/cellVariant';
import CellVariantTeamsAdmin from '../../components/cellVariantTeamsAdmin';
import ScrollViewC from "../../components/customScrollView";
import {style} from "../../assets/styles";

export default function TeamsCurrentScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [sports, setSports] = useState([]);

    useEffect(() => {
        loadScreenData();
    }, []);

    const loadScreenData = () => {
        if (route.name === 'TeamsCurrentAdmin') {
            fetchApi('sports/all')
                .then((json) => setSports(json))
                .catch((error) => console.error(error));
        }

        fetchApi('teamYears/all')
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollViewC refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' ? (
                    <TableView appearance={global.colorScheme}>
                        <Section
                            headerComponent={
                                <View style={style().matchflexRowView}>
                                    <View style={{flex: 3}}>
                                        <TextC numberOfLines={1} style={style().textRankingStats}>
                                            Alle Teams (alphabetisch sortiert)
                                        </TextC>
                                    </View>
                                    {global.settings.useRefereePref && route.name === 'TeamsCurrentAdmin' ?
                                        <View style={[style().matchflexRowView, {flex: 2}]}>
                                            <TextC>SR-Präferenzen:</TextC>
                                        </View> : null}
                                    <View style={{flex: 1}}>
                                        <TextC> </TextC>
                                    </View>
                                </View>

                            }>
                            {data.object.map(item => (
                                (route.name === 'TeamsCurrentAdmin' ?
                                    <CellVariantTeamsAdmin
                                        key={item.id}
                                        item={item}
                                        sports={sports.object}
                                    />
                                    :
                                    <CellVariant
                                        key={item.id}
                                        title={item.team.name}
                                        isMyTeam={(item.team_id === global.myTeamId && route.name === 'TeamsCurrent' ? 1 : 0)}
                                        detail={'Spielplan'}
                                        canceled={item.canceled}
                                        onPress={() => navigation.navigate('ListMatchesByTeam', {item})}
                                    />)
                            ))}
                        </Section>
                    </TableView>
                ) : <TextC>Keine Teams gefunden!</TextC>)}
        </ScrollViewC>
    );
}

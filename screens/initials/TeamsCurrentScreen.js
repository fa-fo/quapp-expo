import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import {Section, TableView} from 'react-native-tableview-simple';
import {useRoute} from '@react-navigation/native';
import fetchApi from '../../components/fetchApi';
import CellVariant from '../../components/cellVariant';
import CellVariantTeamsAdmin from '../../components/cellVariantTeamsAdmin';

export default function TeamsCurrentScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        loadScreenData();
    }, []);

    const loadScreenData = () => {
        fetchApi('teamYears/all')
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' ? (
                    <TableView appearance={global.colorScheme}>
                        <Section header="Alle Teams (alphabetisch sortiert)">
                            {data.object.map(item => (
                                (route.name === 'TeamsCurrentAdmin' ?
                                    <CellVariantTeamsAdmin
                                        key={item.id}
                                        teamYearsId={item.id}
                                        title={item.team.name}
                                        routeName={route.name}
                                        canceled={item.canceled}
                                    />
                                    :
                                    <CellVariant
                                        key={item.id}
                                        title={item.team.name}
                                        isMyTeam={(item.team_id === global.myTeamId && route.name === 'TeamsCurrent' ? 1 : 0)}
                                        detail={'Spielplan'}
                                        canceled={item.canceled}
                                        onPress={() => navigation.navigateDeprecated('ListMatchesByTeam', {item})}
                                    />)
                            ))}
                        </Section>
                    </TableView>
                ) : <TextC>Keine Teams gefunden!</TextC>)}
        </ScrollView>
    );
}

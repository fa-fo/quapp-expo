import * as React from 'react';
import {useEffect, useState} from 'react';
import {RefreshControl, ScrollView, Text} from 'react-native';
import {Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../components/fetchApi';
import CellVariant from '../../components/cellVariant';
import {useRoute} from '@react-navigation/native';
import * as DateFunctions from "../../components/functions/DateFunctions";

export default function RoundsCurrentScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        loadScreenData();
    }, []);

    const loadScreenData = () => {
        fetchApi('rounds/all' + (route.name === 'RoundsCurrent' ? '' : '/1'))
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' && data?.object?.rounds?.length > 0 ? (
                    <TableView appearance="light">
                        <Section header={global.currentDayName}>
                            {data.object.rounds.map(item => (
                                <CellVariant key={item.id}
                                             cellStyle="RightDetail"
                                             title={'Spielrunde ' + item.id + ' um ' + DateFunctions.getFormatted(item.timeStart) + ' Uhr'}
                                             accessory="DetailDisclosure"
                                             detail={item.matchesWithResult ? item.matchesWithResult + '/' + item.matchesCount + ' Spiele gewertet' : item.matchesCount + ' Spiele, Details'}
                                             onPress={() => navigation.navigate((route.name === 'RoundsCurrentSupervisor' ? 'RoundsMatchesSupervisor' : (route.name === 'RoundsCurrentAdmin' ? 'RoundsMatchesAdmin' : 'RoundsMatches')), {
                                                 id: item.id,
                                                 roundsCount: data.object.rounds.length,
                                             })}
                                />
                            ))}
                        </Section>
                    </TableView>
                ) : <Text>Keine Spielrunden gefunden!</Text>)}
        </ScrollView>
    );
}

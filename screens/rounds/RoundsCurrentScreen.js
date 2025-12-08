import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import {Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../components/fetchApi';
import CellVariant from '../../components/cellVariant';
import {useRoute} from '@react-navigation/native';
import * as DateFunctions from "../../components/functions/DateFunctions";
import {useAutoReload} from "../../components/useAutoReload";
import {setHeaderRightOptions} from "../../components/setHeaderRightOptions";

export default function RoundsCurrentScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const loadScreenData = () => {
        fetchApi('rounds/all' + (route.name === 'RoundsCurrent' ? '' : '/1'))
            .then((json) => {
                setData(json);
                setHeaderRightOptions(navigation, route, json, loadScreenData);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    // initial load
    useEffect(() => {
        return navigation.addListener('focus', () => {
            setLoading(true);
            loadScreenData();
        });
    }, [route]);

    useAutoReload(route, data, loadScreenData);

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' && data?.object?.rounds?.length > 0 ? (
                    <TableView appearance={global.colorScheme}>
                        <Section header={global.currentDayName}>
                            {data.object.rounds.map(item => (
                                <CellVariant key={item.id}
                                             cellStyle="RightDetail"
                                             title={'Runde ' + item.id
                                                 + (global.settings.usePlayOff && data.object.rounds.length === item.id ? ' (Endrunde)' : '')
                                                 + ' um ' + DateFunctions.getFormatted(item.timeStart) + ' Uhr'}
                                             accessory="DetailDisclosure"
                                             isCurrentRound={data.object.currentRoundId === item.id ? 1 : 0}
                                             detail={route.name === 'RoundsCurrent' ? 'Details'
                                                 : (item.matchesWithoutReferee ? item.matchesWithoutReferee + ' SR fehlen, ' : '')
                                                 + item.matchesConfirmed + '/' + item.matchesCount + ' gewertet'}
                                             detailColor={route.name === 'RoundsCurrent' || data.object.currentRoundId <= item.id ? null
                                                 : item.matchesConfirmed === item.matchesCount ? 'green'
                                                     : 'red'}
                                             onPress={() => navigation.navigate((route.name === 'RoundsCurrentSupervisor' ? 'RoundsMatchesSupervisor'
                                                 : (route.name === 'RoundsCurrentAdmin' ? 'RoundsMatchesAdmin'
                                                     : 'RoundsMatches')), {
                                                 id: item.id,
                                             })}
                                />
                            ))}
                        </Section>
                    </TableView>
                ) : <TextC>Keine Spielrunden gefunden!</TextC>)}
        </ScrollView>
    );
}

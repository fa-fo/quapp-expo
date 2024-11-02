import TextC from "../../components/customText";
import {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import {Section, TableView} from 'react-native-tableview-simple';
import {format, parseISO} from 'date-fns';
import CellVariantMatches from '../../components/cellVariantMatches';
import fetchApi from '../../components/fetchApi';
import {useFocusEffect, useRoute} from '@react-navigation/native';

export default function ListMatchesByRefereeCanceledTeamsScreen({navigation}) {
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
    }, []);

    useFocusEffect(
        useCallback(() => {
            const interval =
                setInterval(() => {
                    loadScreenData();
                }, 3000);

            return () => {
                clearInterval(interval);
            };
        }, []),
    );

    const loadScreenData = () => {
        let postData = {
            'password': global['supervisorPW']
        };
        fetchApi('matches/refereeCanceledMatches', 'POST', postData)
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' && data.object.matches && data.object.matches.length > 0 ? (
                    <TableView appearance={global.colorScheme}>
                        <Section header={'Hier werden alle Spiele mit SR von zurückgezogenen Teams angezeigt:'}>
                            {data.object.matches.map(item => (
                                <CellVariantMatches
                                    key={item.id}
                                    item={item}
                                    timeText={format(parseISO(item.matchStartTime), 'H:mm') + ' Uhr: '}
                                    team1Result={item.resultGoals1 !== null ? (parseInt(item.resultGoals1) || 0) : null}
                                    team2Result={item.resultGoals2 !== null ? (parseInt(item.resultGoals2) || 0) : null}
                                    fromRoute={route.name}
                                    loadScreenData={loadScreenData}
                                />
                            ))}
                        </Section>
                    </TableView>
                ) : <TextC>keine Spiele gefunden!</TextC>)}
        </ScrollView>
    );
}

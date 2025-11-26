import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import {Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../components/fetchApi';
import CellVariant from '../../components/cellVariant';
import {useRoute} from "@react-navigation/native";
import * as DateFunctions from "../../components/functions/DateFunctions";

export default function GroupsAllScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        setLoading(true);
        loadScreenData();
    }, [navigation, route]);

    const loadScreenData = () => {
        fetchApi('groups/all' + '/' + (route.params?.year_id ?? 0) + '/' + (route.params?.day_id ?? 0))
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' && data?.object?.groups?.length > 0 ? (
                    <TableView appearance={global.colorScheme}>
                        <Section
                            header={DateFunctions.getDateFormatted(data.yearSelected?.day ?? data.year.day)}>
                            {data.object.groups.map(item => (
                                <CellVariant key={item.id}
                                             cellStyle="RightDetail"
                                             title={'Gruppe ' + item.name}
                                             accessory="DetailDisclosure"
                                             detail={item.teamsCount + ' Teams, Tabelle, Spielplan'}
                                             onPress={() => navigation.navigate((route.name === 'GroupsAllAdmin' ? 'RankingInGroupsAdmin' : 'RankingInGroups'), {item})}
                                />
                            ))}
                        </Section>
                    </TableView>
                ) : <TextC>Keine Gruppen gefunden!</TextC>)}
        </ScrollView>
    );
}

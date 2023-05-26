import * as React from 'react';
import {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, Text} from 'react-native';
import {Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../components/fetchApi';
import CellVariant from '../../components/cellVariant';
import {useFocusEffect, useRoute} from "@react-navigation/native";
import * as DateFunctions from "../../components/functions/DateFunctions";

export default function GroupsAllScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    let year_id_prev = null;
    let day_id_prev = null;

    useFocusEffect(
        useCallback(() => {
            if ((route.params === undefined && year_id_prev === null)
                || year_id_prev !== (route.params?.year_id ?? (global.currentYearId ?? 0))
                || day_id_prev !== (route.params?.day_id ?? (global.settings?.currentDay_id ?? 0))) {

                year_id_prev = route.params?.year_id ?? (global.currentYearId ?? 0);
                day_id_prev = route.params?.day_id ?? (global.settings?.currentDay_id ?? 0);
                setLoading(true);
                loadScreenData();
            }
        }, [navigation, route]),
    );

    const loadScreenData = () => {
        fetchApi('groups/all' + '/' + (route.params?.year_id ?? 0) + '/' + (route.params?.day_id ?? 0))
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data.status === 'success' && data.object.groups && data.object.groups.length > 0 ? (
                    <TableView appearance="light">
                        <Section
                            header={DateFunctions.getDateFormatted(data.yearSelected !== undefined ? data.yearSelected.day : data.year.day)}>
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
                ) : <Text>Keine Gruppen gefunden!</Text>)}
        </ScrollView>
    );
}

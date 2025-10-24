import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import {Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../components/fetchApi';
import CellVariantRankingSubst from "../../components/cellVariantRefereeSubst";
import {useRoute} from "@react-navigation/native";
import {useAutoReload} from "../../components/useAutoReload";

export default function RankingRefereeSubstScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const loadScreenData = () => {
        fetchApi('matches/getRankingRefereeSubst/')
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        setLoading(true);
        loadScreenData();

        return () => setData(null);
    }, []);

    useAutoReload(route, data, loadScreenData);

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' && data.object?.teams?.length > 0 ? (
                    <TableView appearance={global.colorScheme}>
                        <Section header={'Rangliste der Ersatz-SR:'}>
                            {data.object.teams.map(item => (
                                <CellVariantRankingSubst
                                    key={item.key}
                                    rank={item.key}
                                    title={item.teams4.name}
                                    count={item.count}
                                />
                            ))}
                        </Section>
                    </TableView>
                ) : <TextC>keine Teams gefunden!</TextC>)}
        </ScrollView>
    );
}

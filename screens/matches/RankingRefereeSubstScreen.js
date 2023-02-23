import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, Text} from 'react-native';
import {Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../components/fetchApi';
import CellVariantRankingSubst from "../../components/cellVariantRefereeSubst";
import {useFocusEffect} from "@react-navigation/native";

export default function RankingRefereeSubstScreenScreen({navigation}) {
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
        fetchApi('matches/getRankingRefereeSubst/')
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data.status === 'success' && data.object?.teams?.length > 0 ? (
                    <TableView appearance="light">
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
                ) : <Text>keine Teams gefunden!</Text>)}
        </ScrollView>
    );
}

import * as React from 'react';
import {useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, RefreshControl, ScrollView, Text, View} from 'react-native';
import {Cell, Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../components/fetchApi';
import CellVariant from '../../components/cellVariant';

export default function TeamsAllTimeRankingScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [fetchMoreData, setFetchMoreData] = useState(false);

    useEffect(() => {
        loadScreenData();

        return () => {
            setData(null);
            setLoading(false);
        };
    }, []);

    useEffect(() => {
        if (fetchMoreData && allData.object !== undefined) {
            setTimeout(() => {
                setData(data.concat(allData.object.slice(data.length, data.length + 20)));
                setFetchMoreData(false);
            }, 1000);
        }

        return () => {
            setFetchMoreData(false);
        };
    }, [fetchMoreData]);

    const loadScreenData = () => {
        fetchApi('teams/all/')
            .then((json) => {
                setAllData(json);
                setData(json.object?.length ? json.object.slice(0, 20) : null);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}
            onScroll={(e) => {
                if (data?.length < allData?.object?.length) {
                    let windowHeight = Dimensions.get('window').height;
                    let height = e.nativeEvent.contentSize.height;
                    let offset = e.nativeEvent.contentOffset.y;

                    if (windowHeight + offset >= height) {
                        setFetchMoreData(true);
                    }
                }
            }} scrollEventThrottle={400}>
            {isLoading ? null :
                (allData?.status === 'success' ?
                    <TableView appearance="light">
                        <Section
                            header={'Für jeden 1. Platz gibt es 64 Punkte, für jeden 2. Platz 63 P., für jeden 3. Platz 62 P. usw.'}
                        >
                            {data ? data.map(item => (
                                <CellVariant
                                    key={item.id}
                                    title={item.calcTotalRanking + '. ' + item.team_name}
                                    countStars={item.calcTotalChampionships}
                                    detail={item.calcTotalRankingPoints + ' P., ' + item.calcTotalYears + ' Teiln.'}
                                    isMyTeam={(item.team_id === global.myTeamId ? 1 : 0)}
                                    onPress={() => navigation.navigate('TeamYearsInfo', {item})}
                                />
                            )) : null}
                            {allData.object.showRanking === 0 ?
                                <View style={{alignSelf: 'center'}}>
                                    <Text style={{marginTop: 30, marginBottom: 30, fontWeight: 'bold', fontSize: 24}}>Bekanntgabe
                                        der Tabelle nach der Siegerehrung!</Text>
                                </View> : null}
                            {allData.object.length > data?.length ?
                                <Cell key="0"><ActivityIndicator size="large" color="#00ff00"/></Cell> : null}
                        </Section>
                    </TableView>
                    : <Text>Fehler!</Text>)}
        </ScrollView>
    );
}

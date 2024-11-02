import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, Pressable, RefreshControl, ScrollView, View} from 'react-native';
import {Cell, Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../components/fetchApi';
import CellVariant from '../../components/cellVariant';
import {style} from "../../assets/styles";

export default function TeamsAllTimeRankingScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [myTeamData, setMyTeamData] = useState(false);
    const [fetchMoreData, setFetchMoreData] = useState(false);

    useEffect(() => {
        loadScreenData();

        return () => {
            setData(null);
            setLoading(false);
        };
    }, []);

    useEffect(() => {
        async function sliceData() {
            if (fetchMoreData && allData.object !== undefined) {
                setTimeout(() => {
                    setData(data.concat(allData.object.slice(data.length, data.length + 20)));
                }, 1000);

                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        sliceData().finally(() => setFetchMoreData(false));
    }, [fetchMoreData]);

    const loadScreenData = () => {
        fetchApi('teams/all/')
            .then((json) => {
                setAllData(json);
                setData(json.object?.length ? json.object.slice(0, 20) : null);

                setMyTeamData(global.myTeamId ? json.object.find((e) => e.id === global.myTeamId) : false);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    function myTeamIn() {
        return data.find((e) => e.id === global.myTeamId);
    }

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}
            onScroll={(e) => {
                if (data?.length < allData?.object?.length) {
                    let windowHeight = Dimensions.get('window').height;
                    let height = e.nativeEvent.contentSize.height;
                    let offset = e.nativeEvent.contentOffset.y;

                    if (windowHeight + offset >= height && (!myTeamData || myTeamIn())) {
                        setFetchMoreData(true);
                    }
                }
            }} scrollEventThrottle={3000}>
            {isLoading ? null :
                (allData?.status === 'success' ?
                    <TableView appearance={global.colorScheme}>
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

                            // show myTeam even if not scrolled down enough
                            {data && myTeamData && !myTeamIn(data) ?
                                <View>
                                    <CellVariant title={'...'}/>
                                    <CellVariant
                                        key={myTeamData.id}
                                        title={myTeamData.calcTotalRanking + '. ' + myTeamData.team_name}
                                        countStars={myTeamData.calcTotalChampionships}
                                        detail={myTeamData.calcTotalRankingPoints + ' P., ' + myTeamData.calcTotalYears + ' Teiln.'}
                                        isMyTeam={1}
                                        onPress={() => navigation.navigate('TeamYearsInfo', {item: myTeamData})}
                                    />
                                </View>
                                : null}
                            {allData.object.showRanking === 0 ?
                                <View style={{alignSelf: 'center'}}>
                                    <TextC style={{marginTop: 30, marginBottom: 30, fontWeight: 'bold', fontSize: 24}}>
                                        Bekanntgabe der Tabelle nach der Siegerehrung!</TextC>
                                </View> : null}
                            {allData.object.length > data?.length ?
                                (fetchMoreData ?
                                        <Cell key="0"><ActivityIndicator size="large" color="#00ff00"/></Cell>
                                        :
                                        <Pressable style={[style().buttonTopRight, style().buttonGreen]}
                                                   onPress={() => setFetchMoreData(true)}
                                        >
                                            <TextC style={style().textButtonTopRight}
                                                  numberOfLines={1}>{'mehr laden'}</TextC>
                                        </Pressable>
                                )
                                : null}
                        </Section>
                    </TableView>
                    : <TextC>Fehler!</TextC>)}
        </ScrollView>
    );
}

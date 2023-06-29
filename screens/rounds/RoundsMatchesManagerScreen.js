import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import fetchApi from '../../components/fetchApi';
import CellVariantMatchesManager from "../../components/cellVariantMatchesManager";
import CellVariantMatchesManagerProblem from "../../components/cellVariantMatchesManagerProblem";
import {format} from "date-fns";
import styles from "../../assets/styles";
import * as DateFunctions from "../../components/functions/DateFunctions";

export default function RoundsMatchesManagerScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [now, setNow] = useState(new Date());
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        setLoading(true);
        loadScreenData();

        return () => {
            setData(null);
            setLoading(false);
        };
    }, [navigation, route]);

    useFocusEffect(
        useCallback(() => {
            const interval1 = setInterval(() => {
                loadScreenData();
            }, 3000);

            const interval2 = setInterval(() => {
                getTime();
            }, 1000);

            return () => {
                clearInterval(interval1);
                clearInterval(interval2);
            };
        }, [route]),
    );

    const loadScreenData = () => {
        fetchApi('matches/byRound/0/1')
            .then((json) => {
                setData(json);

                let then = new Date();
                then.setSeconds(Number(parseInt(then.getSeconds()) + 10));
                setLastUpdate(then);

                navigation.setOptions({headerRight: () => null}); // needed for iOS
                navigation.setOptions({
                    headerRight: () => (
                        <Text>
                            <Pressable style={[styles.buttonTopRight, styles.buttonOrange]}
                                       onPress={() => navigation.navigate('RoundsMatchesSupervisor', {
                                           id: json.object?.round?.id,
                                           roundsCount: route.params.roundsCount,
                                       })}
                            >
                                <Text
                                    style={styles.textButtonTopRight}>{'zur klassischen Ansicht'}</Text>
                            </Pressable>
                        </Text>
                    ),
                });
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };


    function getTime() {
        let now = new Date();
        setNow(now);
    }

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}
            style={lastUpdate && data && now > lastUpdate ? styles.buttonRed : null}
        >
            <View style={{alignItems: 'flex-end', paddingTop: 4, paddingRight: 8}}>
                <Text>{format(now, "HH:mm:ss")}</Text>
            </View>
            {isLoading ? null :
                (data.status === 'success' ?
                    <View style={styles.matchflexRowView}>
                        <View style={{flex: 3}}>
                            <Text
                                style={{
                                    color: 'orange',
                                    alignSelf: 'center'
                                }}>
                                {'Runde ' + data.object.round?.id + ' um '
                                + DateFunctions.getFormatted(data.object.round['timeStartDay' + data.year.settings.currentDay_id]) + ' Uhr'}
                            </Text>
                            {data.object.groups?.map(group =>
                                group.matches.map(item => (
                                    <CellVariantMatchesManagerProblem
                                        key={item.id}
                                        item={item}
                                    />
                                ))
                            )}
                        </View>
                        <View style={{flex: 1}}>
                            {data.object.groups?.map(group =>
                                group.matches.map((item, i) => (
                                    <Pressable
                                        key={item.id}
                                        onPress={() => navigation.navigate('MatchDetailsSupervisor', {item})}>
                                        <CellVariantMatchesManager
                                            i={i}
                                            item={item}
                                        />
                                    </Pressable>
                                ))
                            )}
                        </View>
                    </View>
                    : <Text>Fehler: keine Spiele gefunden!</Text>)}
        </ScrollView>
    );
}

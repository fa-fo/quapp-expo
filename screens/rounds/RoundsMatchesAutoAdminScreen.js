import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import fetchApi from '../../components/fetchApi';
import {format} from "date-fns";
import styles from "../../assets/styles";
import * as DateFunctions from "../../components/functions/DateFunctions";
import {Section, TableView} from "react-native-tableview-simple";
import CellVariantMatchesAdmin from "../../components/cellVariantMatchesAdmin";
import * as ConfirmFunctions from "../../components/functions/ConfirmFunctions";

export default function RoundsMatchesAutoAdminScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [now, setNow] = useState(new Date());
    const [lastUpdate, setLastUpdate] = useState(null); // check for too long time not updated
    const [matchesToConfirm, setMatchesToConfirm] = useState([]);
    const [isConfirming, setIsConfirming] = useState(false); // prevent double auto-confirming

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
        fetchApi('matches/byRound/0/1/0/0/0') // offset: 0 (5th parameter)
            .then((json) => {
                setData(json);
                setMatchesToConfirm(ConfirmFunctions.getMatches2Confirm(json.object));

                let then = new Date();
                then.setSeconds(Number(parseInt(then.getSeconds().toString()) + 10));
                setLastUpdate(then);

                navigation.setOptions({headerRight: () => null}); // needed for iOS
                navigation.setOptions({
                    headerRight: () => (
                        <Text>
                            <Pressable style={[styles.buttonTopRight, styles.buttonOrange]}
                                       onPress={() => navigation.navigate('RoundsMatchesAdmin', {
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

    useEffect(() => {
        confirmAllResults();
    }, [matchesToConfirm]);

    function getTime() {
        let n = new Date();
        setNow(n);
    }

    function confirmAllResults() {
        if (matchesToConfirm.length > 0 && !isConfirming) {
            setIsConfirming(true);
            ConfirmFunctions.confirmResults(matchesToConfirm, setIsConfirming, loadScreenData, null);
        }
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
                (data?.status === 'success' ?
                    <TableView appearance="light">
                        {data.object.groups?.map(group => (
                            <Section
                                key={group.id}
                                headerComponent={
                                    <View style={[styles.matchflexRowView, styles.headerComponentView]}>
                                        <View style={{flex: 2}}>
                                            <Text style={styles.textBlue}>
                                                <Text
                                                    style={{color: 'orange'}}>{'Runde ' + data.object.round.id}  </Text>
                                                {'Gruppe ' + group.name + ':'}</Text>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                            {group.name === 'A' ?
                                                <Text numberOfLines={1}
                                                      style={styles.textGreen}>
                                                    {'Regulär werten: ' + matchesToConfirm.length + ' (automatisch)'}
                                                </Text> : null}
                                        </View>
                                    </View>
                                }>
                                {group.matches ?
                                    group.matches.map(item =>
                                        (!item.logsCalc.isResultConfirmed ?
                                            <CellVariantMatchesAdmin
                                                key={item.id}
                                                item={item}
                                                timeText={DateFunctions.getFormatted(item.matchStartTime) + ' Uhr: '}
                                                team1Result={item.resultGoals1 !== null ? (parseInt(item.resultGoals1) || 0) : null}
                                                team2Result={item.resultGoals2 !== null ? (parseInt(item.resultGoals2) || 0) : null}
                                                fromRoute={route.name}
                                                loadScreenData={loadScreenData}
                                            /> : null)
                                    )
                                    :
                                    null
                                }
                            </Section>
                        ))}
                    </TableView>
                    : <Text>Fehler: keine Spiele gefunden!</Text>)}
        </ScrollView>
    );
}

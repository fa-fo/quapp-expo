import TextC from "../../components/customText";
import {useCallback, useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, View} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import fetchApi from '../../components/fetchApi';
import {format} from "date-fns";
import {style} from "../../assets/styles";
import * as DateFunctions from "../../components/functions/DateFunctions";
import {Section, TableView} from "react-native-tableview-simple";
import CellVariantMatchesAdmin from "../../components/cellVariantMatchesAdmin";
import * as ConfirmFunctions from "../../components/functions/ConfirmFunctions";
import * as SportFunctions from "../../components/functions/SportFunctions";

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

                if (json.object?.round?.id) {
                    navigation.setOptions({
                        headerRight: () => (
                            <TextC>
                                <Pressable style={[style().buttonTopRight, style().buttonOrange]}
                                           onPress={() => navigation.navigateDeprecated('RoundsMatchesAdmin', {
                                               id: json.object?.round?.id,
                                               roundsCount: route.params.roundsCount,
                                           })}
                                >
                                    <TextC
                                        style={style().textButtonTopRight}>{'zur klassischen Ansicht'}</TextC>
                                </Pressable>
                            </TextC>
                        ),
                    });
                }
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
            style={lastUpdate && data && now > lastUpdate ? style().buttonRed : null}
        >
            <View style={{alignItems: 'flex-end', paddingTop: 4, paddingRight: 8}}>
                <TextC>{format(now, "HH:mm:ss")}</TextC>
            </View>
            {isLoading ? null :
                (data?.status === 'success' && data.object.round ?
                    <View>
                        <TableView appearance={global.colorScheme}>
                            {data.object.groups?.map(group => (
                                <Section
                                    key={group.id}
                                    headerComponent={
                                        <View style={[style().matchflexRowView, style().headerComponentView]}>
                                            <View style={{flex: 2}}>
                                                <TextC style={style().textBlue}>
                                                    <TextC
                                                        style={{color: 'orange'}}>{'Runde ' + data.object.round.id}  </TextC>
                                                    {'Gruppe ' + group.name + ':'}</TextC>
                                            </View>
                                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                                {group.name === 'A' ?
                                                    <TextC numberOfLines={1}
                                                           style={style().textGreen}>
                                                        {'Regulär werten: ' + matchesToConfirm.length + ' (automatisch)'}
                                                    </TextC> : null}
                                            </View>
                                        </View>
                                    }>
                                    {group.matches?.map(item =>
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
                                    )}
                                </Section>
                            ))}
                        </TableView>
                        {SportFunctions.getRemarksAdmin(data.object.remarks)}
                    </View>
                    : <TextC>Keine Spiele gefunden! currentRoundId: {data.object?.currentRoundId}</TextC>)}
        </ScrollView>
    );
}

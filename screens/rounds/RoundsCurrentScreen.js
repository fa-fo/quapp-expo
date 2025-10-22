import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, View} from 'react-native';
import {Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../components/fetchApi';
import CellVariant from '../../components/cellVariant';
import {useIsFocused, useRoute} from '@react-navigation/native';
import * as DateFunctions from "../../components/functions/DateFunctions";
import {style} from "../../assets/styles";

export default function RoundsCurrentScreen({navigation}) {
    const isFocused = useIsFocused();
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        return navigation.addListener('focus', () => {
            setLoading(true);
            loadScreenData();
        });
    }, [route]);

    // auto-reload
    useEffect(() => {
        let sur = data?.year?.secondsUntilReload?.[1] ?? 0;

        if (sur > 0) {
            let timer = setTimeout(() => {
                if (isFocused) {
                    loadScreenData();
                }
            }, sur * 1000);

            return () => clearTimeout(timer);
        }
    }, [data]);

    const loadScreenData = () => {
        fetchApi('rounds/all' + (route.name === 'RoundsCurrent' ? '' : '/1'))
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' && data?.object?.rounds?.length > 0 ? (
                    <TableView appearance={global.colorScheme}>
                        <Section
                            header={global.currentDayName}
                            headerComponent={route.name !== 'RoundsCurrent' && global.settings.useLiveScouting ?
                                <View style={[style().matchflexRowView, style().headerComponentView]}>
                                    <View style={{flex: 2}}>
                                        <TextC>{global.currentDayName}</TextC>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <Pressable
                                            style={[style().button1, style().buttonConfirm, style().buttonGreen]}
                                            onPress={() => navigation.navigate(
                                                route.name === 'RoundsCurrentSupervisor' ? 'RoundsMatchesManager'
                                                    :
                                                    route.name === 'RoundsCurrentAdmin' ? 'RoundsMatchesAutoAdmin'
                                                        :
                                                        '', {
                                                    roundsCount: data.object.rounds.length,
                                                })}
                                        >
                                            <TextC numberOfLines={1} style={style().textButton1}>
                                                {route.name === 'RoundsCurrentSupervisor' ? 'zur Manager-Ansicht'
                                                    :
                                                    route.name === 'RoundsCurrentAdmin' ? 'zur Admin-Auto-Ansicht'
                                                        :
                                                        ''
                                                }
                                            </TextC>
                                        </Pressable>
                                    </View>
                                </View> : null
                            }>
                            {data.object.rounds.map(item => (
                                <CellVariant key={item.id}
                                             cellStyle="RightDetail"
                                             title={'Runde ' + item.id
                                                 + (global.settings.usePlayOff && data.object.rounds.length === item.id ? ' (Endrunde)' : '')
                                                 + ' um ' + DateFunctions.getFormatted(item.timeStart) + ' Uhr'}
                                             accessory="DetailDisclosure"
                                             isCurrentRound={data.object.currentRoundId === item.id ? 1 : 0}
                                             detail={route.name === 'RoundsCurrent' ? 'Details'
                                                 : (item.matchesWithoutReferee ? item.matchesWithoutReferee + ' SR fehlen, ' : '')
                                                 + item.matchesConfirmed + '/' + item.matchesCount + ' gewertet'}
                                             detailColor={route.name === 'RoundsCurrent' || data.object.currentRoundId <= item.id ? null
                                                 : item.matchesConfirmed === item.matchesCount ? 'green'
                                                     : 'red'}
                                             onPress={() => navigation.navigate((route.name === 'RoundsCurrentSupervisor' ? 'RoundsMatchesSupervisor'
                                                 : (route.name === 'RoundsCurrentAdmin' ? 'RoundsMatchesAdmin'
                                                     : 'RoundsMatches')), {
                                                 id: item.id,
                                                 roundsCount: data.object.rounds.length,
                                             })}
                                />
                            ))}
                        </Section>
                    </TableView>
                ) : <TextC>Keine Spielrunden gefunden!</TextC>)}
        </ScrollView>
    );
}

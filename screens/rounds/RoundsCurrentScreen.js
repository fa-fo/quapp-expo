import * as React from 'react';
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import {Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../components/fetchApi';
import CellVariant from '../../components/cellVariant';
import {useRoute} from '@react-navigation/native';
import * as DateFunctions from "../../components/functions/DateFunctions";
import styles from "../../assets/styles";

export default function RoundsCurrentScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        return navigation.addListener('focus', () => {
            setLoading(true);
            loadScreenData();
        });
    }, [route]);

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
                    <TableView appearance="light">
                        <Section
                            header={global.currentDayName}
                            headerComponent={route.name !== 'RoundsCurrent' ?
                                <View style={[styles.matchflexRowView, styles.headerComponentView]}>
                                    <View style={{flex: 2}}>
                                        <Text>{global.currentDayName}</Text>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <Pressable
                                            style={[styles.button1, styles.buttonConfirm, styles.buttonGreen]}
                                            onPress={() => navigation.navigate(
                                                route.name === 'RoundsCurrentSupervisor' ? 'RoundsMatchesManager'
                                                    :
                                                    route.name === 'RoundsCurrentAdmin' ? 'RoundsMatchesAutoAdmin'
                                                        :
                                                        '', {
                                                    roundsCount: data.object.rounds.length,
                                                })}
                                        >
                                            <Text numberOfLines={1} style={styles.textButton1}>
                                                {route.name === 'RoundsCurrentSupervisor' ? 'zur Manager-Ansicht'
                                                    :
                                                    route.name === 'RoundsCurrentAdmin' ? 'zur Admin-Auto-Ansicht'
                                                        :
                                                        ''
                                                }
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View> : null
                            }>
                            {data.object.rounds.map(item => (
                                <CellVariant key={item.id}
                                             cellStyle="RightDetail"
                                             title={'Runde ' + item.id + ' um ' + DateFunctions.getFormatted(item.timeStart) + ' Uhr'}
                                             accessory="DetailDisclosure"
                                             isCurrentRound={data.object.currentRoundId === item.id ? 1 : 0}
                                             detail={route.name === 'RoundsCurrent' ? 'Details'
                                                 : (item.matchesConfirmed ?? 0) + '/' + item.matchesCount + ' gewertet'}
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
                ) : <Text>Keine Spielrunden gefunden!</Text>)}
        </ScrollView>
    );
}

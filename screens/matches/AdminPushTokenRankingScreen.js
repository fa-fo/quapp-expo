import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, View} from 'react-native';
import fetchApi from '../../components/fetchApi';
import {useRoute} from "@react-navigation/native";
import {Section, TableView} from "react-native-tableview-simple";
import CellVariant from "../../components/cellVariant";
import {style} from "../../assets/styles";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";

export default function AdminPushTokenRankingScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);


    useEffect(() => {
        loadScreenData();
    }, [navigation, route]);

    const loadScreenData = () => {
        fetchApi('pushTokenRatings/getPtrRanking/' + (route.params?.mode ?? ''))
            .then((json) => {
                setData(json);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' ?
                    <TableView appearance={global.colorScheme}>
                        <Section
                            headerComponent={
                                <View>
                                    <View style={[style().matchflexRowView, style().headerComponentView]}>
                                        <View style={{flex: 1}}>
                                            <TextC>{data.yearSelected?.name ?? data.year.name}
                                                <TextC>{'\nModus: ' + (route.params?.mode === 'teams' ? 'Team-Wertung' : 'Einzel-Wertung')}</TextC>
                                            </TextC>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                            <Pressable style={style().buttonTopRight}
                                                       onPress={() => navigation.navigate('AdminPushTokenRanking', {mode: route.params?.mode !== 'teams' ? 'teams' : null})}
                                            >
                                                <TextC style={style().textButtonTopRight} numberOfLines={1}>
                                                    <IconMat name="format-list-bulleted" size={15}/>{' '}
                                                    {route.params?.mode === 'teams' ? 'Einzel-Wertung' : 'Team-Wertung'}
                                                </TextC>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            }
                        >
                            {data.object.map(item =>
                                <CellVariant
                                    key={item.ptrRanking}
                                    title={item.ptrRanking + '. ' + item.team_name + (item.count ? ' (' + item.count + ')' : '')}
                                    detail={item.ptrPoints + ' P.'}
                                    onPress={() => null}
                                />
                            )}
                        </Section>
                    </TableView>
                    : <TextC>Fehler!</TextC>)}
        </ScrollView>
    );


}

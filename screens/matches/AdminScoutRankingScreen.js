import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import fetchApi from '../../components/fetchApi';
import {useRoute} from "@react-navigation/native";
import {Section, TableView} from "react-native-tableview-simple";
import CellVariant from "../../components/cellVariant";
import {style} from "../../assets/styles";

export default function AdminScoutRankingScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);


    useEffect(() => {
        loadScreenData();
    }, [navigation, route]);

    const loadScreenData = () => {
        fetchApi('scoutRatings/getScrRanking/' + (route.params?.mode ?? ''))
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
                                <View style={style().headerComponentView}>
                                    <TextC>{data.yearSelected?.name ?? data.year.name}
                                        <TextC>{': Team-Wertung'}</TextC>
                                    </TextC>
                                </View>
                            }
                        >
                            {data.object.map(item =>
                                <CellVariant
                                    key={item.scrRanking}
                                    title={item.scrRanking + '. ' + item.team_name}
                                    detail={item.scrPoints + ' P.'}
                                    onPress={() => null}
                                />
                            )}
                        </Section>
                    </TableView>
                    : <TextC>Fehler!</TextC>)}
        </ScrollView>
    );


}

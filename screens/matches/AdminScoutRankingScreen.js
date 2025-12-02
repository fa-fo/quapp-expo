import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, View} from 'react-native';
import fetchApi from '../../components/fetchApi';
import {useRoute} from "@react-navigation/native";
import {Section, TableView} from "react-native-tableview-simple";
import CellVariant from "../../components/cellVariant";
import {style} from "../../assets/styles";
import {Picker} from "@react-native-picker/picker";
import {setHeaderRightOptions} from "../../components/setHeaderRightOptions";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";

export default function AdminScoutRankingScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        loadScreenData();
    }, [navigation, route]);

    const loadScreenData = () => {
        fetchApi('teamYears/getScrRanking/' + (route.params?.year_id ?? 0))
            .then((json) => {
                setData(json);
                setHeaderRightOptions(navigation, route, json, loadScreenData);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const adminAction = (url, parameter) => {
        let postData = {
            'password': global.adminPW,
        };

        fetchApi(url + '/' + parameter, 'POST', postData)
            .then(() => loadScreenData())
            .catch((error) => console.error(error));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' ?
                    <TableView appearance={global.colorScheme}>
                        <Section
                            headerComponent={
                                <View style={[style().matchflexRowView, style().headerComponentView]}>
                                    <View style={{flex: 3}}>
                                        <TextC>{data.object.year_name + ': Team-Wertung'}</TextC>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <Picker
                                            selectedValue={route.params?.year_id ?? 0}
                                            onValueChange={(itemValue) => navigation.navigate(route.name, {year_id: itemValue})}
                                            style={[style().button1, style().pickerSelect]}
                                        >
                                            {data.object.years?.map(year => (
                                                <Picker.Item key={year.id} value={year.id} label={year.name}/>
                                            ))}
                                        </Picker>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'flex-start'}}>
                                        <Pressable style={[style().button1, style().buttonEvent, style().buttonRed]}
                                                   onPress={() => adminAction('teamYears/setScrRanking', (route.params?.year_id ?? 0))}>
                                            <TextC style={style().textButton1}>
                                                <IconMat name="calculator" size={24}/>neu berechnen</TextC>
                                        </Pressable>
                                    </View>
                                </View>
                            }
                        >
                            {data.object.teamYears?.map(item =>
                                <CellVariant
                                    key={item.scrRanking}
                                    title={item.scrRanking + '. ' + item.team_name}
                                    detail={item.scrPoints + ' P/S, ' + item.scrMatchCount + ' Sp.'}
                                    onPress={() => navigation.navigate('AdminScoutTeamLogs', {
                                        team_id: item.team_id,
                                        team_name: item.team_name,
                                        year_id: (route.params?.year_id ?? 0),
                                    })}
                                />
                            )}
                        </Section>
                    </TableView>
                    : <TextC>Fehler!</TextC>)}
        </ScrollView>
    );
}

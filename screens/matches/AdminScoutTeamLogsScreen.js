import {style} from "../../assets/styles";
import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import fetchApi from '../../components/fetchApi';
import {useRoute} from "@react-navigation/native";

export default function AdminScoutTeamLogsScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        loadScreenData();
    }, [navigation, route]);

    const loadScreenData = () => {
        adminAction('teamYears/getScrTeamLogs', (route.params?.team_id ?? 0) + '/' + (route.params?.year_id ?? 0));
    };

    const adminAction = (url, parameter) => {
        let postData = {'password': global.adminPW};

        fetchApi(url + '/' + parameter, 'POST', postData)
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' ?
                    <TextC style={style().teamInfos}>
                        {data.object.scrLogs?.map(text =>
                            <TextC>{text + '\n'}</TextC>
                        )}
                    </TextC>
                    : <TextC>keine Daten</TextC>)}
        </ScrollView>
    );
}

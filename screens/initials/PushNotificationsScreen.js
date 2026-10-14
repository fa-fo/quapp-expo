import TextC from "../../components/customText";
import {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, Pressable, RefreshControl, TextInput, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import fetchApi from '../../components/fetchApi';
import {style} from '../../assets/styles';
import ScrollViewC from "../../components/customScrollView";
import Icon from "@react-native-vector-icons/material-design-icons";

export default function PushNotificationsScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState(0);
    const [mailTitle, setMailTitle] = useState('');
    const [mailBody, setMailBody] = useState('');
    const [isTryingSend, setIsTryingSend] = useState(false);
    const [response, setResponse] = useState(false);
    const [receiptStatus, setReceiptStatus] = useState({});

    useEffect(() => {
        loadScreenData({});
    }, []);

    const loadScreenData = () => {
        fetchApi('teamYears/allWithPushTokenCount')
            .then((json) => setData(json))
            .finally(() => setLoading(false));
    };

    function sendPush(teamId) {
        if (mailTitle !== '' && mailBody !== '') {
            setIsTryingSend(true);

            let postData = {
                'password': global['adminPW'],
                'title': mailTitle,
                'body': mailBody,
            };

            fetchApi('pushTokens/sendByTeam/' + teamId, 'POST', postData)
                .then((json) => setResponse(json))
                .finally(() => setIsTryingSend(false));
        }
    }

    useEffect(() => {
        if (!response?.object) return;

        let cancelled = false;

        // set all ids from response to pending
        const pending = new Set(response.object.map((item) => item.id));

        const checkAll = () => {
            if (pending.size === 0) {
                clearInterval(timer);
                return;
            }

            fetchApi('pushTokens/checkReceipts', 'POST', {
                'password': global['adminPW'],
                'receiptIds': [...pending],
            })
                .then((json) => {
                    const list = json?.object ?? [];

                    list.forEach(({id, status}) => {
                        if (status === 'ok') pending.delete(id);
                    });

                    if (!cancelled) {
                        setReceiptStatus((prev) => ({
                            ...prev,
                            ...Object.fromEntries(list.map(({id, status}) => [id, status])),
                        }));
                    }
                })
        };

        const timer = setInterval(checkAll, 10000);

        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, [response]);

    const {sentOkCount, receiptOkCount} = useMemo(() => {
        const items = response?.object ?? [];
        return {
            sentOkCount: items.filter((i) => i.status === 'ok').length,
            receiptOkCount: items.filter((i) => (receiptStatus?.[i.id] ?? '') === 'ok').length,
        };
    }, [response, receiptStatus]);


    return (
        <ScrollViewC refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' ? (
                    <View style={style().centeredView}>
                        <TextC>Push-Nachricht an Team:</TextC>
                        <Picker
                            selectedValue={selectedTeamId}
                            onValueChange={(itemValue) => setSelectedTeamId(itemValue)}
                            style={[style().button1, style().pickerSelect]}
                        >
                            <Picker.Item key="0" value="0" label="alle Teams"/>
                            {data ? data.object.map(item => (
                                <Picker.Item key={item.id} value={item.team_id}
                                             label={item.team.name + '(' + item.countPushTokens + ')'}/>
                            )) : null}
                        </Picker>
                        <TextC>Nachrichtentitel:</TextC>
                        <TextInput
                            style={[style().textInput, {width: '100%'}]}
                            multiline={false}
                            numberOfLines={1}
                            onChangeText={setMailTitle}
                            value={mailTitle}
                            placeholder="Hier Titel der Nachricht eingeben"
                        />
                        <TextC>Nachrichtentext:</TextC>
                        <TextInput
                            style={[style().textInput, {width: '100%'}]}
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={setMailBody}
                            value={mailBody}
                            placeholder="Hier Text eingeben"
                        />
                        <Pressable style={[style().button1, style().buttonGreen]}
                                   disabled={isTryingSend}
                                   onPress={() => sendPush(selectedTeamId)}>
                            {isTryingSend ?
                                <ActivityIndicator size={18} color="white"/>
                                :
                                <Icon name='send-outline' size={18} color='white'/>
                            }
                            <TextC style={style().textButton1}>Senden</TextC>
                        </Pressable>
                        <View>
                            {response?.object ? (
                                <>
                                    <TextC>
                                        Gesamt: {response.object.length} - sent ok: {sentOkCount} - receipt
                                        ok: {receiptOkCount}
                                        {'\n\n'}
                                    </TextC>
                                    {response.object.map((item) => (
                                        <TextC key={item.id}>
                                            {item.id}: sent:{item.status} - receipt:{receiptStatus[item.id] ?? '…'}
                                        </TextC>
                                    ))}
                                </>
                            ) : null}
                        </View>
                    </View>
                ) : <TextC>Fehler!</TextC>)}
        </ScrollViewC>
    );
}

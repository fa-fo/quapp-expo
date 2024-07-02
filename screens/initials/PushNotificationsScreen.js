import * as React from 'react';
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, Text, TextInput, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import fetchApi from '../../components/fetchApi';
import styles from '../../assets/styles';

export default function PushNotificationsScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState(0);
    const [mailTitle, setMailTitle] = useState('');
    const [mailBody, setMailBody] = useState('');

    useEffect(() => {
        loadScreenData({});
    }, []);

    const loadScreenData = () => {
        fetchApi('teamYears/allWithPushTokenCount')
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    function sendPushNotification(teamId) {
        let postData = {
            'password': global['adminPW'],
        };

        fetchApi('pushTokens/byTeam/' + teamId, 'POST', postData)
            .then((json) => {
                json.object.map(async token => (
                    await sendItem(token.expoPushToken)
                ))
            })
            .catch((error) => console.error(error));
    }

    async function sendItem(expoPushToken) {
        const message = {
            to: expoPushToken,
            sound: 'default',
            channelId: 'default',
            ttl: 3600,
            title: mailTitle,
            body: mailBody,
        };

        await fetch('https://api.expo.dev/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    }

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {isLoading ? null :
                (data?.status === 'success' ? (
                    <View style={styles.centeredView}>
                        <Text>Push-Nachricht an Team:</Text>
                        <Picker
                            selectedValue={selectedTeamId}
                            onValueChange={(itemValue) => setSelectedTeamId(itemValue)}
                            style={[styles.button1, styles.pickerSelect]}
                        >
                            <Picker.Item key="0" value="0" label="alle Teams"/>
                            {data ? data.object.map(item => (
                                <Picker.Item key={item.id} value={item.team_id}
                                             label={item.team.name + '(' + item.countPushTokens + ')'}/>
                            )) : null}
                        </Picker>
                        <Text>Nachrichtentitel:</Text>
                        <TextInput
                            style={[styles.textInput, {width: '100%'}]}
                            multiline={false}
                            numberOfLines={1}
                            onChangeText={setMailTitle}
                            value={mailTitle}
                            placeholder="Hier Titel der Nachricht eingeben"
                        />
                        <Text>Nachrichtentext:</Text>
                        <TextInput
                            style={[styles.textInput, {width: '100%'}]}
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={setMailBody}
                            value={mailBody}
                            placeholder="Hier Text eingeben"
                        />
                        <Pressable style={[styles.button1, styles.buttonGreen]}
                                   onPress={() => sendPushNotification(selectedTeamId)}>
                            <Text style={styles.textButton1}>Senden</Text>
                        </Pressable>

                    </View>
                ) : <Text>Fehler!</Text>)}
        </ScrollView>
    );
}

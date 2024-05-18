import * as React from 'react';
import {useEffect, useState} from 'react';
import {Image, Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import fetchApi from '../../components/fetchApi';
import styles from "../../assets/styles";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";

export default function AdminMatchPhotosScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [photoKey, setPhotoKey] = useState(null);

    useEffect(() => {
        loadScreenData({});
    }, []);

    const loadScreenData = () => {
        let postData = {password: global.adminPW};
        fetchApi('matcheventLogs/getPhotosToCheck', 'POST', postData)
            .then((json) => {
                setData(json);
                setPhotoKey(0);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const setCheck = async (isOk) => {
        setLoading(true);
        let postData = {password: global.adminPW};
        fetchApi('matcheventLogs/setPhotoCheck/' + data.object[photoKey].id + '/' + isOk, 'POST', postData)
            .then((json) => {
                setPhotoKey(photoKey + 1);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            <Text>Noch {data?.object?.length - photoKey} Fotos zu prüfen</Text>
            <View style={[styles.matchflexEventsView, {height: 600}]}>
                {isLoading ? null :
                    (data?.status === 'success' ?
                        (data.object[photoKey] ? (
                                <View style={{
                                    position: 'absolute',
                                    top: 0,
                                    width: '100%',
                                    height: 600,
                                    backgroundColor: 'green'
                                }}>
                                    <Image
                                        style={{width: '100%', height: 600, resizeMode: 'contain'}}
                                        source={{uri: global.baseUrl + 'webroot/img/' + data.year.name + '/original/' + data.object[photoKey].match_id + '_' + data.object[photoKey].id + '.jpg'}}
                                    />
                                    <View style={styles.toprightButtonContainer}>
                                        <Pressable
                                            style={[styles.button1, styles.buttonEvent, styles.buttonRed]}
                                            onPress={() => setCheck(0)}
                                        >
                                            <IconMat name='delete-outline' size={48} color='#fff'/>
                                        </Pressable>
                                    </View>
                                    <View style={styles.bottomButtonContainer}>
                                        <Pressable
                                            style={[styles.button1, styles.buttonEvent, styles.buttonGreen]}
                                            onPress={() => setCheck(1)}
                                        >
                                            <IconMat name='eye-check' size={48} color='#fff'/>
                                            <Text style={[styles.textButton1, {textAlign: 'center'}]}>OK</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ) : (
                                <View>
                                    <Text>keine Fotos zu prüfen</Text>
                                    <Pressable
                                        style={[styles.button1, styles.buttonEvent, styles.buttonGreen]}
                                        onPress={loadScreenData}
                                    >
                                        <IconMat name='reload' size={48} color='#fff'/>
                                        <Text style={[styles.textButton1, {textAlign: 'center'}]}>Suchen</Text>
                                    </Pressable>
                                </View>)
                        ) : <Text>Fehler!</Text>)}
            </View>
        </ScrollView>
    );
}

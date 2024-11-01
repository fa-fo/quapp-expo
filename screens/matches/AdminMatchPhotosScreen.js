import * as React from 'react';
import {useEffect, useState} from 'react';
import {Image, Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import fetchApi from '../../components/fetchApi';
import styles from "../../assets/styles";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import CellVariantMatches from "../../components/cellVariantMatches";
import * as DateFunctions from "../../components/functions/DateFunctions";
import * as ColorFunctions from "../../components/functions/ColorFunctions";

export default function AdminMatchPhotosScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [photoKey, setPhotoKey] = useState(null);

    useEffect(() => {
        loadScreenData();
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

    useEffect(() => {
        const interval =
            setInterval(() => {
                loadScreenData();
            }, 1000 * 60 * 5);

        return () => {
            clearInterval(interval);
        };
    }, [])

    const setCheck = async (isOk) => {
        setLoading(true);
        let postData = {password: global.adminPW};
        fetchApi('matcheventLogs/setPhotoCheck/' + data.object.toCheck[photoKey].id + '/' + isOk, 'POST', postData)
            .then((json) => {
                setPhotoKey(photoKey + 1);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            <Text>Bisher {data?.object?.okCount} ok - {data?.object?.notOkCount} notOk --
                noch {data?.object?.toCheck.length - photoKey} Fotos zu prüfen</Text>
            <View>
                {isLoading ? null :
                    (data?.status === 'success' ?
                        <View>
                            <View style={[styles.matchflexEventsView, {height: 600}]}>
                                {data.object.toCheck[photoKey] ?
                                    <View style={{
                                        position: 'absolute',
                                        top: 0,
                                        width: '100%',
                                        height: 600,
                                        backgroundColor: 'green'
                                    }}>
                                        <Image
                                            style={{width: '100%', height: 600, resizeMode: 'contain'}}
                                            source={{uri: global.baseUrl + 'webroot/img/' + data.year.name + '/original/' + data.object.toCheck[photoKey].match_id + '_' + data.object.toCheck[photoKey].id + '.jpg'}}
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
                                    :
                                    <View>
                                        <Text>keine Fotos zu prüfen</Text>
                                        <Pressable
                                            style={[styles.button1, styles.buttonEvent, styles.buttonGreen]}
                                            onPress={loadScreenData}
                                        >
                                            <IconMat name='reload' size={48} color='#fff'/>
                                            <Text style={[styles.textButton1, {textAlign: 'center'}]}>Suchen</Text>
                                        </Pressable>
                                    </View>
                                }
                            </View>
                            <View>
                                <Text>Letzte Prüfergebnisse:</Text>
                                {data.object?.lastChecked?.map(item =>
                                    <CellVariantMatches
                                        key={item.id}
                                        item={item.match}
                                        timeText={DateFunctions.getFormatted(item.match.matchStartTime) + ' Uhr: '}
                                        team1Result={item.match.resultGoals1 !== null ? (parseInt(item.match.resultGoals1) || 0) : null}
                                        team2Result={item.match.resultGoals2 !== null ? (parseInt(item.match.resultGoals2) || 0) : null}
                                        onPress={() => navigation.navigate('MatchDetailsAdmin', {item: item.match})}
                                        backgroundColor={item.playerNumber === 1 ? ColorFunctions.getColor('GreenLightBg') : ColorFunctions.getColor('RedLightBg')}
                                    />
                                )}
                            </View>
                        </View>
                        : <Text>Fehler!</Text>)}
            </View>
        </ScrollView>
    );
}

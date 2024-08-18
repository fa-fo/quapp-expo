import * as React from 'react';
import {useEffect, useState} from 'react';
import {ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, Text, View} from 'react-native';
import styles from '../../assets/styles.js';
import {useRoute} from '@react-navigation/native';
import fetchApi from '../../components/fetchApi';
import MatchDetailsLoginModal from './modals/MatchDetailsLoginModal';
import MatchDetailsPhotoModal from "./modals/MatchDetailsPhotoModal";
import * as ConfirmFunctions from "../../components/functions/ConfirmFunctions";
import * as DateFunctions from "../../components/functions/DateFunctions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import imgNotAvailable from '../../assets/images/imgNotAvailable.png';

export default function MatchDetailsScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [photoSelected, setPhotoSelected] = useState(null);

    useEffect(() => {
        return navigation.addListener('focus', () => {
            setLoading(true);
            loadScreenData();
        });
    }, [route]);

    const loadScreenData = () => {
        fetchApi('matches/byId/' + route.params.item.id)
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        isLoading ? <ActivityIndicator size="large" color="#00ff00" style={styles.actInd}/> :
            (data?.status === 'success' ?
                data.object.map(item =>
                    <ScrollView key={item.id}
                                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}
                                contentContainerStyle={styles.matchDetailsView}>
                        {global.settings.isTest && item.group.year.id === data.year.id ?
                            <Text style={styles.testMode}>{global.hintTestData}</Text> : null}
                        <Text numberOfLines={1} style={styles.centeredText100}>QuattFo {item.group.year.name},
                            Tag {item.group.day_id}</Text>
                        <Text numberOfLines={1} style={styles.centeredText100}>Runde {item.round.id},
                            Gruppe {item.group_name}</Text>
                        <Text numberOfLines={2} style={[styles.centeredText100, styles.big2]}
                              adjustsFontSizeToFit>{item.teams1.name + (item.isTest ? '_test' : '')}</Text>
                        <Text numberOfLines={1} style={[styles.centeredText100, styles.small]}>vs</Text>
                        <Text numberOfLines={2} style={[styles.centeredText100, styles.big2]}
                              adjustsFontSizeToFit>{item.teams2.name + (item.isTest ? '_test' : '')}</Text>
                        <Text> </Text>
                        <Text numberOfLines={1}
                              style={styles.centeredText100}>SR: {item.teams3.name + (item.isTest ? '_test' : '')}</Text>
                        {item.teams4 ?
                            <Text numberOfLines={1} style={[styles.centeredText100, styles.textGreen]}>
                                <Text
                                    style={styles.textViolet}>Ersatz-SR:</Text> {item.teams4.name + (item.isTest ? '_test' : '')}
                            </Text>
                            : null}
                        <Text> </Text>
                        <Text numberOfLines={1} style={styles.centeredText100}>
                            Spielbeginn: {DateFunctions.getDateTimeFormatted(item.matchStartTime) + ' Uhr: '}
                        </Text>
                        <Text numberOfLines={1} style={[styles.centeredText100, styles.big3]}>
                            {item.sport.name} Feld {item.group_name}
                        </Text>

                        {!item.logsCalc.isMatchStarted && !item.logsCalc.isResultConfirmed ?
                            <Text numberOfLines={1} style={[styles.centeredText100, styles.big1]}>_:_</Text>
                            : null}

                        {item.logsCalc.isResultConfirmed ?
                            <View style={styles.centeredText100}>
                                {item.round.autoUpdateResults
                                || route.name === 'MatchDetailsSupervisor' || route.name === 'MatchDetailsAdmin' ?
                                    <View style={styles.viewCentered}>
                                        <Text numberOfLines={1}
                                              style={[styles.centeredText100, styles.small]}>Endstand</Text>
                                        <Text numberOfLines={1} style={[styles.centeredText100, styles.big3]}>
                                            {item.logsCalc.score ? parseInt(item.logsCalc.score[item.team1_id]) || 0 : 0} : {item.logsCalc.score ? parseInt(item.logsCalc.score[item.team2_id]) || 0 : 0}
                                        </Text>
                                        <Text numberOfLines={1} style={[styles.centeredText100, styles.small]}>nach
                                            Toren</Text>
                                        {item.resultTrend > 2 ?
                                            <Text numberOfLines={1} style={[styles.centeredText100, styles.textRed]}>
                                                {ConfirmFunctions.getConfirmResultText(item.resultTrend)}-Wertung
                                            </Text> : null}
                                        <Text> </Text>
                                        <Text numberOfLines={1} style={[styles.centeredText100, styles.small]}>Wertung
                                            mit
                                            Faktor {item.sport.goalFactor}</Text>
                                        <Text numberOfLines={1} style={[styles.centeredText100, styles.big1]}>
                                            {parseInt(item.resultGoals1) || 0} : {parseInt(item.resultGoals2) || 0}
                                        </Text>
                                        <Text numberOfLines={1} style={styles.centeredText100}>Ergebnis bestätigt</Text>
                                    </View>
                                    : <Text numberOfLines={1}
                                            style={styles.textRed}>{global.hintAutoUpdateResults}</Text>}
                            </View> : null}

                        {item.logsCalc.isMatchStarted && !item.logsCalc.isResultConfirmed ?
                            <View style={[styles.centeredText100, styles.viewCentered]}>
                                {item.round.autoUpdateResults
                                || route.name === 'MatchDetailsSupervisor' || route.name === 'MatchDetailsAdmin'
                                || global.myTeamId === item.team1_id || global.myTeamId === item.team2_id ?
                                    <Text numberOfLines={1}
                                          style={[styles.centeredText100, styles.big1, styles.textRed]}>
                                        {item.logsCalc.score ? parseInt(item.logsCalc.score[item.team1_id] ?? 0) || 0 : 0} : {item.logsCalc.score ? parseInt(item.logsCalc.score[item.team2_id]) || 0 : 0}
                                    </Text>
                                    :
                                    <Text style={styles.textRed}>{global.hintAutoUpdateResults}</Text>
                                }
                                {item.logsCalc.isMatchLive ?
                                    <Text numberOfLines={1}
                                          style={[styles.centeredText100, styles.textRed]}>Live!</Text> : null}
                                {item.logsCalc.isMatchEnded ?
                                    <Text numberOfLines={1} style={[styles.centeredText100, styles.textRed]}>Spiel
                                        beendet</Text> : null}
                                {item.logsCalc.isMatchEnded && !item.logsCalc.isResultConfirmed ?
                                    <Text numberOfLines={1} style={[styles.centeredText100, styles.textRed]}>Ergebnis
                                        noch nicht bestätigt</Text> : null}
                            </View> : null}
                        <Text> </Text>
                        {item.canceled > 0 ?
                            <Text numberOfLines={1} style={[styles.centeredText100, styles.textRed]}>Das Spiel fällt
                                aus!</Text> : null}
                        {item.canceled === 1 || item.canceled === 3 ?
                            <Text numberOfLines={1} style={[styles.centeredText100, styles.textRed]}>
                                {item.teams1.name + (item.isTest ? '_test' : '')} zurückgezogen
                            </Text> : null}
                        {item.canceled === 2 || item.canceled === 3 ?
                            <Text numberOfLines={1} style={[styles.centeredText100, styles.textRed]}>
                                {item.teams2.name + (item.isTest ? '_test' : '')} zurückgezogen
                            </Text> : null}

                        {item.isTime2login && !item.canceled ?
                            (!item.logsCalc.isMatchConcluded || (global.settings.maxPhotos > 0 && (item.logsCalc.photos?.length ?? 0) < global.settings.maxPhotos) ?
                                (window?.location?.hostname === 'api.quattfo.de' ? null
                                    :
                                    <Pressable
                                        style={[styles.button1, (item.logsCalc.isLoggedIn ? styles.buttonGrey : styles.buttonGreen)]}
                                        onPress={() => setModalVisible(true)}
                                        disabled={(!!item.logsCalc.isLoggedIn)}
                                    >
                                        <Text style={styles.textButton1}>
                                            <Icon name="login" size={30}/>
                                            {item.logsCalc.isLoggedIn ? 'Spielprotokollierung bereits gestartet' :
                                                item.logsCalc.isMatchConcluded ? 'Fotos hochladen' :
                                                    item.logsCalc.isMatchStarted ? 'Spielprotokollierung fortsetzen' :
                                                        'Jetzt einloggen\nund Spielprotokollierung starten'
                                            }
                                        </Text>
                                    </Pressable>) : null) : null}

                        {(!item.isTime2login || global.settings.isTest) && item.logsCalc.photos?.length > 0 ?
                            <View style={styles.matchflexRowView}>
                                {item.logsCalc.photos?.map(photo =>
                                    (route.name === 'MatchDetailsAdmin' || photo.checked !== 0 ?
                                        <View key={photo.id} style={styles.matchImg}>
                                            <Pressable
                                                onPress={() => {
                                                    if (route.name === 'MatchDetailsAdmin' || photo.checked) {
                                                        setPhotoSelected(photo);
                                                        setPhotoModalVisible(true);
                                                    }
                                                }}
                                            >
                                                <Image
                                                    style={[{width: 120, height: 90, resizeMode: 'contain'},
                                                        route.name === 'MatchDetailsAdmin' && photo.checked === 0 ? styles.borderRed : null,
                                                        route.name === 'MatchDetailsAdmin' && photo.checked === null ? styles.borderBlue : null
                                                    ]}
                                                    source={photo.checked || route.name === 'MatchDetailsAdmin' ?
                                                        {uri: global.baseUrl + 'webroot/img/' + item.group.year.name + '/thumbs/' + item.id + '_' + photo.id + '.jpg'}
                                                        : imgNotAvailable
                                                    }
                                                />
                                            </Pressable>
                                        </View> : null)
                                )}
                            </View>
                            : null}

                        <MatchDetailsLoginModal
                            setModalVisible={setModalVisible}
                            modalVisible={modalVisible}
                            navigation={navigation}
                            item={item}
                        />
                        <MatchDetailsPhotoModal
                            route={route}
                            photoSelected={photoSelected}
                            setModalVisible={setPhotoModalVisible}
                            modalVisible={photoModalVisible}
                            loadScreenData={loadScreenData}
                        />
                    </ScrollView>
                )
                : <Text>Fehler!</Text>)
    );
}

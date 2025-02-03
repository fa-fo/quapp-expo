import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, View} from 'react-native';
import {style} from '../../assets/styles.js';
import {useIsFocused, useRoute} from '@react-navigation/native';
import fetchApi from '../../components/fetchApi';
import MatchDetailsLoginModal from './modals/MatchDetailsLoginModal';
import MatchDetailsPhotoModal from "./modals/MatchDetailsPhotoModal";
import * as ConfirmFunctions from "../../components/functions/ConfirmFunctions";
import * as DateFunctions from "../../components/functions/DateFunctions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import imgNotAvailable from '../../assets/images/imgNotAvailable.png';

export default function MatchDetailsScreen({navigation}) {
    const route = useRoute();
    const isFocused = useIsFocused();
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

    // reload to check for result confirmation
    useEffect(() => {
        if (data?.object && data.object[0].logsCalc.isMatchEnded && !data.object[0].logsCalc.isResultConfirmed) {
            const timer = setTimeout(() => {
                if (isFocused && !modalVisible && !photoModalVisible) {
                    setLoading(true);
                    loadScreenData();
                }
            }, 60000);

            return () => clearTimeout(timer);
        }
    }, [data]);

    const loadScreenData = () => {
        fetchApi('matches/byId/' + route.params.item.id)
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        isLoading ? <ActivityIndicator size="large" color="#00ff00" style={style().actInd}/> :
            (data?.status === 'success' ?
                data.object.map(item =>
                    <ScrollView key={item.id}
                                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}
                                contentContainerStyle={style().matchDetailsView}>
                        {global.settings.isTest && item.group.year.id === data.year.id ?
                            <TextC style={style().testMode}>{global.hintTestData}</TextC> : null}
                        <TextC numberOfLines={1} style={style().centeredText100}>QuattFo {item.group.year.name},
                            Tag {item.group.day_id}</TextC>
                        <TextC numberOfLines={1} style={style().centeredText100}>Runde {item.round.id},
                            Gruppe {item.group_name}</TextC>
                        <TextC numberOfLines={2} style={[style().centeredText100, style().big2]}
                               adjustsFontSizeToFit>{item.teams1.name + (item.isTest ? '_test' : '')}</TextC>
                        <TextC numberOfLines={1} style={[style().centeredText100, style().small]}>vs</TextC>
                        <TextC numberOfLines={2} style={[style().centeredText100, style().big2]}
                               adjustsFontSizeToFit>{item.teams2.name + (item.isTest ? '_test' : '')}</TextC>
                        <TextC> </TextC>
                        {item.teams3 ?
                            <TextC numberOfLines={1}
                                   style={style().centeredText100}>SR: {item.teams3.name + (item.isTest ? '_test' : '')}
                            </TextC> : null}
                        {item.teams4 ?
                            <TextC numberOfLines={1} style={[style().centeredText100, style().textGreen]}>
                                <TextC
                                    style={style().textViolet}>Ersatz-SR:</TextC> {item.teams4.name + (item.isTest ? '_test' : '')}
                            </TextC> : null}
                        {item.refereeName ?
                            <TextC numberOfLines={1}
                                   style={style().centeredText100}>SR: {item.refereeName}
                            </TextC> : null}
                        <TextC> </TextC>
                        <TextC numberOfLines={1} style={style().centeredText100}>
                            Spielbeginn: {DateFunctions.getDateTimeFormatted(item.matchStartTime) + ' Uhr: '}
                        </TextC>
                        <TextC numberOfLines={1} style={[style().centeredText100, style().big3]}>
                            {item.sport.name} Feld {item.group_name}
                        </TextC>

                        {!item.logsCalc.isMatchStarted && !item.logsCalc.isResultConfirmed ?
                            <TextC numberOfLines={1} style={[style().centeredText100, style().big1]}>_:_</TextC>
                            : null}

                        {item.logsCalc.isResultConfirmed ?
                            <View style={style().centeredText100}>
                                {item.round.autoUpdateResults
                                || route.name === 'MatchDetailsSupervisor' || route.name === 'MatchDetailsAdmin' ?
                                    <View style={style().viewCentered}>
                                        <TextC numberOfLines={1}
                                               style={[style().centeredText100, style().small]}>Endstand</TextC>
                                        <TextC numberOfLines={1} style={[style().centeredText100, style().big3]}>
                                            {item.logsCalc.score ? parseInt(item.logsCalc.score[item.team1_id]) || 0 : 0} : {item.logsCalc.score ? parseInt(item.logsCalc.score[item.team2_id]) || 0 : 0}
                                        </TextC>
                                        <TextC numberOfLines={1} style={[style().centeredText100, style().small]}>
                                            nach Toren</TextC>
                                        {item.resultTrend > 2 ?
                                            <TextC numberOfLines={1} style={[style().centeredText100, style().textRed]}>
                                                {ConfirmFunctions.getConfirmResultText(item.resultTrend)}-Wertung
                                            </TextC> : null}
                                        <TextC> </TextC>
                                        <TextC numberOfLines={1} style={[style().centeredText100, style().small]}>
                                            Wertung mit Faktor {item.sport.goalFactor}</TextC>
                                        <TextC numberOfLines={1} style={[style().centeredText100, style().big1]}>
                                            {parseInt(item.resultGoals1) || 0} : {parseInt(item.resultGoals2) || 0}
                                        </TextC>
                                        {item.resultAdmin === 1 ?
                                            <TextC numberOfLines={1} style={[style().centeredText100, style().textRed]}>
                                                <TextC> {'\u2714'} </TextC>
                                                Ergebnis durch Admins korrigiert</TextC> : null}
                                        {item.resultAdmin === 2 ?
                                            <TextC numberOfLines={1} style={[style().centeredText100, style().textRed]}>
                                                <TextC> {'\u2714'} </TextC>
                                                Ergebnisübertrag aus Papierbogen</TextC> : null}
                                        <TextC numberOfLines={1} style={style().centeredText100}>
                                            <TextC style={style().textGreen}> {'\u2714'} </TextC>Ergebnis bestätigt
                                        </TextC>
                                    </View>
                                    : <TextC numberOfLines={1}
                                             style={style().textRed}>{global.hintAutoUpdateResults}</TextC>}
                            </View> : null}

                        {item.logsCalc.isMatchStarted && !item.logsCalc.isResultConfirmed ?
                            <View style={[style().centeredText100, style().viewCentered]}>
                                {item.round.autoUpdateResults
                                || route.name === 'MatchDetailsSupervisor' || route.name === 'MatchDetailsAdmin'
                                || global.myTeamId === item.team1_id || global.myTeamId === item.team2_id ?
                                    <TextC numberOfLines={1}
                                           style={[style().centeredText100, style().big1, style().textRed]}>
                                        {item.logsCalc.score ? parseInt(item.logsCalc.score[item.team1_id] ?? 0) || 0 : 0} : {item.logsCalc.score ? parseInt(item.logsCalc.score[item.team2_id]) || 0 : 0}
                                    </TextC>
                                    :
                                    <TextC style={style().textRed}>{global.hintAutoUpdateResults}</TextC>
                                }
                                {item.logsCalc.isMatchLive ?
                                    <TextC numberOfLines={1} style={[style().centeredText100, style().textRed]}>
                                        Live!</TextC> : null}
                                {item.logsCalc.isMatchEnded ?
                                    <TextC numberOfLines={1} style={[style().centeredText100, style().textRed]}>
                                        Spiel beendet</TextC> : null}
                                {item.logsCalc.isMatchEnded && !item.logsCalc.isResultConfirmed ?
                                    <TextC numberOfLines={1} style={[style().centeredText100, style().textRed]}>
                                        Ergebnis noch nicht bestätigt</TextC> : null}
                            </View> : null}
                        <TextC> </TextC>
                        {item.canceled > 0 ?
                            <TextC numberOfLines={1} style={[style().centeredText100, style().textRed]}>
                                Das Spiel fällt aus!</TextC> : null}
                        {item.canceled === 1 || item.canceled === 3 ?
                            <TextC numberOfLines={1} style={[style().centeredText100, style().textRed]}>
                                {item.teams1.name + (item.isTest ? '_test' : '')} zurückgezogen
                            </TextC> : null}
                        {item.canceled === 2 || item.canceled === 3 ?
                            <TextC numberOfLines={1} style={[style().centeredText100, style().textRed]}>
                                {item.teams2.name + (item.isTest ? '_test' : '')} zurückgezogen
                            </TextC> : null}

                        {item.isTime2login && !item.canceled ?
                            (!item.logsCalc.isMatchConcluded || (global.settings.maxPhotos > 0 && (item.logsCalc.photos?.length ?? 0) < global.settings.maxPhotos) ?
                                (window?.location?.hostname === 'api.quattfo.de' ? null
                                    :
                                    <Pressable
                                        style={[style().button1, (item.logsCalc.isLoggedIn ? style().buttonGrey : style().buttonGreen)]}
                                        onPress={() => setModalVisible(true)}
                                        disabled={(!!item.logsCalc.isLoggedIn)}
                                    >
                                        <TextC style={style().textButton1}>
                                            <Icon name="login" size={30}/>
                                            {item.logsCalc.isLoggedIn ? 'Spielprotokollierung bereits gestartet' :
                                                item.logsCalc.isMatchConcluded ? 'Fotos hochladen' :
                                                    item.logsCalc.isMatchStarted ? 'Spielprotokollierung fortsetzen' :
                                                        'Jetzt einloggen\nund Spielprotokollierung starten'
                                            }
                                        </TextC>
                                    </Pressable>) : null) : null}

                        {(!item.isTime2login || global.settings.isTest) && item.logsCalc.photos?.length > 0 ?
                            <View style={style().matchflexRowView}>
                                {item.logsCalc.photos?.map(photo =>
                                    (route.name === 'MatchDetailsAdmin' || photo.checked !== 0 ?
                                        <View key={photo.id} style={style().matchImg}>
                                            <Pressable
                                                onPress={() => {
                                                    if (route.name === 'MatchDetailsAdmin' || photo.checked) {
                                                        setPhotoSelected(photo);
                                                        setPhotoModalVisible(true);
                                                    }
                                                }}
                                            >
                                                <Image
                                                    resizeMode={'contain'}
                                                    style={[{width: 120, height: 90},
                                                        route.name === 'MatchDetailsAdmin' && photo.checked === 0 ? style().borderRed : null,
                                                        route.name === 'MatchDetailsAdmin' && photo.checked === null ? style().borderBlue : null
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
                : <TextC>Fehler!</TextC>)
    );
}

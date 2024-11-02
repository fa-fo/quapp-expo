import TextC from "../../../components/customText";
import {useRef, useState} from 'react';
import {Modal, Pressable, TextInput, View} from 'react-native';
import {style} from '../../../assets/styles.js';
import fetchApi from '../../../components/fetchApi';
import * as DateFunctions from "../../../components/functions/DateFunctions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function MatchDetailsLoginModal({setModalVisible, modalVisible, navigation, item}) {
    const [refereePin, setRefereePin] = useState(global.settings.isTest ? '12345' : (global['refereePIN' + item.id] ?? ''));
    const [textPinEmptyVisible, setTextPinEmptyVisible] = useState(false);
    const [textPinWrongVisible, setTextPinWrongVisible] = useState(false);
    const inputRef = useRef();

    const tryLogin = (item) => {
        if (refereePin !== '') {
            let postData = {
                'refereePIN': refereePin,
                'matchEventCode': 'LOGIN',
                'datetimeSent': DateFunctions.getLocalDatetime(),
            };

            fetchApi('matcheventLogs/login/' + item.id, 'POST', postData)
                .then((data) => {
                    if (data?.status === 'success') {
                        setModalVisible(false);
                        global['refereePIN' + item.id] = refereePin;
                        navigation.navigate('MatchLogs', {item: data.object[0]});
                    } else {
                        setTextPinWrongVisible(true);
                    }
                })
                .catch((error) => console.error(error));
        } else {
            setTextPinEmptyVisible(true);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onShow={() => {
                if (refereePin === '') {
                    setTimeout(() => {
                        inputRef?.current?.focus()
                    }, 50)
                }
            }}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <View style={style().centeredView}>
                <View style={style().modalView}>
                    <TextC>Hier bitte 5-stelligen SR-PIN eingeben: </TextC>
                    {global.settings.isTest ?
                        <TextC style={style().testMode}>Beim Turnier braucht ihr hier euren Team-PIN, den ihr zusammen mit
                            dem endgültigen Spielplan vor Turnierbeginn bekommt! Mit dem Testmodus-PIN (12345) könnt ihr
                            jetzt testen:</TextC> : null}
                    <TextInput style={style().textInput}
                               onChangeText={setRefereePin}
                               placeholder="Hier PIN eingeben"
                               keyboardType="numeric"
                               value={refereePin}
                               maxLength={5}
                               ref={inputRef}
                               onSubmitEditing={() => tryLogin(item)}
                    />
                    {textPinWrongVisible ? <TextC style={style().failureText}>falscher PIN?</TextC> : null}
                    {textPinEmptyVisible && refereePin === '' ?
                        <TextC style={style().failureText}>Bitte PIN eingeben</TextC> : null}
                    <Pressable style={[style().button1, style().buttonBig1, style().buttonGreen]}
                               onPress={() => tryLogin(item)}>
                        <TextC style={[style().textButton1, style().teamInfos]}><Icon name="login"
                                                                                   size={28}/> einloggen</TextC>
                    </Pressable>
                    <TextC> </TextC>
                    <Pressable style={[style().button1, style().buttonGrey]}
                               onPress={() => setModalVisible(false)}>
                        <TextC style={style().textButton1}>Schließen</TextC>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}


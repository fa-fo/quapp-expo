import TextC from "../../../components/customText";
import {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Modal, Pressable, TextInput, View} from 'react-native';
import {style} from '../../../assets/styles.js';
import fetchApi from '../../../components/fetchApi';
import * as DateFunctions from "../../../components/functions/DateFunctions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function MatchDetailsLoginModal({setModalVisible, modalVisible, navigation, item}) {
    const [refereePin, setRefereePin] = useState(global['refereePIN' + item.id] ?? '');
    const [textPinEmptyVisible, setTextPinEmptyVisible] = useState(false);
    const [textPinWrongVisible, setTextPinWrongVisible] = useState(false);
    const [isPasswordOk, setIsPasswordOk] = useState(false);
    const [isTryingLogin, setIsTryingLogin] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        setTextPinWrongVisible(false);

        if (refereePin.length === 5 && modalVisible) {
            setTimeout(() => {
                tryLogin(item)
            }, 500)
        }
    }, [refereePin, modalVisible]);

    const tryLogin = (item) => {
        if (refereePin !== '') {
            setIsTryingLogin(true);

            let postData = {
                'refereePIN': refereePin,
                'matchEventCode': 'LOGIN',
                'datetimeSent': DateFunctions.getLocalDatetime(),
            };

            fetchApi('matcheventLogs/login/' + item.id, 'POST', postData)
                .then((data) => {
                    if (data?.status === 'success') {
                        setIsPasswordOk(true);
                        global['refereePIN' + item.id] = refereePin;
                        navigation.preload('MatchLogs', {item: data.object[0]});
                        setTimeout(() => {
                            setModalVisible(false);
                            setIsPasswordOk(false);
                            setIsTryingLogin(false);
                            navigation.navigate('MatchLogs', {item: data.object[0]});
                        }, 1000)
                    } else {
                        setTextPinWrongVisible(true);
                        inputRef?.current?.focus();
                    }
                })
                .catch((error) => console.error(error))
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
                        <TextC style={style().testMode}>Beim Turnier braucht ihr hier euren Team-PIN, den ihr zusammen
                            mit
                            dem endgültigen Spielplan vor Turnierbeginn bekommt! Mit dem Testmodus-PIN (12345) könnt ihr
                            jetzt testen:</TextC> : null}

                    <View>
                        <TextInput style={[style().textInput, style().textInputLarge]}
                                   onChangeText={setRefereePin}
                                   placeholder="Hier PIN eingeben"
                                   keyboardType="numeric"
                                   value={refereePin}
                                   maxLength={5}
                                   ref={inputRef}
                                   disabled={isTryingLogin}
                                   onSubmitEditing={() => tryLogin(item)}
                        />
                        {isPasswordOk ?
                            <Icon name="checkbox-marked-circle" size={46}
                                  style={{position: 'absolute', right: 0, top: 5, color: 'green'}}/>
                            : null}
                    </View>
                    <View style={{height: 40, padding: 10}}>
                        {isTryingLogin ? <ActivityIndicator size={36} color="green"/> : null}
                    </View>

                    {textPinWrongVisible ? <TextC style={style().failureText}>falscher PIN?</TextC> : null}
                    {textPinEmptyVisible && refereePin === '' ?
                        <TextC style={style().failureText}>Bitte PIN eingeben</TextC> : null}
                    <TextC> </TextC>

                    {!isTryingLogin ?
                        <Pressable style={[style().button1, style().buttonGrey]}
                                   onPress={() => setModalVisible(false)}>
                            <TextC style={style().textButton1}>Schließen</TextC>
                        </Pressable> : null}
                </View>
            </View>
        </Modal>
    );
}


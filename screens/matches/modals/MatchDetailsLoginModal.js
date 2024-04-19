import * as React from 'react';
import {useState} from 'react';
import {Modal, Pressable, Text, TextInput, View} from 'react-native';
import styles from '../../../assets/styles.js';
import fetchApi from '../../../components/fetchApi';
import * as DateFunctions from "../../../components/functions/DateFunctions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function MatchDetailsLoginModal({setModalVisible, modalVisible, navigation, item}) {
    const [refereePin, setRefereePin] = useState(global.settings.isTest ? '12345' : (global['refereePIN' + item.id] ?? ''));
    const [textPinEmptyVisible, setTextPinEmptyVisible] = useState(false);
    const [textPinWrongVisible, setTextPinWrongVisible] = useState(false);

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
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>Hier bitte 5-stelligen SR-PIN eingeben: </Text>
                    {global.settings.isTest ?
                        <Text style={styles.testMode}>Beim Turnier braucht ihr hier euren Team-PIN, den ihr zusammen mit
                            dem endgültigen Spielplan bei Turnierbeginn bekommt! Mit dem Testmodus-PIN (12345) könnt ihr
                            jetzt testen:</Text> : null}
                    <TextInput style={styles.textInput}
                               onChangeText={setRefereePin}
                               placeholder="Hier PIN eingeben"
                               keyboardType="numeric"
                               value={refereePin}
                               maxLength={5}
                               onSubmitEditing={() => tryLogin(item)}
                    />
                    {textPinWrongVisible ? <Text style={styles.failureText}>falscher PIN?</Text> : null}
                    {textPinEmptyVisible && refereePin === '' ?
                        <Text style={styles.failureText}>Bitte PIN eingeben</Text> : null}
                    <Pressable style={[styles.button1, styles.buttonBig1, styles.buttonGreen]}
                               onPress={() => tryLogin(item)}>
                        <Text style={[styles.textButton1, styles.teamInfos]}><Icon name="login" size={28}/> einloggen</Text>
                    </Pressable>
                    <Text> </Text>
                    <Pressable style={[styles.button1, styles.buttonGrey]}
                               onPress={() => setModalVisible(false)}>
                        <Text style={styles.textButton1}>Schließen</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}


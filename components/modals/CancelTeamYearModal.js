import * as React from 'react';
import {useState} from 'react';
import {Modal, Pressable, Text, TextInput, View} from 'react-native';
import styles from '../../assets/styles.js';
import fetchApi from "../fetchApi";

export default function CancelTeamYearModal({
                                                setModalVisible,
                                                modalVisible,
                                                props,
                                                canceled,
                                                setCanceled
                                            }) {
    const [usernamePW, setUsernamePW] = useState('');

    const cancelTeamYear = (teamYearsId, undo) => {
        if (usernamePW !== '') {
            let postData = {password: usernamePW};

            fetchApi('teamYears/cancel/' + teamYearsId + '/' + undo, 'POST', postData)
                .then(json => {
                    if (json && json.status === 'success') {
                        setModalVisible(false);
                        setCanceled(json.object ? json.object.canceled : undo);
                    }
                })
                .catch(error => console.error(error));
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.big3}>{props.title}</Text>
                    <Text>Bist du sicher? Wirklich zurückziehen?</Text>
                    <Text>
                        {'Hier bitte Passwort eingeben:'}
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={setUsernamePW}
                        placeholder="Hier Passwort eingeben"
                        keyboardType="default"
                        value={usernamePW}
                        maxLength={16}
                        onSubmitEditing={() => cancelTeamYear(props.teamYearsId, canceled)}
                    />
                    <Pressable
                        style={[
                            styles.button1,
                            canceled ? styles.buttonGreen : styles.buttonRed,
                        ]}
                        onPress={() => cancelTeamYear(props.teamYearsId, canceled)}>
                        <Text
                            numberOfLines={1}
                            style={styles.textButton1}>
                            {canceled ? 'Rückzug rückgängig' : 'zurückziehen'}
                        </Text>
                    </Pressable>
                    <Text>{'\n'}</Text>
                    <Pressable
                        style={[styles.button1, styles.buttonGrey]}
                        onPress={() => setModalVisible(false)}>
                        <Text style={styles.textButton1}>Schließen</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

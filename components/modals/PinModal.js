import * as React from 'react';
import {useEffect, useState} from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import styles from '../../assets/styles.js';
import fetchApi from "../fetchApi";

export default function PinModal({
                                     setModalVisible,
                                     modalVisible,
                                     match,
                                 }) {
    const [pin, setPin] = useState(false);

    useEffect(() => {
        return () => {
            setPin(false);
        };
    }, []);

    const getPIN = () => {
        let postData = {
            'password': global['supervisorPW'],
        };

        fetchApi('matches/getPIN/' + match.id, 'POST', postData)
            .then((json) => {
                if (json.status === 'success') {
                    setPin(json.object.refereePIN);
                }
            })
            .catch((error) => console.error(error));
    };


    return (
        <Modal
            animationType="slide"
            onShow={() => getPIN()}
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>{match.sport.code} Feld {match.group_name}</Text>
                    <Text>{'\n'}</Text>
                    <Text style={styles.big3}>{match.teams1.name} - {match.teams2.name}</Text>
                    <Text>{'\n'}</Text>
                    <Text style={styles.big2}>Spiel-PIN: {pin}</Text>
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

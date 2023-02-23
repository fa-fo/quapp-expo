import * as React from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import styles from '../../assets/styles.js';

export default function FouledOutModal({
                                           setModalVisible,
                                           modalVisible,
                                       }) {
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
                    <Text style={styles.big3}>Foul Out!</Text>
                    <Text>{'\n'}</Text>
                    <Text>Die/der soeben bestrafte Spieler*in darf am laufenden Spiel nicht mehr teilnehmen!</Text>
                    <Text>{'\n'}</Text>

                    <Pressable
                        style={[styles.button1, styles.buttonRed]}
                        onPress={() => setModalVisible(false)}>
                        <Text style={styles.textButton1}>OK, schließen</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

import * as React from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import styles from '../../assets/styles.js';

export default function DoubleYellowModal({
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
                    <Text style={styles.big3}>Hat schon Gelb!</Text>
                    <Text>{'\n'}</Text>
                    <Text>Die/der soeben bestrafte Spieler*in hat bereits vorher eine gelbe Karte erhalten!</Text>
                    <Text>{'\n'}</Text>

                    <Pressable
                        style={[styles.button1, styles.buttonGrey]}
                        onPress={() => setModalVisible(false)}>
                        <Text style={styles.textButton1}>OK, schließen</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

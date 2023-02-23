import * as React from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import styles from '../../assets/styles.js';
import * as ConfirmFunctions from '../functions/ConfirmFunctions';

export default function SpecialConfirmModal({
                                                setModalVisible,
                                                modalVisible,
                                                match,
                                                loadScreenData,
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
                    <Text>{match.sport.code} Feld {match.group_name}</Text>
                    <Text>{'\n'}</Text>
                    <Text style={styles.big3}>{match.teams1.name} - {match.teams2.name}</Text>
                    <Text>{'\n'}</Text>
                    <Text>
                        Erstgenanntes Team siegt:{' '}
                        {ConfirmFunctions.getConfirmButton(
                            match.id,
                            3,
                            ConfirmFunctions.getConfirmResultText(3),
                            setModalVisible,
                            loadScreenData
                        )}
                    </Text>
                    <Text>
                        Zweitgenanntes Team siegt:{' '}
                        {ConfirmFunctions.getConfirmButton(
                            match.id,
                            4,
                            ConfirmFunctions.getConfirmResultText(4),
                            setModalVisible,
                            loadScreenData
                        )}
                    </Text>
                    <Text>
                        Beide Teams verlieren:{' '}
                        {ConfirmFunctions.getConfirmButton(
                            match.id,
                            5,
                            ConfirmFunctions.getConfirmResultText(5),
                            setModalVisible,
                            loadScreenData
                        )}
                    </Text>
                    <Text>
                        Unentschieden:{' '}
                        {ConfirmFunctions.getConfirmButton(
                            match.id,
                            6,
                            ConfirmFunctions.getConfirmResultText(6),
                            setModalVisible,
                            loadScreenData
                        )}
                    </Text>
                    <Text> </Text>
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

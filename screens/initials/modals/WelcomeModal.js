import * as React from 'react';
import {Modal, Pressable, ScrollView, Text, View} from 'react-native';
import styles from '../../../assets/styles.js';

export default function WelcomeModal({setModalVisible, modalVisible}) {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.big3}>Herzlich Willkommen in der QuattFo-App!</Text>
                    <Text>Bitte wähle zunächst dein Team aus. Die App-Darstellung und -Benachrichtigungen werden danach
                        ausgerichtet.</Text>
                    {global.settings.isTest ?
                        <Text style={styles.testMode}>{global.hintTestData}</Text> : null}
                    <Text>Vom linken Bildschirmrand wischen, um das Menü zu öffnen!</Text>
                    <Pressable style={[styles.button1, styles.buttonGreen]} onPress={() => setModalVisible(false)}>
                        <Text style={styles.textButton1}>OK, alles klar!</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}


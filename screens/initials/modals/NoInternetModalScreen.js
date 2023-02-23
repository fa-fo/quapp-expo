import * as React from 'react';
import {Pressable, Text, View} from 'react-native';
import styles from '../../../assets/styles.js';

export default function NoInternetModalScreen({navigation}) {

    return (
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.big3}>Keine Verbindung zum QuattFo-Server oder kein Internet!</Text>
                <Pressable style={[styles.button1, styles.buttonGreen]}
                           onPress={() => navigation.goBack()}>
                    <Text style={styles.textButton1}>zurück</Text>
                </Pressable>
            </View>
        </View>
    );
}


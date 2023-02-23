import * as React from 'react';
import {useEffect, useState} from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import styles from '../../assets/styles.js';
import * as FoulFunctions from '../functions/FoulFunctions';

export default function CardsModal({
                                       setModalVisible,
                                       modalVisible,
                                       match,
                                   }) {
    const [fouls, setFouls] = useState(null);
    const [diff, setDiff] = useState(0);

    useEffect(() => {
        setDiff(0);

        const array = Object.keys(match.logsCalc);
        const fouls = array.filter(s => s.includes('FOUL_')).filter(s => s.includes('_V2'));
        setFouls(fouls);

    }, [match.logsCalc]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDiff(diff + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [match.logsCalc, diff]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
                setFouls(null);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>{match.sport.code} Feld {match.group_name}</Text>
                    <Text>{'\n'}</Text>
                    <Text style={styles.big3}>{match.teams1.name} - {match.teams2.name}</Text>
                    <Text>{'\n'}</Text>
                    {fouls ?
                        fouls.map(code => (
                            <View key={code} style={styles.matchflexRowView}>
                                {FoulFunctions.getFoulCards(match.logsCalc, code.substring(0, code.length - 3), match.team1_id, diff)}
                                <View style={[styles.viewCentered, {flex: 2}]}>
                                    <Text>{'\n ' + match.logsCalc[code]['name'] + ' '}</Text>
                                </View>
                                {FoulFunctions.getFoulCards(match.logsCalc, code.substring(0, code.length - 3), match.team2_id, diff)}
                            </View>
                        ))
                        : null}

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

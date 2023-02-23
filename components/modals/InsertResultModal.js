import * as React from 'react';
import {useEffect, useState} from 'react';
import {Modal, Pressable, Text, TextInput, View} from 'react-native';
import styles from '../../assets/styles.js';
import {confirmResult} from "../functions/ConfirmFunctions";
import {isNumber} from "../functions/CheckFunctions";

export default function InsertResultModal({
                                              setModalVisible,
                                              modalVisible,
                                              match,
                                              loadScreenData,
                                          }) {
    const [submitData, setSubmitData] = useState({'goals1': null, 'goals2': null});
    const [goals1, setGoals1] = useState(null);
    const [goals2, setGoals2] = useState(null);

    useEffect(() => {
        if (submitData.goals1 !== null && submitData.goals2 !== null) {
            let postData = {
                'goals1': submitData.goals1,
                'goals2': submitData.goals2,
            };

            confirmResult(match.id, 1, setModalVisible, loadScreenData, postData)
        }

        return () => {
            setGoals1(null);
            setGoals2(null);
        };
    }, [submitData, setSubmitData]);

    let oldGoals1 = match.resultGoals1 !== null ? parseInt(match.resultGoals1 / match.sport.goalFactor) : null;
    let oldGoals2 = match.resultGoals2 !== null ? parseInt(match.resultGoals2 / match.sport.goalFactor) : null;

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
                    <Text>Ergebniseingabe ohne Faktor:</Text>
                    <Text>{'\n'}</Text>
                    <View style={[styles.matchflexRowView, {flex: 0, alignItems: 'center'}]}>
                        <TextInput style={[styles.textInput, {flex: 2}]}
                                   onChangeText={setGoals1}
                                   placeholder="Tore"
                                   keyboardType="numeric"
                                   maxLength={3}
                                   value={goals1 !== null ? goals1 : (oldGoals1 !== null ? oldGoals1 : '')}
                        />
                        <Text style={{flex: 1, width: '100%', alignContent: 'center'}}> : </Text>
                        <TextInput style={[styles.textInput, {flex: 2}]}
                                   onChangeText={setGoals2}
                                   placeholder="Tore"
                                   keyboardType="numeric"
                                   maxLength={3}
                                   value={goals2 !== null ? goals2 : (oldGoals2 !== null ? oldGoals2 : '')}
                        />
                    </View>
                    <Pressable
                        style={[styles.button1, styles.buttonGreen, styles.buttonEvent, styles.buttonBig1, {width: '80%'}]}
                        onPress={async () => {
                            let submitGoals1 = isNumber(goals1) ? parseInt(goals1) : oldGoals1;
                            let submitGoals2 = isNumber(goals2) ? parseInt(goals2) : oldGoals2;
                            if (submitGoals1 !== null && submitGoals2 !== null) {
                                await setSubmitData({
                                    'goals1': submitGoals1,
                                    'goals2': submitGoals2,
                                });

                                setModalVisible(false);
                            }
                        }}>
                        <Text
                            style={styles.textButton1}>Eintragen und werten</Text>
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

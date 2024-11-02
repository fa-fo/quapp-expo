import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {Modal, Pressable, TextInput, View} from 'react-native';
import {style} from '../../assets/styles.js';
import {confirmResults} from "../functions/ConfirmFunctions";
import {isNumber} from "../functions/CheckFunctions";
import {Picker} from "@react-native-picker/picker";

export default function InsertResultModal({
                                              setModalVisible,
                                              modalVisible,
                                              match,
                                              loadScreenData,
                                          }) {
    const [submitData, setSubmitData] = useState({'goals1': null, 'goals2': null});
    const [goals1, setGoals1] = useState(null);
    const [goals2, setGoals2] = useState(null);
    const [selectedResultAdmin, setSelectedResultAdmin] = useState(match.resultAdmin === 0 ? 1 : match.resultAdmin);

    useEffect(() => {
        if (submitData.goals1 !== null && submitData.goals2 !== null) {
            let postData = {
                'goals1': submitData.goals1,
                'goals2': submitData.goals2,
                'resultAdmin': submitData.resultAdmin,
            };

            confirmResults([{'id': match.id, 'mode': 1}], setModalVisible, loadScreenData, postData)
        }

        return () => {
            setGoals1(null);
            setGoals2(null);
        };
    }, [submitData, setSubmitData]);

    let oldGoals1 = match.resultGoals1 !== null ? Number(match.resultGoals1 / match.sport.goalFactor) : null;
    let oldGoals2 = match.resultGoals2 !== null ? Number(match.resultGoals2 / match.sport.goalFactor) : null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}>
            <View style={style().centeredView}>
                <View style={style().modalView}>
                    <TextC>{match.sport.code} Feld {match.group_name}</TextC>
                    <TextC>{'\n'}</TextC>
                    <TextC style={style().big3}>{match.teams1.name} - {match.teams2.name}</TextC>
                    <TextC>{'\n'}</TextC>
                    <TextC>Ergebniseingabe ohne Faktor:</TextC>
                    <TextC>{'\n'}</TextC>
                    <View style={[style().matchflexRowView, {flex: 1, alignItems: 'center'}]}>
                        <TextInput style={[style().textInput, {flex: 2}]}
                                   onChangeText={setGoals1}
                                   placeholder="Tore"
                                   keyboardType="numeric"
                                   maxLength={3}
                                   value={goals1 !== null ? goals1.toString() : (oldGoals1 !== null ? oldGoals1.toString() : '')}
                        />
                        <TextC style={{flex: 1, width: '100%', alignContent: 'center', textAlign: 'center'}}> : </TextC>
                        <TextInput style={[style().textInput, {flex: 2}]}
                                   onChangeText={setGoals2}
                                   placeholder="Tore"
                                   keyboardType="numeric"
                                   maxLength={3}
                                   value={goals2 !== null ? goals2.toString() : (oldGoals2 !== null ? oldGoals2.toString() : '')}
                        />
                    </View>
                    <TextC>{'\n'}</TextC>
                    <TextC>Ergebniseingabe/-korrektur:</TextC>
                    <Picker
                        selectedValue={selectedResultAdmin}
                        onValueChange={(itemValue) => setSelectedResultAdmin(itemValue)}
                        style={[style().button1, style().pickerSelect]}
                    >
                        <Picker.Item label="(0) nein" value="0"/>
                        <Picker.Item label="(1) korrigiert" value="1"/>
                        <Picker.Item label="(2) Übertrag von Papierbogen" value="2"/>
                    </Picker>
                    <Pressable
                        style={[style().button1, style().buttonGreen, style().buttonEvent, style().buttonBig1, {width: '80%'}]}
                        onPress={async () => {
                            let submitGoals1 = isNumber(goals1) ? parseInt(goals1.toString()) : oldGoals1;
                            let submitGoals2 = isNumber(goals2) ? parseInt(goals2.toString()) : oldGoals2;
                            if (submitGoals1 !== null && submitGoals2 !== null) {
                                await setSubmitData({
                                    'goals1': submitGoals1,
                                    'goals2': submitGoals2,
                                    'resultAdmin': selectedResultAdmin,
                                });

                                setModalVisible(false);
                            }
                        }}>
                        <TextC
                            style={[style().textButton1, {textAlign: 'center'}]}>Eintragen und werten</TextC>
                    </Pressable>
                    <TextC>{'\n'}</TextC>
                    <Pressable
                        style={[style().button1, style().buttonGrey]}
                        onPress={() => setModalVisible(false)}>
                        <TextC style={style().textButton1}>Schließen</TextC>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

import * as React from 'react';
import {useState} from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import styles from '../../assets/styles.js';
import fetchApi from "../fetchApi";
import {Picker} from "@react-native-picker/picker";

export default function RefereeTeamSubstModal({
                                                  setModalVisible,
                                                  modalVisible,
                                                  match,
                                                  loadScreenData
                                              }) {
    const [data, setData] = useState(false);
    const [selectedValue, setSelectedValue] = useState(match.refereeTeamSubst_id ?? '');

    const loadData = () => {
        fetchApi('teamYears/all')
            .then((json) => setData(json))
            .catch((error) => console.error(error));
    };

    function setRefereeTeamSubst(selectedValue) {
        if (selectedValue !== '') {
            let postData = {
                'password': global['supervisorPW'],
                'refereeTeamSubst_id': selectedValue
            };

            fetchApi('matches/saveRefereeTeamSubst/' + match.id, 'POST', postData)
                .catch((error) => console.error(error))
                .finally(() => {
                    loadScreenData();
                    setModalVisible(false);
                });
        }
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onShow={() => {
                loadData();
            }}
            onRequestClose={() => {
                setModalVisible(false);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>{match.sport.code} Feld {match.group_name}</Text>
                    <Text>{'\n'}</Text>
                    <Text style={styles.big3}>{match.teams1.name} - {match.teams2.name}</Text>
                    <Text>{'\n'}</Text>
                    <Text>Team des neuen SR eintragen:</Text>
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={(itemValue) => setSelectedValue(itemValue)}
                        style={[styles.button1, styles.pickerSelect]}
                    >
                        <Picker.Item key="0" value="" label="bitte hier auswählen..."/>
                        {data ? data.object.map(item => (
                            <Picker.Item key={item.id} value={item.team_id} label={item.team.name}/>
                        )) : null}
                    </Picker>
                    <Pressable style={[styles.button1, styles.buttonGreen]}
                               onPress={() => setRefereeTeamSubst(selectedValue)}>
                        <Text style={styles.textButton1}>Speichern</Text>
                    </Pressable>

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

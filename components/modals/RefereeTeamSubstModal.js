import TextC from "../../components/customText";
import {useState} from 'react';
import {Modal, Pressable, View} from 'react-native';
import {style} from '../../assets/styles.js';
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
            <View style={style().centeredView}>
                <View style={style().modalView}>
                    <TextC>{match.sport.code} Feld {match.group_name}</TextC>
                    <TextC>{'\n'}</TextC>
                    <TextC style={style().big3}>{match.teams1?.name ?? ''} - {match.teams2?.name ?? ''}</TextC>
                    <TextC>{'\n'}</TextC>
                    <TextC>Team des neuen SR eintragen:</TextC>
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={(itemValue) => setSelectedValue(itemValue)}
                        style={[style().button1, style().pickerSelect]}
                    >
                        <Picker.Item key="0" value="" label="bitte hier auswählen..."/>
                        {data ? data.object.map(item => (
                            <Picker.Item key={item.id} value={item.team_id} label={item.team.name}/>
                        )) : null}
                    </Picker>
                    <Pressable style={[style().button1, style().buttonGreen]}
                               onPress={() => setRefereeTeamSubst(selectedValue)}>
                        <TextC style={style().textButton1}>Speichern</TextC>
                    </Pressable>

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

import TextC from "../../../components/customText";
import {useState} from 'react';
import {Modal, Pressable, TextInput, View} from 'react-native';
import {style} from '../../../assets/styles.js';
import {Picker} from "@react-native-picker/picker";
import fetchApi from "../../../components/fetchApi";

export default function ClearLogsModal({
                                           setModalVisible,
                                           modalVisible,
                                           loadScreenData,
                                           roundsWithPossibleLogsDelete
                                       }) {
    const [selectedRound, setSelectedRound] = useState(0);
    const [usernamePW, setUsernamePW] = useState('');

    const clearLogs = () => {
        if (selectedRound > 0 && usernamePW !== '') {
            let postData = {password: usernamePW};

            fetchApi('matcheventLogs/clearByRound/' + selectedRound, 'POST', postData)
                .then(json => {
                    if (json && json.status === 'success') {
                        setModalVisible(false);
                        setSelectedRound(0);
                        setUsernamePW('');
                        loadScreenData();
                    }
                })
                .catch(error => console.error(error));
        }
    };

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
                    <TextC>Logs leeren für Runde:</TextC>
                    <Picker
                        selectedValue={selectedRound}
                        onValueChange={(itemValue) => setSelectedRound(itemValue)}
                        style={[style().button1, style().pickerSelect]}
                    >
                        <Picker.Item key={0} value={0} label={'Runde auswählen:'} enabled={false}/>
                        {roundsWithPossibleLogsDelete ? roundsWithPossibleLogsDelete.map(id => (
                            <Picker.Item key={id} value={id} label={'Runde ' + id}/>
                        )) : null}
                    </Picker>
                    <TextC>Bist du sicher? Wirklich leeren?</TextC>
                    <TextC>
                        {'Hier bitte Passwort eingeben:'}
                    </TextC>
                    <TextInput
                        style={style().textInput}
                        onChangeText={setUsernamePW}
                        placeholder="Hier Passwort eingeben"
                        keyboardType="default"
                        value={usernamePW}
                        maxLength={16}
                        onSubmitEditing={() => clearLogs()}
                    />
                    {selectedRound > 0 && usernamePW !== '' ?
                        <Pressable
                            style={[style().button1, style().buttonRed]}
                            onPress={() => clearLogs()}>
                            <TextC numberOfLines={1} style={style().textButton1}>Logs leeren</TextC>
                        </Pressable> : null}
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

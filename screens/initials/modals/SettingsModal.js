import TextC from "../../../components/customText";
import {useState} from 'react';
import {Modal, Pressable, TextInput, View} from 'react-native';
import {style} from '../../../assets/styles.js';
import {Picker} from "@react-native-picker/picker";
import fetchApi from "../../../components/fetchApi";

export default function SettingsModal({
                                          setModalVisible,
                                          modalVisible,
                                          loadScreenData
                                      }) {
    const [selectedPickerValue, setSelectedPickerValue] = useState(0);
    const [selectedName, setSelectedName] = useState('');
    const [selectedNameValue, setSelectedNameValue] = useState('');
    const [usernamePW, setUsernamePW] = useState('');

    const setSetting = () => {
        if (selectedPickerValue > 0 && selectedName !== '' && selectedNameValue !== '' && usernamePW !== '') {
            let postData = {password: usernamePW, value: selectedNameValue};

            fetchApi('settings/setSetting/' + selectedName, 'POST', postData)
                .then(json => {
                    if (json && json.status === 'success') {
                        setModalVisible(false);
                        setSelectedPickerValue(0);
                        setSelectedName('');
                        setSelectedNameValue('');
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
                    <TextC>Einstellung ändern:</TextC>
                    <Picker
                        selectedValue={selectedPickerValue}
                        onValueChange={(k, v) => {
                            setSelectedPickerValue(v);
                            setSelectedName(Object.entries(global.settings)[v - 1][0]);
                            setSelectedNameValue(Object.entries(global.settings)[v - 1][1]);
                        }}
                        style={[style().button1, style().pickerSelect]}
                    >
                        <Picker.Item key={0} value={0} label={'Einstellung auswählen:'} enabled={false}/>
                        {global.settings ? Object.entries(global.settings).map((item, i) => (
                            <Picker.Item key={i + 1} value={i + 1} label={item[0] + ': ' + item[1]}/>
                        )) : null}
                    </Picker>
                    <TextC>Neuer Wert:{' '}
                        <TextInput
                            style={style().textInput}
                            onChangeText={setSelectedNameValue}
                            placeholder=""
                            keyboardType="numeric"
                            value={selectedNameValue}
                            maxLength={4}
                        />
                    </TextC>
                    <TextC>{'\n'}Bist du sicher? Wirklich ändern?</TextC>
                    <TextC>Hier bitte Passwort eingeben:</TextC>
                    <TextInput
                        style={style().textInput}
                        onChangeText={setUsernamePW}
                        placeholder="Hier Passwort eingeben"
                        keyboardType="default"
                        value={usernamePW}
                        maxLength={16}
                        onSubmitEditing={() => setSetting()}
                    />
                    {selectedPickerValue > 0 && selectedName !== '' && selectedNameValue !== '' && usernamePW !== '' ?
                        <Pressable
                            style={[style().button1, style().buttonRed]}
                            onPress={() => setSetting()}>
                            <TextC numberOfLines={1} style={style().textButton1}>Speichern</TextC>
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

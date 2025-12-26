import TextC from "../../../components/customText";
import {useState} from 'react';
import {Modal, Pressable, TextInput, View} from 'react-native';
import {style} from '../../../assets/styles.js';
import {Picker} from "@react-native-picker/picker";
import fetchApi from "../../../components/fetchApi";
import {isNumber} from "../../../components/functions/CheckFunctions";

export default function SettingsModal({
                                          setModalVisible,
                                          modalVisible,
                                          loadScreenData
                                      }) {
    const [selectedPickerValue, setSelectedPickerValue] = useState(0);
    const [selectedName, setSelectedName] = useState('');
    const [selectedNameValue, setSelectedNameValue] = useState('');
    const [oldNameValue, setOldNameValue] = useState('');
    const [usernamePW, setUsernamePW] = useState('');
    const [textPWWrongVisible, setTextPWWrongVisible] = useState(false);

    const save = () => {
        if (checkAll() && usernamePW !== '') {
            setTextPWWrongVisible(false);
            let postData = {password: usernamePW, value: selectedNameValue};

            fetchApi('settings/adminSet/' + selectedName, 'POST', postData)
                .then(json => {
                    if (json && json.status === 'success') {
                        setModalVisible(false);
                        setSelectedPickerValue(0);
                        setSelectedName('');
                        setSelectedNameValue('');
                        setUsernamePW('');
                        loadScreenData();
                    } else {
                        setTextPWWrongVisible(true);
                    }
                })
                .catch(error => console.error(error));
        }
    };

    function checkAll() {
        return selectedPickerValue > 0 && selectedName !== '' && checkValue(selectedNameValue);
    }

    function checkValue(nameValue) {
        return isNumber(nameValue.toString())
            && parseInt(nameValue).toString() === nameValue.toString()
            && nameValue !== oldNameValue
            && nameValue >= 0;
    }

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
                    <TextC style={style().big3}>System-Einstellungen ändern</TextC>
                    <TextC style={style().textRed}>Achtung: Ändere Einstellungen bitte nur, wenn Du weißt, was Du
                        tust.</TextC>
                    <TextC>{'\n'}Zuerst Einstellung auswählen:</TextC>
                    <Picker
                        selectedValue={selectedPickerValue}
                        onValueChange={(k, v) => {
                            setSelectedPickerValue(v);
                            setSelectedName(Object.entries(global.settings)[v - 1][0]);
                            setSelectedNameValue(Object.entries(global.settings)[v - 1][1]);
                            setOldNameValue(Object.entries(global.settings)[v - 1][1]);
                        }}
                        style={[style().button1, style().pickerSelect]}
                    >
                        <Picker.Item key={0} value={0} label={'Einstellung auswählen:'} enabled={false}/>
                        {global.settings ? Object.entries(global.settings).map((item, i) => (
                            item[0].includes('Count') ? null :
                                <Picker.Item key={i + 1} value={i + 1} label={item[0] + ': ' + item[1]}/>
                        )) : null}
                    </Picker>
                    {selectedPickerValue ?
                        <TextC>{'\n'}Neuer Wert:{' '}
                            <TextInput
                                style={[style().textInput, {borderColor: checkValue(selectedNameValue) ? 'green' : 'red'}]}
                                onChangeText={setSelectedNameValue}
                                placeholder=""
                                keyboardType="numeric"
                                value={selectedNameValue}
                                maxLength={4}
                            />
                        </TextC> : null}
                    {checkAll() ?
                        <View>
                            <TextC>{'\n'}Bist du sicher? Wirklich ändern?</TextC>
                            <TextC>Hier bitte Admin-Passwort eingeben:</TextC>
                            <TextInput
                                style={[style().textInput, {borderColor: usernamePW !== '' && !textPWWrongVisible ? 'green' : 'red'}]}
                                onChangeText={setUsernamePW}
                                secureTextEntry={true}
                                placeholder="Hier Passwort eingeben"
                                keyboardType="default"
                                value={usernamePW}
                                maxLength={16}
                                onSubmitEditing={() => save()}
                            />
                        </View> : null}
                    {textPWWrongVisible ?
                        <TextC style={style().failureText}>falsches PW?</TextC> : null}
                    {checkAll() && usernamePW !== '' ?
                        <Pressable
                            style={[style().button1, style().buttonRed]}
                            onPress={() => save()}>
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

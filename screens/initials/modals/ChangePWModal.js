import TextC from "../../../components/customText";
import {useState} from 'react';
import {Modal, Pressable, TextInput, View} from 'react-native';
import {style} from '../../../assets/styles.js';
import fetchApi from "../../../components/fetchApi";

export default function ChangePWModal({
                                          setModalVisible,
                                          modalVisible,
                                          loadScreenData
                                      }) {
    const [oldPW, setOldPW] = useState('');
    const [newPW1, setNewPW1] = useState('');
    const [newPW2, setNewPW2] = useState('');
    const [textPWWrongVisible, setTextPWWrongVisible] = useState(false);

    const save = () => {
        if (checkAll()) {
            setTextPWWrongVisible(false);
            let postData = {name: 'admin', password: oldPW, newPassword: newPW1};

            fetchApi('logins/changePassword', 'POST', postData)
                .then(json => {
                    if (json && json.status === 'success') {
                        global.adminPW = newPW1;
                        setModalVisible(false);
                        setOldPW('');
                        setNewPW1('');
                        setNewPW2('');
                        loadScreenData();
                    } else {
                        setTextPWWrongVisible(true);
                    }
                })
                .catch(error => console.error(error));
        }
    };

    function checkAll() {
        return oldPW !== '' && newPW1 !== '' && newPW2 !== '' && newPW1 === newPW2 && newPW1 !== oldPW;
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
                    <TextC style={style().big3}>Admin-Passwort ändern</TextC>
                    <View>
                        <TextC>Hier bisheriges Passwort eingeben:</TextC>
                        <TextInput
                            style={[style().textInput, {borderColor: oldPW !== '' && oldPW !== newPW1 && !textPWWrongVisible ? 'green' : 'red'}]}
                            onChangeText={setOldPW}
                            secureTextEntry={true}
                            placeholder="Hier Passwort eingeben"
                            keyboardType="default"
                            value={oldPW}
                            maxLength={16}
                            onSubmitEditing={() => save()}
                        />
                        {textPWWrongVisible ?
                            <TextC style={style().failureText}>falsches PW?</TextC> : null}
                        <TextC>{'\n'}</TextC>
                        <TextC>Hier neues Passwort eingeben:</TextC>
                        <TextInput
                            style={[style().textInput, {borderColor: newPW1 !== '' && newPW1 === newPW2 ? 'green' : 'red'}]}
                            onChangeText={setNewPW1}
                            secureTextEntry={true}
                            placeholder="Hier Passwort eingeben"
                            keyboardType="default"
                            value={newPW1}
                            maxLength={16}
                            onSubmitEditing={() => save()}
                        />
                        <TextC>{'\n'}</TextC>
                        <TextC>Hier neues Passwort wiederholen:</TextC>
                        <TextInput
                            style={[style().textInput, {borderColor: newPW2 !== '' && newPW1 === newPW2 ? 'green' : 'red'}]}
                            onChangeText={setNewPW2}
                            secureTextEntry={true}
                            placeholder="Hier Passwort eingeben"
                            keyboardType="default"
                            value={newPW2}
                            maxLength={16}
                            onSubmitEditing={() => save()}
                        />
                    </View>
                    {checkAll() && oldPW !== '' ?
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

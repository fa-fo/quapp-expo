import TextC from "../../components/customText";
import {useState} from 'react';
import {Modal, Pressable, TextInput, View} from 'react-native';
import {style} from '../../assets/styles.js';
import fetchApi from "../fetchApi";

export default function CancelTeamYearModal({
                                                setModalVisible,
                                                modalVisible,
                                                props,
                                                canceled,
                                                setCanceled
                                            }) {
    const [usernamePW, setUsernamePW] = useState('');

    const cancelTeamYear = (teamYearsId, undo) => {
        if (usernamePW !== '') {
            let postData = {password: usernamePW};

            fetchApi('teamYears/cancel/' + teamYearsId + '/' + undo, 'POST', postData)
                .then(json => {
                    if (json && json.status === 'success') {
                        setModalVisible(false);
                        setUsernamePW('');
                        setCanceled(json.object ? json.object.canceled : undo);
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
                    <TextC style={style().big3}>{props.title}</TextC>
                    <TextC>Bist du sicher? Wirklich zurückziehen?</TextC>
                    <TextC>
                        {'Hier bitte Passwort eingeben:'}
                    </TextC>
                    <TextInput
                        style={style().textInput}
                        onChangeText={setUsernamePW}
                        secureTextEntry={true}
                        placeholder="Hier Passwort eingeben"
                        keyboardType="default"
                        value={usernamePW}
                        maxLength={16}
                        onSubmitEditing={() => cancelTeamYear(props.teamYearsId, canceled)}
                    />
                    <Pressable
                        style={[
                            style().button1,
                            canceled ? style().buttonGreen : style().buttonRed,
                        ]}
                        onPress={() => cancelTeamYear(props.teamYearsId, canceled)}>
                        <TextC
                            numberOfLines={1}
                            style={style().textButton1}>
                            {canceled ? 'Rückzug rückgängig' : 'zurückziehen'}
                        </TextC>
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

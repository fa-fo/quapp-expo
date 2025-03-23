import TextC from "../../components/customText";
import {useRef, useState} from 'react';
import {Modal, Pressable, TextInput, View} from 'react-native';
import {style} from '../../assets/styles.js';
import fetchApi from '../../components/fetchApi';

export default function UsernameLoginModal({
                                               setModalVisible,
                                               modalVisible,
                                               username,
                                               navigation,
                                           }) {
    const [usernamePW, setUsernamePW] = useState(__DEV__ ? '' : '');
    const [textPWWrongVisible, setTextPWWrongVisible] = useState(false);
    const inputRef = useRef();

    const tryLogin = () => {
        if (usernamePW !== '') {
            fetchApi('logins/check', 'POST', {name: username, password: usernamePW})
                .then(data => {
                    if (data?.status === 'success') {
                        setModalVisible(false);
                        setUsernamePW('');
                        global[username + 'PW'] = usernamePW;
                        navigation.navigateDeprecated(capitalizeFirstLetter(username), {
                            screen: 'RoundsCurrent',
                        });
                    } else {
                        setTextPWWrongVisible(true);
                    }
                })
                .catch(error => console.error(error));
        }
    };

    function capitalizeFirstLetter(string) {
        return username ? string.charAt(0).toUpperCase() + string.slice(1) : '';
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onShow={() => {
                if (usernamePW === '') {
                    setTimeout(() => {
                        inputRef?.current?.focus()
                    }, 50)
                }
            }}
            onRequestClose={() => {
                setModalVisible(false);
            }}>
            <View style={style().centeredView}>
                <View style={style().modalView}>
                    <TextC>
                        {'Hier bitte ' +
                            capitalizeFirstLetter(username) +
                            '-Passwort eingeben:'}
                    </TextC>
                    <TextInput
                        style={style().textInput}
                        onChangeText={setUsernamePW}
                        secureTextEntry={true}
                        placeholder="Hier Passwort eingeben"
                        keyboardType="default"
                        value={usernamePW}
                        maxLength={16}
                        ref={inputRef}
                        onSubmitEditing={() => tryLogin()}
                    />
                    {textPWWrongVisible ? (
                        <TextC style={style().failureText}>falsches PW?</TextC>
                    ) : null}
                    <TextC>
                        {usernamePW === '' ?
                            <TextC style={style().failureText}>Bitte Passwort eingeben</TextC>
                            : ''}
                    </TextC>
                    <Pressable
                        style={[style().button1, style().buttonGreen]}
                        onPress={() => tryLogin()}>
                        <TextC style={style().textButton1}>
                            {'Als ' + capitalizeFirstLetter(username) + ' einloggen'}
                        </TextC>
                    </Pressable>
                    <TextC> </TextC>
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

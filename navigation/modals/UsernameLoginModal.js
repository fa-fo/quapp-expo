import * as React from 'react';
import {useRef, useState} from 'react';
import {Modal, Pressable, Text, TextInput, View} from 'react-native';
import styles from '../../assets/styles.js';
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
                        navigation.navigate(capitalizeFirstLetter(username), {
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
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>
                        {'Hier bitte ' +
                        capitalizeFirstLetter(username) +
                        '-Passwort eingeben:'}
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={setUsernamePW}
                        placeholder="Hier Passwort eingeben"
                        keyboardType="default"
                        value={usernamePW}
                        maxLength={16}
                        ref={inputRef}
                        onSubmitEditing={() => tryLogin()}
                    />
                    {textPWWrongVisible ? (
                        <Text style={styles.failureText}>falsches PW?</Text>
                    ) : null}
                    <Text>
                        {usernamePW === '' ?
                            <Text style={styles.failureText}>Bitte Passwort eingeben</Text>
                            : ''}
                    </Text>
                    <Pressable
                        style={[styles.button1, styles.buttonGreen]}
                        onPress={() => tryLogin()}>
                        <Text style={styles.textButton1}>
                            {'Als ' + capitalizeFirstLetter(username) + ' einloggen'}
                        </Text>
                    </Pressable>
                    <Text> </Text>
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

import * as React from 'react';
import {Pressable, Text} from 'react-native';
import styles from '../../assets/styles.js';
import fetchApi from '../fetchApi';

export const confirmResult = (id, mode, setModalVisible, loadScreenData, postData) => {
    postData = {'password': global.adminPW, ...postData};
    postData = {'mode': mode, ...postData};

    fetchApi('matches/confirm/' + id, 'POST', postData)
        .then(data => {
            if (data.status === 'success') {
                if (loadScreenData)
                    loadScreenData(data.object.round_id);
                if (setModalVisible)
                    setModalVisible(false);
            }
        })
        .catch(error => console.error(error));
};

export function getConfirmButton(id, mode, text, setModalVisible, loadScreenData) {
    return (
        <Pressable
            style={[
                styles.button1,
                styles.buttonConfirm,
                mode === 0
                    ? styles.buttonGreen
                    : (mode === 1) | (mode === 2)
                    ? styles.buttonGreyDark
                    : styles.buttonRed,
            ]}
            onPress={() => confirmResult(id, mode, setModalVisible, loadScreenData, null)}>
            <Text numberOfLines={1} style={styles.textButton1}>
                {text}
            </Text>
        </Pressable>
    );
}

export function getConfirmResultText(mode) {
    return mode === 1
        ? 'wie Score werten'
        : mode === 2
            ? 'wie Trend werten'
            : mode === 3
                ? 'X:0'
                : mode === 4
                    ? '0:X'
                    : mode === 5
                        ? 'X:X'
                        : mode === 6
                            ? '0:0'
                            : '';
}

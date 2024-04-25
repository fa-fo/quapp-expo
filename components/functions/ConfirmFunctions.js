import * as React from 'react';
import {Pressable, Text} from 'react-native';
import styles from '../../assets/styles.js';
import fetchApi from '../fetchApi';

export function getMatches2Confirm(object) {
    let matches = [];

    object?.groups?.map(group =>
        group.matches.map(item => {
            if (!item.logsCalc.isResultConfirmed && item.isTime2confirm) {
                if (item.isResultOk || item.canceled > 0) {
                    let a = {
                        'id': item.id,
                        'mode': item.isResultOk ? 0 : getConfirmModeFromCanceled(item.canceled),
                    };
                    matches = [a, ...matches];
                }
            }
        })
    )

    return matches;
}

export const confirmResults = (matches, setModalVisible, loadScreenData, postData) => {
    postData = {'password': global.adminPW, ...postData};
    postData = {'matches': JSON.stringify(matches), ...postData};

    return fetchApi('matches/confirmMulti', 'POST', postData)
        .then(data => {
            if (data?.status === 'success') {
                if (loadScreenData)
                    loadScreenData(data.object.round_id);
                if (setModalVisible)
                    setModalVisible(false);
            }
        })
        .catch(error => console.error(error));
};

export function getConfirmButton(matchId, mode, text, setModalVisible, loadScreenData) {

    return (
        <Pressable
            style={[
                styles.button1,
                styles.buttonConfirm,
                mode === 0
                    ? styles.buttonGreen
                    : (mode === 1) || (mode === 2)
                    ? styles.buttonGreyDark
                    : styles.buttonRed,
            ]}
            onPress={() => confirmResults([{'id': matchId, 'mode': mode}], setModalVisible, loadScreenData, null)}>
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

export function getConfirmModeFromCanceled(canceled) {
    return canceled === 1
        ? 4
        : canceled === 2
            ? 3
            : canceled === 3
                ? 5
                : 0;
}

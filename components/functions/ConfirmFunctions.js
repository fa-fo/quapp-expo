import TextC from "../../components/customText";
import {Pressable} from 'react-native';
import {style} from '../../assets/styles.js';
import fetchApi from '../fetchApi';

export function getMatches2Confirm(object) {
    let matches = [];

    if (object?.groups?.length) {
        object.groups.map(group => {
            if (group?.matches?.length) {
                group.matches.map(item => {
                    if (!item.logsCalc?.isResultConfirmed && item.isTime2confirm) {
                        if (item.isResultOk || item.canceled > 0) {
                            let a = {
                                'id': item.id,
                                'mode': item.isResultOk ? 0 : getConfirmModeFromCanceled(item.canceled),
                            };
                            matches = [a, ...matches];
                        }
                    }
                })
            }
        })
    }

    return matches;
}

export const confirmResults = (matches, setModalVisible, loadScreenData, postData, setSaved) => {
    postData = {'password': global.adminPW, ...postData};
    postData = {'matches': JSON.stringify(matches), ...postData};

    return fetchApi('matches/confirmMulti', 'POST', postData)
        .then(data => {
            if (data?.status === 'success') {
                if (loadScreenData)
                    loadScreenData(data.object.round_id);
                if (setModalVisible)
                    setModalVisible(false);
                if (setSaved)
                    setSaved(true);

                return data.object[1] ?? null;
            }
        })
};

export function getConfirmButton(matchId, mode, text, setModalVisible, loadScreenData) {

    return (
        <Pressable
            style={[
                style().button1,
                style().buttonConfirm,
                mode === 0
                    ? style().buttonGreen
                    : (mode === 1) || (mode === 2)
                    ? style().buttonGreyDark
                    : style().buttonRed,
            ]}
            onPress={() => confirmResults([{'id': matchId, 'mode': mode}], setModalVisible, loadScreenData, null)}>
            <TextC numberOfLines={1} style={style().textButton1}>
                {text}
            </TextC>
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

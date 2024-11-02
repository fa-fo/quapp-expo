import TextC from "../../../components/customText";
import {Modal, Pressable, View} from 'react-native';
import {style} from '../../../assets/styles.js';
import fetchApi from '../../../components/fetchApi';
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import * as AsyncStorageFunctions from "../../../components/functions/AsyncStorageFunctions";

export default function MatchLogsCancelEventModal({
                                                      match,
                                                      lastInsertedId,
                                                      setLiveLogsCalc,
                                                      setCancelEventModalVisible,
                                                      cancelEventModalVisible,
                                                      setIsSendingEvent
                                                  }) {

    function cancelMatcheventlog() {
        let postData = {
            'refereePIN': global['refereePIN' + match.id],
        };

        if (lastInsertedId !== undefined) {
            setIsSendingEvent(true);
            fetchApi('matcheventLogs/cancel/' + match.id + '/' + lastInsertedId, 'POST', postData)
                .then((json) => {
                    if (json.status === 'success') {
                        AsyncStorageFunctions.syncScore(match, json.object.score);
                        setLiveLogsCalc(json.object);
                    }
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    setTimeout(() => { // wait for syncScore before trigger setScore
                        setIsSendingEvent(false);
                    }, 500);
                })
        }
    }


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={cancelEventModalVisible}
            onRequestClose={() => {
                setCancelEventModalVisible(false);
            }}
        >
            <View style={style().centeredView}>
                <View style={style().modalView}>
                    <TextC>Bitte Rückgängigmachen bestätigen</TextC>

                    <Pressable
                        style={[style().button1, style().buttonGreen, style().buttonEvent, style().buttonBig1, {width: '80%'}]}
                        onPress={() => {
                            cancelMatcheventlog();
                            setCancelEventModalVisible(false);
                        }}>
                        <TextC style={style().textButton1}>
                            <IconMat name="arrow-right" size={15}/>
                            {' '}
                            Bestätigen
                        </TextC>
                    </Pressable>
                    <TextC> </TextC>
                    <Pressable style={[style().button1, style().buttonGrey]}
                               onPress={() => {
                                   setCancelEventModalVisible(false);
                               }}>
                        <TextC style={style().textButton1}>abbrechen</TextC>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

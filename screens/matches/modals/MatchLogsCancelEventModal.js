import * as React from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import styles from '../../../assets/styles.js';
import fetchApi from '../../../components/fetchApi';
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import * as ScoreAsyncStorageFunctions from "../../../components/functions/ScoreAsyncStorageFunctions";

export default function MatchLogsCancelEventModal({
                                                      match,
                                                      lastInsertedId,
                                                      setLiveLogsCalc,
                                                      setCancelEventModalVisible,
                                                      cancelEventModalVisible,
                                                      setNextSendAlive,
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
                        ScoreAsyncStorageFunctions.syncScore(match, json.object.score);
                        setLiveLogsCalc(json.object);
                        setNextSendAlive();
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
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>Bitte Rückgängigmachen bestätigen</Text>

                    <Pressable
                        style={[styles.button1, styles.buttonGreen, styles.buttonEvent, styles.buttonBig1, {width: '80%'}]}
                        onPress={() => {
                            cancelMatcheventlog();
                            setCancelEventModalVisible(false);
                        }}>
                        <Text style={styles.textButton1}>
                            <IconMat name="arrow-right" size={15}/>
                            {' '}
                            Bestätigen
                        </Text>
                    </Pressable>
                    <Text> </Text>
                    <Pressable style={[styles.button1, styles.buttonGrey]}
                               onPress={() => {
                                   setCancelEventModalVisible(false);
                               }}>
                        <Text style={styles.textButton1}>abbrechen</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

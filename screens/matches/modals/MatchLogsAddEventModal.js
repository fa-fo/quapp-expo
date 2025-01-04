import TextC from "../../../components/customText";
import {useEffect, useState} from 'react';
import {Modal, Pressable, Text, TextInput, View} from 'react-native';
import {style} from '../../../assets/styles.js';
import fetchApi from '../../../components/fetchApi';
import * as DateFunctions from "../../../components/functions/DateFunctions";
import {isNumber} from "../../../components/functions/CheckFunctions";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";

export default function MatchLogsAddEventModal({
                                                   match,
                                                   addEvent,
                                                   setLiveLogsCalc,
                                                   setAddEventModalVisible,
                                                   addEventModalVisible,
                                                   remarks,
                                                   setNextSendAlive,
                                                   showBlinking
                                               }) {
    const [submitData, setSubmitData] = useState({'teamId': null, 'playerNumber': null});
    const [playerNumber, setPlayerNumber] = useState(null);
    const [teamArray, setTeamArray] = useState([]);

    useEffect(() => {
        function addMatcheventlog(data) {
            let postData = {
                'refereePIN': global['refereePIN' + match.id],
                'matchEventCode': addEvent.code,
                'datetimeSent': DateFunctions.getLocalDatetime(),
            };
            if (data.teamId !== null) {
                postData = {'team_id': data.teamId, ...postData};
            }
            if (data.playerNumber !== null) {
                postData = {'playerNumber': data.playerNumber, ...postData};
            }

            fetchApi('matcheventLogs/add/' + match.id, 'POST', postData)
                .then((json) => {
                    if (json.status === 'success') {
                        setLiveLogsCalc(json.object);
                        setNextSendAlive();
                    }
                })
                .catch((error) => console.error(error));

            if (addEvent.code === 'MATCH_CONCLUDE' && remarks !== '') {
                postData = {'remarks': remarks, ...postData};

                fetchApi('matcheventLogs/saveRemarks/' + match.id, 'POST', postData)
                    .catch((error) => console.error(error));
            }

        }

        if (addEvent.code !== undefined) {
            addMatcheventlog(submitData);
        }

        return () => {
            setPlayerNumber(null);
        };
    }, [submitData, setSubmitData]);

    useEffect(() => {
        setTeamArray([{'id': match.team1_id, 'name': match.teams1.name}, {
            'id': match.team2_id,
            'name': match.teams2.name,
        }]);
    }, [setAddEventModalVisible]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={addEventModalVisible}
            onRequestClose={() => {
                setAddEventModalVisible(false);
            }}
        >
            <View style={style().centeredView}>
                <View style={style().modalView}>
                    <TextC>{addEvent.textConfirmHeader !== null ? addEvent.textConfirmHeader : 'Event für Team'}</TextC>
                    <TextC> </TextC>
                    {addEvent.needsPlayerAssoc ? (
                        <View>
                            <TextInput style={[style().textInput, style().textInputLarge]}
                                       onChangeText={setPlayerNumber}
                                       placeholder="Hier zuerst Nummer eingeben"
                                       keyboardType="numeric"
                                       maxLength={3}
                                       value={playerNumber !== null ? playerNumber : ''}
                            />
                            <TextC>{(playerNumber === '' ? (
                                <TextC style={style().failureText}>Bitte Spieler*innen-Nummer
                                    eingeben</TextC>) : '')}</TextC>
                        </View>
                    ) : null}

                    {teamArray.slice(0, addEvent.needsTeamAssoc + 1).map(team => (
                        <Pressable key={team.id}
                                   style={[style().button1, style().buttonGreen, style().buttonEvent, style().buttonBig1, {width: '80%'}]}
                                   onPress={async () => {
                                       let submitNumber = isNumber(playerNumber) ? parseInt(playerNumber) : null;
                                       if (!addEvent.needsPlayerAssoc || submitNumber !== null) {
                                           await setSubmitData({
                                               'teamId': (addEvent.needsTeamAssoc ? team.id : null),
                                               'playerNumber': (addEvent.needsPlayerAssoc ? submitNumber : null),
                                           });

                                           setAddEventModalVisible(false);
                                       } else {
                                           setPlayerNumber('');
                                       }
                                   }}>
                            <TextC style={[style().textButton1, (addEvent.needsTeamAssoc ? null : style().big3)]}>
                                {addEvent.needsTeamAssoc ?
                                    team.name
                                    :
                                    <Text>
                                        <IconMat name="arrow-right" size={30}
                                                 style={{color: showBlinking ? '#fff' : '#3d8d02'}}/>
                                        {' '}Bestätigen
                                    </Text>
                                }
                            </TextC>
                        </Pressable>
                    ))}
                    <TextC> </TextC>
                    <Pressable style={[style().button1, style().buttonGrey]}
                               onPress={() => {
                                   setAddEventModalVisible(false);
                               }}>
                        <TextC style={style().textButton1}>abbrechen</TextC>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

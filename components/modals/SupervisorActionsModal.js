import * as React from 'react';
import {useState} from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import styles from '../../assets/styles.js';
import PinModal from "./PinModal";
import RefereeTeamSubstModal from "./RefereeTeamSubstModal";
import fetchApi from "../fetchApi";

export default function SupervisorActionsModal({
                                                   setModalVisible,
                                                   modalVisible,
                                                   match,
                                                   loadScreenData,
                                               }) {
    const [pinModalVisible, setPinModalVisible] =
        useState(false);

    const [refereeTeamSubstModalVisible, setRefereeTeamSubstModalVisible] =
        useState(false);


    function forceLogout() {
        let postData = {
            'password': global['supervisorPW']
        };

        fetchApi('matches/forceLogout/' + match.id, 'POST', postData)
            .catch((error) => console.error(error))
            .finally(() => {
                loadScreenData();
            });
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>{match.sport.code} Feld {match.group_name}</Text>
                    <Text>{'\n'}</Text>
                    <Text style={styles.big3}>{match.teams1.name} - {match.teams2.name}</Text>
                    <Text>{'\n'}</Text>
                    <Pressable
                        style={[styles.button1, styles.buttonGreen]}
                        onPress={() => setPinModalVisible(true)}>
                        <Text numberOfLines={1} style={styles.textButton1}>
                            Spiel-PIN anzeigen
                        </Text>
                    </Pressable>

                    {match.logsCalc !== undefined && match.logsCalc['isLoggedIn'] ?
                        <Pressable
                            style={[styles.button1, styles.buttonRed]}
                            onPress={() => forceLogout()}>
                            <Text numberOfLines={1} style={styles.textButton1}>
                                Logout erzwingen
                            </Text>
                        </Pressable>
                        : null}

                    {match.logsCalc === undefined || !match.logsCalc['isLoggedIn'] ?
                        <Pressable
                            style={[styles.button1, styles.buttonGreen]}
                            onPress={() => setRefereeTeamSubstModalVisible(true)}>
                            <Text numberOfLines={1} style={styles.textButton1}>
                                Ersatz-SR eintragen
                            </Text>
                        </Pressable>
                        : null
                    }

                    <Pressable
                        style={[styles.button1, styles.buttonGrey]}
                        onPress={() => setModalVisible(false)}>
                        <Text style={styles.textButton1}>Schließen</Text>
                    </Pressable>
                </View>
            </View>
            <PinModal
                setModalVisible={setPinModalVisible}
                modalVisible={pinModalVisible}
                match={match}
            />
            <RefereeTeamSubstModal
                setModalVisible={setRefereeTeamSubstModalVisible}
                modalVisible={refereeTeamSubstModalVisible}
                match={match}
                loadScreenData={loadScreenData}
            />
        </Modal>

    );
}

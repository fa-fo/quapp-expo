import TextC from "../../components/customText";
import {useState} from 'react';
import {Modal, Pressable, View} from 'react-native';
import {style} from '../../assets/styles.js';
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
            <View style={style().centeredView}>
                <View style={style().modalView}>
                    <TextC>{match.sport.code} Feld {match.group_name}</TextC>
                    <TextC>{'\n'}</TextC>
                    <TextC style={style().big3}>{match.teams1.name} - {match.teams2.name}</TextC>
                    <TextC>{'\n'}</TextC>
                    <Pressable
                        style={[style().button1, style().buttonGreen]}
                        onPress={() => setPinModalVisible(true)}>
                        <TextC numberOfLines={1} style={style().textButton1}>
                            Spiel-PIN anzeigen
                        </TextC>
                    </Pressable>

                    {match.logsCalc !== undefined && match.logsCalc['isLoggedIn'] ?
                        <Pressable
                            style={[style().button1, style().buttonRed]}
                            onPress={() => forceLogout()}>
                            <TextC numberOfLines={1} style={style().textButton1}>
                                Logout erzwingen
                            </TextC>
                        </Pressable>
                        : null}

                    {match.logsCalc === undefined || !match.logsCalc['isLoggedIn'] ?
                        <Pressable
                            style={[style().button1, style().buttonGreen]}
                            onPress={() => setRefereeTeamSubstModalVisible(true)}>
                            <TextC numberOfLines={1} style={style().textButton1}>
                                Ersatz-SR eintragen
                            </TextC>
                        </Pressable>
                        : null
                    }

                    <Pressable
                        style={[style().button1, style().buttonGrey]}
                        onPress={() => setModalVisible(false)}>
                        <TextC style={style().textButton1}>Schließen</TextC>
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

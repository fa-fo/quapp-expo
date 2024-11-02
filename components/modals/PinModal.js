import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {Modal, Pressable, View} from 'react-native';
import {style} from '../../assets/styles.js';
import fetchApi from "../fetchApi";

export default function PinModal({
                                     setModalVisible,
                                     modalVisible,
                                     match,
                                 }) {
    const [pin, setPin] = useState(false);

    useEffect(() => {
        return () => {
            setPin(false);
        };
    }, []);

    const getPIN = () => {
        let postData = {
            'password': global['supervisorPW'],
        };

        fetchApi('matches/getPIN/' + match.id, 'POST', postData)
            .then((json) => {
                if (json.status === 'success') {
                    setPin(json.object.refereePIN);
                }
            })
            .catch((error) => console.error(error));
    };


    return (
        <Modal
            animationType="slide"
            onShow={() => getPIN()}
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
                    <TextC style={style().big2}>Spiel-PIN: {pin}</TextC>
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

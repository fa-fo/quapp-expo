import TextC from "../../components/customText";
import {Modal, Pressable, View} from 'react-native';
import {style} from '../../assets/styles.js';

export default function FouledOutModal({
                                           setModalVisible,
                                           modalVisible,
                                       }) {
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
                    <View>
                        <TextC style={style().big2}>Foul Out!</TextC>
                        <TextC>{'\n'}</TextC>
                        <TextC>Die/der soeben bestrafte Spieler*in darf am laufenden Spiel nicht mehr
                            teilnehmen!</TextC>
                        <TextC>{'\n'}</TextC>

                        <Pressable
                            style={[style().button1, style().buttonRed]}
                            onPress={() => setModalVisible(false)}>
                            <TextC style={[style().centeredText100, style().textButton1]}>OK, schließen</TextC>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

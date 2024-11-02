import TextC from "../../components/customText";
import {Modal, Pressable, View} from 'react-native';
import {style} from '../../assets/styles.js';

export default function DoubleYellowModal({
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
                    <TextC style={style().big3}>Hat schon Gelb!</TextC>
                    <TextC>{'\n'}</TextC>
                    <TextC>Die/der soeben bestrafte Spieler*in hat bereits vorher eine gelbe Karte erhalten!</TextC>
                    <TextC>{'\n'}</TextC>

                    <Pressable
                        style={[style().button1, style().buttonGrey]}
                        onPress={() => setModalVisible(false)}>
                        <TextC style={style().textButton1}>OK, schließen</TextC>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

import TextC from "../../components/customText";
import {Modal, Pressable, View} from 'react-native';
import {style} from '../../assets/styles.js';

export default function RemarksModal({
                                         setModalVisible,
                                         modalVisible,
                                         match,
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
                    <TextC>{match.sport.code} Feld {match.group_name}</TextC>
                    <TextC>{'\n'}</TextC>
                    <TextC style={style().big3}>{match.teams1?.name ?? ''} - {match.teams2?.name ?? ''}</TextC>
                    <TextC>{'\n'}</TextC>
                    <TextC>{match.remarks}</TextC>
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

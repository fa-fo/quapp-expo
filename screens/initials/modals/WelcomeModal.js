import TextC from "../../../components/customText";
import {Modal, Pressable, View} from 'react-native';
import {style} from '../../../assets/styles.js';

export default function WelcomeModal({setModalVisible, modalVisible}) {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={style().centeredView}>
                <View style={style().modalView}>
                    <TextC style={style().big2a}>Herzlich Willkommen in der QuattFo-App!</TextC>
                    <TextC style={style().big22}>{'\n'}Bitte wähle zunächst dein Team aus.{'\n\n'}</TextC>
                    {global.settings.isTest ?
                        <TextC style={style().testMode}>{global.hintTestData}</TextC> : null}
                    <Pressable style={[style().button1, style().buttonGreen]} onPress={() => setModalVisible(false)}>
                        <TextC style={style().textButton1}>OK</TextC>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}


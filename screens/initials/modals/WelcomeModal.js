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
                    <TextC style={style().big3}>Herzlich Willkommen in der QuattFo-App!</TextC>
                    <TextC>Bitte wähle zunächst dein Team aus. Die App-Darstellung und -Benachrichtigungen werden danach
                        ausgerichtet.</TextC>
                    {global.settings.isTest ?
                        <TextC style={style().testMode}>{global.hintTestData}</TextC> : null}
                    <TextC>Vom linken Bildschirmrand wischen, um das Menü zu öffnen!</TextC>
                    <Pressable style={[style().button1, style().buttonGreen]} onPress={() => setModalVisible(false)}>
                        <TextC style={style().textButton1}>OK, alles klar!</TextC>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}


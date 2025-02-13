import TextC from "../../components/customText";
import {Modal, Pressable, View} from 'react-native';
import {style} from '../../assets/styles.js';
import * as ConfirmFunctions from '../functions/ConfirmFunctions';

export default function SpecialConfirmModal({
                                                setModalVisible,
                                                modalVisible,
                                                match,
                                                loadScreenData,
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
                    <TextC>
                        Erstgenanntes Team siegt:{' '}
                        {ConfirmFunctions.getConfirmButton(
                            match.id,
                            3,
                            ConfirmFunctions.getConfirmResultText(3),
                            setModalVisible,
                            loadScreenData
                        )}
                    </TextC>
                    <TextC>
                        Zweitgenanntes Team siegt:{' '}
                        {ConfirmFunctions.getConfirmButton(
                            match.id,
                            4,
                            ConfirmFunctions.getConfirmResultText(4),
                            setModalVisible,
                            loadScreenData
                        )}
                    </TextC>
                    <TextC>
                        Beide Teams verlieren:{' '}
                        {ConfirmFunctions.getConfirmButton(
                            match.id,
                            5,
                            ConfirmFunctions.getConfirmResultText(5),
                            setModalVisible,
                            loadScreenData
                        )}
                    </TextC>
                    <TextC>
                        Unentschieden:{' '}
                        {ConfirmFunctions.getConfirmButton(
                            match.id,
                            6,
                            ConfirmFunctions.getConfirmResultText(6),
                            setModalVisible,
                            loadScreenData
                        )}
                    </TextC>
                    <TextC> </TextC>
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

import TextC from "../../../components/customText";
import {useEffect} from 'react';
import {Image, Linking, Modal, Pressable, StyleSheet, View} from 'react-native';
import {style} from '../../../assets/styles.js';
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import fetchApi from "../../../components/fetchApi";
import * as ColorFunctions from "../../../components/functions/ColorFunctions";

export default function MatchDetailsPhotoModal({
                                                   route,
                                                   photoSelected,
                                                   setModalVisible,
                                                   modalVisible,
                                                   loadScreenData
                                               }) {
    let match = route.params.item;
    let uriFile = global.baseUrl
        + 'webroot/img/'
        + match.group.year.name + '/'
        + (route.name === 'MatchDetailsAdmin' ? 'original' : 'web') + '/'
        + match.id + '_' + photoSelected?.id
        + '.jpg';

    useEffect(() => {
        return () => {
            setModalVisible(false);
        };
    }, []);

    const setCheck = async (isOk) => {
        let postData = {password: global.adminPW};
        fetchApi('matcheventLogs/setPhotoCheck/' + photoSelected.id + '/' + isOk, 'POST', postData)
            .then((json) => loadScreenData())
            .catch((error) => console.error(error))
            .finally(() => setModalVisible(false));
    };

    const downloadFile = async () => {
        await Linking.openURL(uriFile);
    };

    return <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(false);
        }}
    >
        <View style={{flex: 1, backgroundColor: ColorFunctions.getColor('primaryBg')}}>
            <View style={{flex: 1, width: '100%', height: '100%'}}>
                <Image
                    source={{uri: uriFile}}
                    style={[StyleSheet.absoluteFillObject]}
                    resizeMode={'contain'}
                />
                <View style={style().toprightButtonContainer}>
                    <Pressable onPress={() => {
                        setModalVisible(false)
                    }}>
                        <IconMat name='close' size={48} color={ColorFunctions.getColor('primary')}/>
                    </Pressable>
                </View>
                {route.name === 'MatchDetailsAdmin' ?
                    <View style={style().toprightButtonContainer}>
                        <Pressable
                            style={[style().button1, style().buttonEvent, style().buttonRed]}
                            onPress={() => setCheck(0)}
                        >
                            <IconMat name='delete-outline' size={48} color='#fff'/>
                        </Pressable>
                    </View> : null}

                <View style={style().bottomButtonContainer}>
                    {route.name === 'MatchDetailsAdmin' ?
                        <Pressable
                            style={[style().button1, style().buttonEvent, style().buttonGreen]}
                            onPress={() => setCheck(1)}
                        >
                            <IconMat name='eye-check' size={48} color='#fff'/>
                            <TextC style={[style().textButton1, {textAlign: 'center'}]}>OK</TextC>
                        </Pressable>
                        :
                        <View>
                            <TextC style={{textAlign: 'right', width: 130}}>
                                Im Browser{'\n'}öffnen (dort{'\n'}herunterladen):
                            </TextC>
                            <Pressable
                                style={[style().button1, style().buttonGreen]}
                                onPress={() => downloadFile()}
                            >
                                <TextC style={[style().textButton1, {textAlign: 'center'}]}>
                                    <IconMat name='download' size={48} color='#fff'/>
                                </TextC>
                            </Pressable>
                        </View>
                    }
                </View>
            </View>
        </View>
    </Modal>
}



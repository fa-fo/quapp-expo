import * as React from 'react';
import {useEffect} from 'react';
import {Image, Linking, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import styles from '../../../assets/styles.js';
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import fetchApi from "../../../components/fetchApi";

export default function MatchDetailsPhotoModal({
                                                   route,
                                                   photoSelected,
                                                   setModalVisible,
                                                   modalVisible,
                                                   loadScreenData
                                               }) {
    let match = route.params.item;
    let uriFile = 'https://api.quattfo.de/webroot/img/'
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
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{flex: 1, width: '100%', height: '100%'}}>
                <Image
                    source={{uri: uriFile}}
                    style={[StyleSheet.absoluteFillObject, {resizeMode: 'contain'}]}
                />
                <View style={styles.toprightButtonContainer}>
                    <Pressable onPress={() => {
                        setModalVisible(false)
                    }}>
                        <IconMat name='close' size={48} color='#000'/>
                    </Pressable>
                </View>
                {route.name === 'MatchDetailsAdmin' ?
                    <View style={styles.toprightButtonContainer}>
                        <Pressable
                            style={[styles.button1, styles.buttonEvent, styles.buttonRed]}
                            onPress={() => setCheck(0)}
                        >
                            <IconMat name='delete-outline' size={48} color='#fff'/>
                        </Pressable>
                    </View> : null}

                <View style={styles.bottomButtonContainer}>
                    {route.name === 'MatchDetailsAdmin' ?
                        <Pressable
                            style={[styles.button1, styles.buttonEvent, styles.buttonGreen]}
                            onPress={() => setCheck(1)}
                        >
                            <IconMat name='eye-check' size={48} color='#fff'/>
                            <Text style={[styles.textButton1, {textAlign: 'center'}]}>OK</Text>
                        </Pressable>
                        :
                        <View>
                            <Text style={{textAlign: 'right', width: 130}}>
                                Im Browser{'\n'}öffnen (dort{'\n'}herunterladen):
                            </Text>
                            <Pressable
                                style={[styles.button1, styles.buttonGreen]}
                                onPress={() => downloadFile()}
                            >
                                <Text style={[styles.textButton1, {textAlign: 'center'}]}>
                                    <IconMat name='download' size={48} color='#fff'/>
                                </Text>
                            </Pressable>
                        </View>
                    }
                </View>
            </View>
        </View>
    </Modal>
}



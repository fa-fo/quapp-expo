import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Image, Modal, Pressable, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import styles from '../../../assets/styles.js';
import fetchApi from '../../../components/fetchApi';
import * as DateFunctions from "../../../components/functions/DateFunctions";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import {Camera, CameraType} from "expo-camera";

import * as ScreenOrientation from 'expo-screen-orientation';


export default function MatchLogsPhotoModal({
                                                match,
                                                setLiveLogsCalc,
                                                setModalVisible,
                                                modalVisible
                                            }) {

    const cameraRef = useRef();
    const dimensions = useWindowDimensions();
    const [type, setType] = useState(CameraType.back);
    const [hasPermission, requestPermission] = Camera.useCameraPermissions();
    const [isPreview, setIsPreview] = useState(false);
    const [data, setData] = useState(null);
    const [isBusy, setIsBusy] = useState(false);

    useEffect(() => {
        return () => {
            setData(null);
            setIsPreview(false);
            setModalVisible(false);
        };
    }, []);

    useEffect(() => {
        if (modalVisible === true) {
            ScreenOrientation.getOrientationLockAsync().then((res) => {
                //console.log('getOrientationLockAsync', res)
            });

            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT).then(() => {
                //console.log('lockAsync')
            });
        } else {
            ScreenOrientation.unlockAsync().then(() => {
                //console.log('unlockAsync')
            });
        }

    }, [modalVisible]);

    const onSnap = async () => {
        setIsBusy(true);
        const options = {quality: 0.7, base64: true};
        const data = await cameraRef?.current?.takePictureAsync(options);

        setData(data);
        setIsPreview(true);
        setIsBusy(false);
    }

    const onSend = async () => {
        const source = data.base64;
        if (source) {
            await cameraRef?.current?.pausePreview();
            setIsBusy(true);
            let postData = {
                'refereePIN': global['refereePIN' + match.id],
                'matchEventCode': 'PHOTO_UPLOAD',
                'datetimeSent': DateFunctions.getLocalDatetime(),
                'photo': `data:image/jpg;base64,${source}`,
            };

            fetchApi('matcheventLogs/add/' + match.id, 'POST', postData)
                .then((json) => {
                    if (json.status === 'success') {
                        setData(null);
                        setIsPreview(false);
                        setLiveLogsCalc(json.object);
                        setModalVisible(false);
                        setIsBusy(false)
                    }
                })
                .catch((error) => console.error(error));
        }
    }

    const cancelPreview = async () => {
        setIsPreview(false);
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    function getRatioWidth(height) {
        return height / 3 * 4;
    }

    return <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(false);
        }}
    >
        <View style={{flex: 1, backgroundColor: 'white'}}>
            {hasPermission && !hasPermission.granted ? (
                    <View style={[styles.modalView, StyleSheet.absoluteFill, styles.centeredView]}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Bitte die Fotos im Querformat
                            aufnehmen.</Text>
                        <Text style={{textAlign: 'center'}}>Wir brauchen deine Erlaubnis, um die Kamera zu
                            nutzen:</Text>
                        <Pressable style={[styles.button1, styles.buttonBig1, styles.buttonGreen]}
                                   onPress={requestPermission}>
                            <Text style={[styles.textButton1, styles.teamInfos, {textAlign: 'center'}]}>Erlaubnis
                                gewähren</Text>
                        </Pressable>
                        <Pressable style={[styles.button1, styles.buttonGrey]}
                                   onPress={() => {
                                       setModalVisible(false);
                                   }}>
                            <Text style={styles.textButton1}>abbrechen</Text>
                        </Pressable>
                    </View>)
                :
                (!isPreview ? (
                    <View style={{flex: 1, width: '100%', height: '100%'}}>
                        <Camera
                            style={{
                                height: dimensions.height,
                                width: getRatioWidth(dimensions.height),
                                alignSelf: "center"
                            }}
                            type={type}
                            ref={cameraRef}
                            isActive={true}
                            photo={true}
                            enableZoomGesture={true}
                            orientation="landscape-right"
                        />
                        <View style={styles.topleftButtonContainer}>
                            <Pressable onPress={toggleCameraType}>
                                <IconMat name='camera-flip' size={48} color='green'/>
                            </Pressable>
                        </View>
                        <View style={styles.toprightButtonContainer}>
                            <Pressable onPress={() => {
                                setModalVisible(false)
                            }}>
                                <IconMat name='close' size={48} color='#000000'/>
                            </Pressable>
                        </View>
                        <View style={styles.bottomButtonContainer}>
                            <Text style={{textAlign: 'right', width: 100}}>Bitte Foto im Querformat
                                aufnehmen:</Text>
                            <Pressable
                                style={[styles.button1, styles.buttonGreen]}
                                onPress={onSnap}
                            >
                                {isBusy ?
                                    <ActivityIndicator size={55} color="white"/>
                                    :
                                    <IconMat name='camera' size={55} color='white'/>}
                                <Text style={[styles.textButton1, {textAlign: 'center'}]}>
                                    Snap
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                ) : null)
            }

            {isPreview && data ?
                <View style={{flex: 1, width: '100%', height: '100%'}}>
                    {data.uri ?
                        <Image
                            source={{uri: data.uri}}
                            style={{
                                height: dimensions.height,
                                width: getRatioWidth(dimensions.height),
                                alignSelf: "center"
                            }}
                        /> : null}
                    <View style={styles.toprightButtonContainer}>
                        <Pressable
                            style={[styles.button1, styles.buttonEvent, styles.buttonRed]}
                            onPress={cancelPreview}
                        >
                            <IconMat name='delete-forever-outline' size={48} color='#fff'/>
                        </Pressable>
                    </View>
                    <View style={styles.bottomButtonContainer}>
                        <Pressable
                            style={[styles.button1, styles.buttonGreen]}
                            onPress={onSend}
                        >
                            {isBusy ?
                                <ActivityIndicator size={55} color="white"/>
                                :
                                <IconMat name='send-check' size={55} color='#fff'/>}
                            <Text style={styles.textButton1}>Absenden</Text>
                        </Pressable>
                    </View>
                </View>
                : null}
        </View>
    </Modal>
}



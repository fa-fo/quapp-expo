import * as React from 'react';
import {useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, Image, Linking, Platform, Pressable, Text, View} from 'react-native';
import fetchApi from '../../components/fetchApi';
import Carousel from "react-native-reanimated-carousel";
import styles from "../../assets/styles";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";

const width = Dimensions.get("window").width;

export default function AllMatchPhotosScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [progress, setProgress] = useState(0);
    const ref = React.useRef();

    useEffect(() => {
        loadScreenData();
    }, []);

    const loadScreenData = () => {
        fetchApi('matcheventLogs/getPhotosAll/' + (global.myTeamId ?? 0))
            .then((json) => {
                setData(json);
                navigation.setOptions({headerRight: () => null}); // needed for iOS
                navigation.setOptions({
                    headerRight: () => (
                        <Text>
                            <Pressable
                                style={[styles.button1, styles.buttonEvent, styles.buttonGreen]}
                                onPress={() => loadScreenData()}
                            >
                                <Text style={styles.textButton1}>
                                    <IconMat name='reload' size={24} color='#fff'/>
                                </Text>
                            </Pressable>
                        </Text>
                    ),
                });

            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    function getUriFile(matchId, photoId) {
        return 'https://api.quattfo.de/webroot/img/'
            + data?.year?.name + '/'
            + 'web/'
            + matchId + '_' + photoId
            + '.jpg';
    }

    const handleProgress = (index) => {
        setProgress(index);
    }

    const downloadFile = async (uriFile) => {
        await Linking.openURL(uriFile);
    };

    const scrollToMyNextPhoto = (currentIndex) => {
        if (data?.object?.myPhotos?.length > 1) {
            let scrollToIndex = false;

            for (let i = 0; i < data.object.myPhotos.length; i++) {
                if (data.object.myPhotos[i] > currentIndex || scrollToIndex === false) {
                    scrollToIndex = data.object.myPhotos[i];

                    if (data.object.myPhotos[i] > currentIndex) {
                        break;
                    }
                }
            }

            if (scrollToIndex !== false) {
                ref.current?.scrollTo({
                    count: scrollToIndex - currentIndex,
                    animated: true,
                });
            }
        }
    }

    return (
        <View style={{flex: 1}}>
            {isLoading ? <ActivityIndicator size="large" color="#00ff00" style={styles.actInd}/> :
                (data?.status === 'success' && data.object.photos.length ?
                        <Carousel
                            ref={ref}
                            width={Platform.select({web: 900, ios: width, android: width})}
                            height={Platform.select({web: 600, ios: '100%', android: '100%'})}
                            data={data.object.photos}
                            windowSize={3}
                            loop={true}
                            autoPlay={true}
                            autoPlayInterval={3000}
                            onProgressChange={(_, absoluteProgress) => {
                                handleProgress(Math.round(absoluteProgress));
                            }}
                            renderItem={({item}) => (
                                <View style={{flex: 1}}>
                                    <Image
                                        source={{uri: getUriFile(item.match_id, item.id)}}
                                        style={[{flex: 2, resizeMode: 'contain'}]}
                                    />
                                    <Text style={{flex: 1, textAlign: 'center'}}>
                                        {item.sport_name + ' Gr. ' + item.group_name + ', Runde ' + item.round_id}
                                        {'\n'}
                                        {item.team1_name + ' vs ' + item.team2_name}
                                        {'\n'}
                                        {(item.resultGoals1 ?? '_') + ' : ' + (item.resultGoals2 ?? '_')}
                                        {'\n'}
                                        {'SR: ' + item.team3_name}
                                        {'\n'}
                                    </Text>
                                </View>
                            )}
                        />
                        :
                        <Text>Hier findet ihr am Turniertag alle Fotos, die über die App nach der
                            Spielprotokollierung
                            hochgeladen werden können.</Text>
                )}

            <View style={styles.bottomLeftButtonContainer}>
                {data?.object?.myPhotos?.length > 1 ?
                    <Pressable
                        style={[styles.button1, styles.buttonEvent, styles.buttonGreen]}
                        onPress={() => scrollToMyNextPhoto(progress)}
                    >
                        <Text style={[styles.textButton1, {textAlign: 'center'}]}>
                            Mein Team
                            <IconMat name='skip-next' size={24} color='#fff'/>
                        </Text>
                    </Pressable>
                    : null}
            </View>

            <View style={styles.bottomButtonContainer}>
                {data?.object?.photos?.length ?
                    <Pressable
                        style={[styles.button1, styles.buttonGreen]}
                        onPress={() => downloadFile(getUriFile(data.object.photos[progress].match_id, data.object.photos[progress].id))}
                    >
                        <Text style={[styles.textButton1, {textAlign: 'center'}]}>
                            <IconMat name='download' size={24} color='#fff'/>
                        </Text>
                    </Pressable>
                    : null}
            </View>
        </View>
    );
}

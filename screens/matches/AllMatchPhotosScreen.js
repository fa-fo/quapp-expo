import TextC from "../../components/customText";
import {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Dimensions, Image, Linking, Platform, Pressable, View} from 'react-native';
import fetchApi from '../../components/fetchApi';
import Carousel from "react-native-reanimated-carousel";
import {style} from "../../assets/styles";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import {useRoute} from "@react-navigation/native";

const width = Dimensions.get("window").width;

export default function AllMatchPhotosScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [progress, setProgress] = useState(0);
    const [resizeMode, setResizeMode] = useState('contain');
    const ref = useRef();

    useEffect(() => {
        loadScreenData();
    }, []);

    const loadScreenData = () => {
        setLoading(true);

        fetchApi('matcheventLogs/getPhotosAll/' + (global.myTeamId ?? 0) + '/' + (route.params?.item?.year_id ?? 0))
            .then((json) => {
                setData(json);
                navigation.setOptions({headerRight: () => null}); // needed for iOS
                navigation.setOptions({
                    headerRight: () => (
                        <TextC>
                            <Pressable
                                style={[style().button1, style().buttonEvent, style().buttonGreen]}
                                onPress={() => loadScreenData()}
                            >
                                <TextC style={style().textButton1}>
                                    <IconMat name='reload' size={24} color='#fff'/>
                                </TextC>
                            </Pressable>
                        </TextC>
                    ),
                });

            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    function getUriFile(matchId, photoId) {
        return global.baseUrl
            + 'webroot/img/'
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

    const switchResizeMode = (mode) => {
        setResizeMode(mode === 'contain' ? 'cover' : 'contain')
    }

    return (
        <View style={{flex: 1, alignItems: 'center'}}>
            {isLoading ? <ActivityIndicator size="large" color="#00ff00" style={style().actInd}/> :
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
                                    <Pressable onPress={() => switchResizeMode(resizeMode)} style={{flex: 2}}>
                                        <Image
                                            source={{uri: getUriFile(item.match_id, item.id)}}
                                            style={{flex: 1}}
                                            resizeMode={resizeMode}
                                        />
                                    </Pressable>
                                    <TextC style={{flex: 1, textAlign: 'center'}}>
                                        {item.sport_name + ' Gr. ' + item.group_name + ', Runde ' + item.round_id}
                                        {'\n'}
                                        {item.team1_name + ' vs ' + item.team2_name}
                                        {'\n'}
                                        {(item.resultGoals1 ?? '_') + ' : ' + (item.resultGoals2 ?? '_')}
                                        {'\n'}
                                        {'SR: ' + item.team3_name}
                                        {'\n'}
                                    </TextC>
                                </View>
                            )}
                        />
                        :
                        <TextC>Hier findet ihr am Turniertag alle Fotos, die über die App nach der
                            Spielprotokollierung
                            hochgeladen werden können.</TextC>
                )}

            <View style={style().bottomLeftButtonContainer}>
                {data?.object?.myPhotos?.length > 1 ?
                    <Pressable
                        style={[style().button1, style().buttonEvent, style().buttonGreen]}
                        onPress={() => scrollToMyNextPhoto(progress)}
                    >
                        <TextC style={[style().textButton1, {textAlign: 'center'}]}>
                            Mein Team
                            <IconMat name='skip-next' size={24} color='#fff'/>
                        </TextC>
                    </Pressable>
                    : null}
            </View>

            <View style={style().bottomButtonContainer}>
                {data?.object?.photos?.length ?
                    <Pressable
                        style={[style().button1, style().buttonGreen]}
                        onPress={() => downloadFile(getUriFile(data.object.photos[progress].match_id, data.object.photos[progress].id))}
                    >
                        <TextC style={[style().textButton1, {textAlign: 'center'}]}>
                            <IconMat name='download' size={24} color='#fff'/>
                        </TextC>
                    </Pressable>
                    : null}
            </View>
        </View>
    );
}

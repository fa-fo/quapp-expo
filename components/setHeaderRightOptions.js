import TextC from "../components/customText";
import {Platform, Pressable, View} from 'react-native';
import {style} from '../assets/styles';
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";

export const setHeaderRightOptions = (navigation, route, data, loadScreenData) => {
    let showObj = {};
    showObj.autoAdmin = /RoundsCurrentAdmin|RoundsMatchesAdmin/.test(route.name) && global.settings.useLiveScouting;
    showObj.classicView = /RoundsMatchesAutoAdmin|RoundsMatchesManager/.test(route.name);
    showObj.manager = /RoundsCurrentSupervisor|RoundsMatchesSupervisor/.test(route.name) && global.settings.useLiveScouting;
    showObj.reload = Platform.OS === 'web' && data.yearSelected === undefined && Object.values(showObj).filter(Boolean).length === 0;
    showObj.groupNavi = /ListMatchesByGroup|RankingInGroups/.test(route.name);
    showObj.roundNavi = /RoundsMatches/.test(route.name) && !/AutoAdmin/.test(route.name) && !/Manager/.test(route.name);

    navigation.setOptions({headerRight: () => null}); // needed for iOS
    navigation.setOptions({
        headerRight: () => (
            <View
                style={[style().matchflexRowView, {
                    marginHorizontal: 10,
                    marginTop: 5,
                    maxWidth: Object.values(showObj).filter(Boolean).length * 150,
                    height: '90%',
                    alignSelf: 'flex-end'
                }]}>

                {showObj['autoAdmin'] ?
                    <View style={{flex: 2, height: '100%'}}>
                        <Pressable
                            style={[style().buttonHeader, style().buttonGreen]}
                            onPress={() => navigation.navigate('RoundsMatchesAutoAdmin',
                                {roundsCount: route.params?.roundsCount ?? data.object.rounds?.length}
                            )}
                        >
                            <TextC style={[style().textButton1, {textAlign: 'center'}]}>
                                <IconMat name='auto-fix' size={24} color='#fff'/> Auto-Admin
                            </TextC>
                        </Pressable>
                    </View>
                    : null}

                {showObj['classicView'] ?
                    <View style={{flex: 2, height: '100%'}}>
                        <Pressable style={[style().buttonHeader, style().buttonOrange]}
                                   onPress={() => navigation.navigate(
                                       route.name === 'RoundsMatchesAutoAdmin' ? 'RoundsMatchesAdmin' : route.name === 'RoundsMatchesManager' ? 'RoundsMatchesSupervisor' : '',
                                       {id: data.object.round.id, roundsCount: route.params.roundsCount}
                                   )}
                        >
                            <TextC style={[style().textButton1, {textAlign: 'center'}]}>
                                <IconMat name='desktop-classic' size={24} color='#fff'/> Classic Mode
                            </TextC>
                        </Pressable>
                    </View>
                    : null}

                {showObj['manager'] ?
                    <View style={{flex: 2, height: '100%'}}>
                        <Pressable
                            style={[style().buttonHeader, style().buttonGreen]}
                            onPress={() => navigation.navigate('RoundsMatchesManager',
                                {roundsCount: route.params?.roundsCount ?? data.object.rounds?.length}
                            )}
                        >
                            <TextC style={[style().textButton1, {textAlign: 'center'}]}>
                                <IconMat name='image-auto-adjust' size={24} color='#fff'/> Supervisor Manager
                            </TextC>
                        </Pressable>
                    </View>
                    : null}

                {showObj['reload'] ?
                    <View style={{flex: 2, height: '100%'}}>
                        <Pressable
                            style={[style().buttonHeader, style().buttonGreen]}
                            onPress={() => loadScreenData()}
                        >
                            <TextC style={[style().textButton1, {textAlign: 'center'}]}>
                                <IconMat name='reload' size={24} color='#fff'/>
                            </TextC>
                        </Pressable>
                    </View>
                    : null}

                {showObj['groupNavi'] ?
                    <View style={[style().matchflexRowView, {flex: 2, height: '100%'}]}>
                        <View style={{flex: 1, height: '100%'}}>
                            <Pressable
                                style={[style().buttonHeader, style().buttonBlue, (data.object.prevGroup ? null : style().hiddenElement)]}
                                onPress={() =>
                                    navigation.navigate(route.name, {item: data.object.prevGroup})
                                }>
                                <TextC
                                    style={[style().textButtonTopRight, style().centeredText100]}>{'\u276E'}</TextC>
                            </Pressable>
                        </View>
                        <View style={{flex: 1, height: '100%'}}>
                            <Pressable
                                style={[style().buttonHeader, style().buttonBlue, (data.object.nextGroup ? null : style().hiddenElement)]}
                                onPress={() =>
                                    navigation.navigate(route.name, {item: data.object.nextGroup})
                                }>
                                <TextC
                                    style={[style().textButtonTopRight, style().centeredText100]}>{'\u276F'}</TextC>
                            </Pressable>
                        </View>
                    </View>
                    : null}

                {showObj['roundNavi'] ?
                    <View style={[style().matchflexRowView, {flex: 2, height: '100%'}]}>
                        <View style={{flex: 1, height: '100%'}}>
                            <Pressable
                                style={[style().buttonHeader, style().buttonOrange, (route.params.id > 1 ? null : style().hiddenElement)]}
                                onPress={() => navigation.navigate(route.name, {
                                    id: route.params.id - 1,
                                    roundsCount: route.params.roundsCount,
                                })}
                            >
                                <TextC
                                    style={[style().textButtonTopRight, style().centeredText100]}>{'\u276E'}</TextC>
                            </Pressable>
                        </View>
                        <View style={{flex: 1, height: '100%'}}>
                            <Pressable
                                style={[style().buttonHeader, style().buttonOrange, (route.params.id < route.params.roundsCount ? null : style().hiddenElement)]}
                                onPress={() => navigation.navigate(route.name, {
                                    id: route.params.id + 1,
                                    roundsCount: route.params.roundsCount,
                                })}
                            >
                                <TextC
                                    style={[style().textButtonTopRight, style().centeredText100]}>{'\u276F'}</TextC>
                            </Pressable>
                        </View>
                    </View>
                    : null}
            </View>
        ),
    });
};

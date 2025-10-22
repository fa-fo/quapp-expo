import TextC from "../components/customText";
import {Platform, Pressable, View} from 'react-native';
import {style} from '../assets/styles';
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";

export const setGroupHeaderOptions = (navigation, route, data, loadScreenData) => {
    let showReloadButton = Platform.OS === 'web' && data.yearSelected === undefined;

    navigation.setOptions({headerRight: () => null}); // needed for iOS
    navigation.setOptions({
        headerRight: () => (
            <View
                style={[style().matchflexRowView, {
                    marginHorizontal: 10,
                    marginTop: 5,
                    maxWidth: showReloadButton ? 300 : 150,
                    height: '90%',
                    alignSelf: 'flex-end'
                }]}>
                {showReloadButton ?
                    <View style={{flex: 2}}>
                        <Pressable
                            style={[style().buttonHeader, style().buttonGreen]}
                            onPress={() => loadScreenData()}
                        >
                            <TextC style={style().textButton1}>
                                <IconMat name='reload' size={24} color='#fff'/>
                            </TextC>
                        </Pressable>
                    </View>
                    : null}

                <View style={{flex: 1}}>
                    <Pressable
                        style={[style().buttonHeader, style().buttonBlue, (data.object.prevGroup ? null : style().hiddenElement)]}
                        onPress={() =>
                            navigation.navigate(route.name, {item: data.object.prevGroup})
                        }>
                        <TextC style={[style().textButtonTopRight, style().centeredText100]}>{'\u276E'}</TextC>
                    </Pressable>
                </View>
                <View style={{flex: 1}}>
                    <Pressable
                        style={[style().buttonHeader, style().buttonBlue, (data.object.nextGroup ? null : style().hiddenElement)]}
                        onPress={() =>
                            navigation.navigate(route.name, {item: data.object.nextGroup})
                        }>
                        <TextC style={[style().textButtonTopRight, style().centeredText100]}>{'\u276F'}</TextC>
                    </Pressable>
                </View>
            </View>
        ),
    });
};

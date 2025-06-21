import TextC from "../components/customText";
import {Pressable, View} from 'react-native';
import {style} from '../assets/styles';

export const setGroupHeaderOptions = (navigation, route, data) => {
    navigation.setOptions({
        headerRight: () => (
            <View
                style={[style().matchflexRowView, {marginHorizontal: 10, marginTop: 5, maxWidth: 150, height: '90%'}]}>
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

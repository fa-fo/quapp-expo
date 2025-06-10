import TextC from "../components/customText";
import {Pressable} from 'react-native';
import {style} from '../assets/styles';

export const setGroupHeaderOptions = (navigation, route, data) => {
    navigation.setOptions({
        headerRight: () => (
            <TextC style={{height: '88%', marginRight: 10}}>
                <Pressable
                    style={[style().buttonBig, style().buttonBlue, (data.object.prevGroup ? null : style().hiddenElement)]}
                    onPress={() =>
                        navigation.navigateDeprecated(route.name, {item: data.object.prevGroup})
                    }>
                    <TextC style={style().textButtonTopRight}>{' \u276E '}</TextC>
                </Pressable>
                <TextC> </TextC>
                <Pressable
                    style={[style().buttonBig, style().buttonBlue, (data.object.nextGroup ? null : style().hiddenElement)]}
                    onPress={() =>
                        navigation.navigateDeprecated(route.name, {item: data.object.nextGroup})
                    }>
                    <TextC style={style().textButtonTopRight}>{' \u276F '}</TextC>
                </Pressable>
                <TextC> </TextC>
            </TextC>
        ),
    });
};

import TextC from "../components/customText";
import {Pressable} from 'react-native';
import {style} from '../assets/styles';

export const setGroupHeaderOptions = (navigation, route, data) => {
    navigation.setOptions({
        headerRight: () => (
            <TextC>
                <Pressable
                    style={[style().buttonTopRight, (data.object.prevGroup ? null : style().hiddenElement)]}
                    onPress={() =>
                        navigation.navigateDeprecated(route.name, {item: data.object.prevGroup})
                    }>
                    <TextC style={style().textButtonTopRight}>{' < '}</TextC>
                </Pressable>
                <TextC> </TextC>
                <Pressable
                    style={[style().buttonTopRight, (data.object.nextGroup ? null : style().hiddenElement)]}
                    onPress={() =>
                        navigation.navigateDeprecated(route.name, {item: data.object.nextGroup})
                    }>
                    <TextC style={style().textButtonTopRight}>{' > '}</TextC>
                </Pressable>
                <TextC> </TextC>
            </TextC>
        ),
    });
};

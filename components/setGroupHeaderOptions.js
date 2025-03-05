import TextC from "../components/customText";
import {Pressable} from 'react-native';
import {style} from '../assets/styles';

export const setGroupHeaderOptions = (navigation, route, data) => {
    navigation.setOptions({
        headerRight: () => (
            <TextC>
                {data.object.prevGroup ?
                    <Pressable
                        style={style().buttonTopRight}
                        onPress={() =>
                            navigation.navigateDeprecated(route.name, {item: data.object.prevGroup})
                        }>
                        <TextC style={style().textButtonTopRight}>{'<'}</TextC>
                    </Pressable>
                    : null}
                <TextC> </TextC>
                {data.object.nextGroup ?
                    <Pressable
                        style={style().buttonTopRight}
                        onPress={() =>
                            navigation.navigateDeprecated(route.name, {item: data.object.nextGroup})
                        }>
                        <TextC style={style().textButtonTopRight}>{'>'}</TextC>
                    </Pressable>
                    : null}
            </TextC>
        ),
    });
};

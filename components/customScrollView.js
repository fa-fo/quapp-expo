import {ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function ScrollViewC(props) {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            {...props}
            contentContainerStyle={{paddingBottom: insets.bottom}}
        >
            {props.children}
        </ScrollView>
    );
}

import {Text} from 'react-native';
import * as ColorFunctions from "./functions/ColorFunctions";

export default function TextC(props) {
    return (
        <Text
            {...props}
            style={[{color: ColorFunctions.getColor('primary')}, props.style]}
        >
            {props.children}
        </Text>
    );
}

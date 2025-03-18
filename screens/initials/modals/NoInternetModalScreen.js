import TextC from "../../../components/customText";
import {Pressable, View} from 'react-native';
import {style} from '../../../assets/styles.js';

export default function NoInternetModalScreen({navigation}) {

    return (
        <View style={style().centeredView}>
            <View style={style().modalView}>
                <TextC style={style().big3}>Keine Verbindung zum {global.tournamentName}-Server</TextC>
                <Pressable style={[style().button1, style().buttonGreen]}
                           onPress={() => navigation.goBack()}>
                    <TextC style={style().textButton1}>zurück</TextC>
                </Pressable>
            </View>
        </View>
    );
}


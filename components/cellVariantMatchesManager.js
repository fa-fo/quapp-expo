import TextC from "../components/customText";
import {View} from 'react-native';
import {style} from '../assets/styles';
import * as SportFunctions from "./functions/SportFunctions";

export default function CellVariantMatchesManager(props) {

    return (
        <View style={[style().viewCentered, (props.i === 0 ? {marginTop: 8} : null)]}>
            <View style={style().matchflexRowView}>
                <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 8}}>
                    <TextC numberOfLines={1}>
                        {SportFunctions.getSportImage(props.item.sport.code)}
                        {props.item.sport.code + ' '}
                        <TextC style={style().textBlue}>{props.item.group_name}</TextC>
                    </TextC>
                </View>
                <View style={{flex: 1}}>
                    <TextC adjustsFontSizeToFit numberOfLines={1}
                           style={[style().big3, style().textRed]}>
                        {props.item.logsCalc.score !== undefined
                            ? parseInt(props.item.logsCalc.score[props.item.team1_id]) ||
                            0
                            : 0}
                        {' '}:{' '}
                        {props.item.logsCalc.score !== undefined
                            ? parseInt(props.item.logsCalc.score[props.item.team2_id]) ||
                            0
                            : 0}
                    </TextC>
                </View>
            </View>
        </View>
    );
}

import TextC from "../components/customText";
import {View} from 'react-native';
import {Cell} from 'react-native-tableview-simple';
import * as SportFunctions from "./functions/SportFunctions";
import {style} from "../assets/styles";
import * as ColorFunctions from "./functions/ColorFunctions";

export default function CellVariant(props) {

    return (
        <Cell
            {...props}
            cellStyle="RightDetail"
            accessory="DisclosureIndicator"
            backgroundColor={props.isCurrentRound ? ColorFunctions.getColor('GreenLightBg') : (props.backgroundColor ?? '')}
            cellContentView={
                <View
                    style={{
                        alignSelf: 'flex-start',
                        flexDirection: 'row',
                        flex: 1,
                        paddingVertical: 10,
                    }}>
                    <View style={{flex: 1, alignSelf: 'center'}}>
                        <TextC
                            numberOfLines={1}
                            style={{
                                fontWeight: props.isMyTeam ? 'bold' : 'normal',
                                fontSize: 16,
                            }}>
                            {props.title}
                            {props.countStars ? SportFunctions.getChampionshipStars(props.countStars) : null}
                            {props.canceled ?
                                <TextC style={{color: '#a33300', fontSize: 10}}> zurückgezogen</TextC> : null}
                            {props.isCurrentRound ? <TextC style={style().textRed}> Live!</TextC> : null}
                        </TextC>
                    </View>
                    <View style={{alignSelf: 'center'}}>
                        <TextC
                            numberOfLines={1}
                            style={{color: (props.detailColor ?? '#8E8E93'), fontSize: 14}}>
                            {props.detail}
                        </TextC>
                    </View>
                </View>
            }
        />
    );
}

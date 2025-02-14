import TextC from "../components/customText";
import {View} from 'react-native';
import {Cell} from 'react-native-tableview-simple';
import * as SportFunctions from "./functions/SportFunctions";
import * as ColorFunctions from "./functions/ColorFunctions";

export default function CellVariantBalance(props) {
    return (
        <Cell
            {...props}
            cellStyle="RightDetail"
            accessory="DisclosureIndicator"
            backgroundColor={
                props.object[props.item.id][1] > (props.object[props.item.id][2] ?? 0) ? ColorFunctions.getColor('GreenLightBg')
                    : (props.object[props.item.id][2] > (props.object[props.item.id][1] ?? 0) ? ColorFunctions.getColor('RedLightBg')
                    : '')
            }
            cellContentView={
                <View
                    style={{
                        alignSelf: 'flex-start',
                        flexDirection: 'row',
                        flex: 1,
                        paddingVertical: 6,
                    }}>
                    <View style={{alignSelf: 'center', flex: 0.4}}>
                        <TextC style={{textAlign: 'right'}}>
                            {SportFunctions.getSportImage(props.item.code)}
                        </TextC>
                    </View>
                    <View style={{alignSelf: 'center', flex: 2}}>
                        <TextC
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={{
                                fontSize: 20,
                                textAlign: 'right',
                            }}>
                            {props.item.name + ': '}
                        </TextC>
                    </View>
                    <View style={{alignSelf: 'center', flex: 2}}>
                        <TextC
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={{
                                fontSize: 16,
                                textAlign: 'center',
                            }}>
                            {(props.object[props.item.id][1] ?? 0)}
                        </TextC>
                    </View>
                    <View style={{alignSelf: 'center', flex: 2}}>
                        <TextC
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={{
                                fontSize: 16,
                                textAlign: 'center',
                            }}>
                            {(props.object[props.item.id][0] ?? 0)}
                        </TextC>
                    </View>
                    <View style={{alignSelf: 'center', flex: 2}}>
                        <TextC
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={{
                                fontSize: 16,
                                textAlign: 'center',
                            }}>
                            {(props.object[props.item.id][2] ?? 0)}
                        </TextC>
                    </View>
                    <View style={{alignSelf: 'center'}}>
                        <TextC
                            numberOfLines={1}
                            style={{color: '#8E8E93', fontSize: 14}}>
                            {props.detail}
                        </TextC>
                    </View>
                </View>
            }
        />
    );
}

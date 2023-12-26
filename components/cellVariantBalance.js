import * as React from 'react';
import {Image, Text, View} from 'react-native';
import {Cell} from 'react-native-tableview-simple';
import styles from "../assets/styles";
import * as SportFunctions from "./functions/SportFunctions";

export default function CellVariantBalance(props) {
    return (
        <Cell
            {...props}
            cellStyle="RightDetail"
            accessory="DisclosureIndicator"
            backgroundColor={
                props.object[props.item.id][1] > (props.object[props.item.id][2] ?? 0) ? 'rgba(151,245,135,0.37)'
                    : (props.object[props.item.id][2] > (props.object[props.item.id][1] ?? 0) ? 'rgba(245,135,135,0.37)'
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
                        <Text style={{textAlign: 'right'}}>
                            <Image
                                style={styles.sportImage}
                                source={SportFunctions.getSportImage(props.item.code)}
                            />
                        </Text>
                    </View>
                    <View style={{alignSelf: 'center', flex: 2}}>
                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={{
                                fontSize: 20,
                                textAlign: 'right',
                            }}>
                            {props.item.name + ': '}
                        </Text>
                    </View>
                    <View style={{alignSelf: 'center', flex: 2}}>
                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={{
                                fontSize: 16,
                                textAlign: 'center',
                            }}>
                            {(props.object[props.item.id][1] ?? 0)}
                        </Text>
                    </View>
                    <View style={{alignSelf: 'center', flex: 2}}>
                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={{
                                fontSize: 16,
                                textAlign: 'center',
                            }}>
                            {(props.object[props.item.id][0] ?? 0)}
                        </Text>
                    </View>
                    <View style={{alignSelf: 'center', flex: 2}}>
                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={{
                                fontSize: 16,
                                textAlign: 'center',
                            }}>
                            {(props.object[props.item.id][2] ?? 0)}
                        </Text>
                    </View>
                    <View style={{alignSelf: 'center'}}>
                        <Text
                            numberOfLines={1}
                            style={{color: '#8E8E93', fontSize: 14}}>
                            {props.detail}
                        </Text>
                    </View>
                </View>
            }
        />
    );
}

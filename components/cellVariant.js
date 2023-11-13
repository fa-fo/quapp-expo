import * as React from 'react';
import {Text, View} from 'react-native';
import {Cell} from 'react-native-tableview-simple';
import * as SportFunctions from "./functions/SportFunctions";

export default function CellVariant(props) {

    return (
        <Cell
            {...props}
            cellStyle="RightDetail"
            accessory="DisclosureIndicator"
            cellContentView={
                <View
                    style={{
                        alignSelf: 'flex-start',
                        flexDirection: 'row',
                        flex: 1,
                        paddingVertical: 10,
                    }}>
                    <View style={{flex: 1, alignSelf: 'center'}}>
                        <Text
                            numberOfLines={1}
                            style={{
                                fontWeight: props.isMyTeam ? 'bold' : 'normal',
                                fontSize: 16,
                            }}>
                            {props.title}
                            {props.countStars ? SportFunctions.getChampionshipStars(props.countStars) : null}
                            {props.canceled ? (
                                <Text style={{color: '#a33300', fontSize: 10}}>
                                    {' '}
                                    zurückgezogen
                                </Text>
                            ) : (
                                ''
                            )}
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

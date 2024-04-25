import * as React from 'react';
import {Text, View} from 'react-native';
import {Cell} from 'react-native-tableview-simple';
import * as SportFunctions from "./functions/SportFunctions";
import styles from "../assets/styles";

export default function CellVariant(props) {

    return (
        <Cell
            {...props}
            cellStyle="RightDetail"
            accessory="DisclosureIndicator"
            backgroundColor={props.isCurrentRound ? 'rgba(151,245,135,0.37)' : ''}
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
                            {props.canceled ?
                                <Text style={{color: '#a33300', fontSize: 10}}> zurückgezogen</Text> : null}
                            {props.isCurrentRound ? <Text style={styles.textRed}> Live!</Text> : null}
                        </Text>
                    </View>
                    <View style={{alignSelf: 'center'}}>
                        <Text
                            numberOfLines={1}
                            style={{color: (props.detailColor ?? '#8E8E93'), fontSize: 14}}>
                            {props.detail}
                        </Text>
                    </View>
                </View>
            }
        />
    );
}

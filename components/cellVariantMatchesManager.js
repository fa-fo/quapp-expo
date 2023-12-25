import * as React from 'react';
import {Image, Text, View} from 'react-native';
import styles from '../assets/styles';
import * as SportFunctions from "./functions/SportFunctions";

export default function CellVariantMatchesManager(props) {

    return (
        <View style={[styles.viewCentered, (props.i === 0 ? {marginTop: 8} : null)]}>
            <View style={styles.matchflexRowView}>
                <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 8}}>
                    <Text numberOfLines={1}>
                        <Image
                            style={styles.sportImage}
                            source={SportFunctions.getSportImage(props.item.sport.code)}
                        />
                        {props.item.sport.code + ' '}
                        <Text style={styles.textBlue}>{props.item.group_name}</Text>
                    </Text>
                </View>
                <View style={{flex: 1}}>
                    <Text adjustsFontSizeToFit numberOfLines={1}
                          style={[styles.big3, styles.textRed]}>
                        {props.item.logsCalc.score !== undefined
                            ? parseInt(props.item.logsCalc.score[props.item.team1_id]) ||
                            0
                            : 0}
                        {' '}:{' '}
                        {props.item.logsCalc.score !== undefined
                            ? parseInt(props.item.logsCalc.score[props.item.team2_id]) ||
                            0
                            : 0}
                    </Text>
                </View>
            </View>
        </View>
    );
}

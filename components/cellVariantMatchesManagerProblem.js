import * as React from 'react';
import {useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';
import styles from '../assets/styles';
import * as SportFunctions from "./functions/SportFunctions";

export default function CellVariantMatchesManagerProblem(props) {
    const [showOffset, setShowOffset] = useState(false);

    useEffect(() => {
        setShowOffset(props.item.logsCalc.avgOffset !== undefined
            && parseFloat(props.item.logsCalc.avgOffset) > 2);

        return () => {
            setShowOffset(false);
        };
    }, [props.item.logsCalc]);

    let getStatus = function (status) {
        return props.item.logsCalc[status];
    };

    let getProblemEventView = function (status, nameProblem) {
        return (
            getStatus(status) ? null :
                <View style={[styles.viewStatus, getButtonStyle(status), {maxWidth: getButtonWidth(status)}]}>
                    <Text numberOfLines={1} style={styles.textButton1}>
                        {nameProblem}
                    </Text>
                </View>
        );
    };

    let getButtonStyle = function (status) {
        if (status === 'isLoggedIn' && !getStatus('wasLoggedIn')) {
            return styles.buttonRed;
        } else if (status === 'isMatchStarted' || (status === 'isLoggedIn' && getStatus('wasLoggedIn'))) {
            return styles.buttonGreyDark;
        }

        return styles.buttonRed50;
    };

    let getButtonWidth = function (status) {
        if (status === 'isLoggedIn' && !getStatus('wasLoggedIn')) {
            return '95%';
        }

        return '85%';
    };

    function getOffsets() {
        return (
            <Text style={styles.textRed}>{'Offset: '
            + props.item.logsCalc.minOffset + '-'
            + props.item.logsCalc.avgOffset + '-'
            + props.item.logsCalc.maxOffset}
            </Text>
        )
    }

    return (
        props.item.canceled ||
        (getStatus('isLoggedIn')
            && getStatus('isRefereeOnPlace')
            && getStatus('isTeam1OnPlace')
            && getStatus('isTeam2OnPlace')
            && getStatus('isMatchStarted')
            && !showOffset)
            ? null :
            <View style={styles.viewCentered}>
                <View style={styles.matchflexRowView}>
                    <View style={[styles.viewStatus, {flex: 1, alignItems: 'flex-end'}]}>
                        <Text numberOfLines={1}>
                            <Image
                                style={styles.sportImage}
                                source={SportFunctions.getSportImage(props.item.sport.code)}
                            />
                            {props.item.sport.code + ' '}
                            <Text style={styles.textBlue}>{props.item.group_name}</Text>
                        </Text>
                    </View>
                    <View style={{flex: 4, alignSelf: 'flex-start', paddingRight: 20}}>
                        {getProblemEventView('isLoggedIn', (props.item.teams4 ? props.item.teams4.name : props.item.teams3.name) + ': ' + (props.item.teams4 ? 'Ersatz-' : '') + 'SR nicht eingeloggt')}

                        {getStatus('isMatchStarted') ? null :
                            (!getStatus('isLoggedIn')
                                && !getStatus('isRefereeOnPlace')
                                && !getStatus('isTeam1OnPlace')
                                && !getStatus('isTeam2OnPlace') ? null :
                                    <View>
                                        {getProblemEventView('isRefereeOnPlace', (props.item.teams4 ? props.item.teams4.name : props.item.teams3.name) + ': ' + (props.item.teams4 ? 'Ersatz-' : '') + 'SR nicht am Platz')}
                                        {getProblemEventView('isTeam1OnPlace', props.item.teams1.name + ': Team nicht am Platz')}
                                        {getProblemEventView('isTeam2OnPlace', props.item.teams2.name + ': Team nicht am Platz')}

                                        {getStatus('isRefereeOnPlace')
                                        && getStatus('isTeam1OnPlace')
                                        && getStatus('isTeam2OnPlace') ?
                                            getProblemEventView('isMatchStarted', 'Spiel nicht gestartet')
                                            : null}
                                    </View>
                            )}

                        {showOffset ? getOffsets() : null}
                    </View>
                </View>
            </View>
    );
}

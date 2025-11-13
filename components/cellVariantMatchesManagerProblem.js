import TextC from "../components/customText";
import {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import {style} from '../assets/styles';
import * as SportFunctions from "./functions/SportFunctions";
import PinModal from "./modals/PinModal";

export default function CellVariantMatchesManagerProblem(props) {
    const [pinModalVisible, setPinModalVisible] = useState(false);
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
                <View style={[style().viewStatus, getButtonStyle(status), {maxWidth: getButtonWidth(status)}]}>
                    <TextC numberOfLines={1} style={style().textButton1}>
                        {status === 'isLoggedIn' ?
                            <Pressable
                                style={[style().button1, style().buttonPIN]}
                                onPress={() => setPinModalVisible(true)}>
                                <TextC style={style().textButton1}>PIN</TextC>
                            </Pressable>
                            : null}
                        {nameProblem}
                    </TextC>
                </View>
        );
    };

    let getButtonStyle = function (status) {
        if (status === 'isLoggedIn' && !getStatus('wasLoggedIn')) {
            global.criticalIssuesCount++;
            return style().buttonRed;
        } else if (status === 'isMatchStarted' || (status === 'isLoggedIn' && getStatus('wasLoggedIn'))) {
            return style().buttonGreyDark;
        } else if ((status === 'isRefereeOnPlace' || status === 'isTeam1OnPlace' || status === 'isTeam2OnPlace')
            && (getStatus('isRefereeOnPlace') || getStatus('isTeam1OnPlace') || getStatus('isTeam2OnPlace'))) {
            // not all participants on place
            global.criticalIssuesCount++;
            return style().buttonRed;
        }

        return style().buttonRed50;
    };

    let getButtonWidth = function (status) {
        if (status === 'isLoggedIn' && !getStatus('wasLoggedIn')) {
            return '95%';
        }

        return '85%';
    };

    function getOffsets() {
        return (
            <TextC style={style().textRed}>{'Offset: '
                + props.item.logsCalc.minOffset + '-'
                + props.item.logsCalc.avgOffset + '-'
                + props.item.logsCalc.maxOffset}
            </TextC>
        )
    }

    return (
        props.item.canceled ||
        (getStatus('isLoggedIn')
            && getStatus('isMatchReadyToStart')
            && getStatus('isMatchStarted')
            && !showOffset)
            ? null :
            <View style={style().viewCentered}>
                <View style={style().matchflexRowView}>
                    <View style={[style().viewStatus, {flex: 1, alignItems: 'flex-end', justifyContent: 'center'}]}>
                        <TextC numberOfLines={1} adjustsFontSizeToFit>
                            {SportFunctions.getSportImage(props.item.sport.code)}
                            {props.item.sport.code + ' '}
                            <TextC style={[style().textBlue, {fontWeight: 'bold', fontSize: 16}]}>
                                {props.item.group_name}
                            </TextC>
                        </TextC>
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
                <PinModal
                    setModalVisible={setPinModalVisible}
                    modalVisible={pinModalVisible}
                    match={props.item}
                />
            </View>
    );
}

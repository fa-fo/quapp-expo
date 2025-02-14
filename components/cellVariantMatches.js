import TextC from "../components/customText";
import {useEffect, useState} from 'react';
import {Linking, Pressable, View} from 'react-native';
import {Cell} from 'react-native-tableview-simple';
import {style} from '../assets/styles.js';
import SupervisorActionsModal from './modals/SupervisorActionsModal';
import * as SportFunctions from './functions/SportFunctions';
import * as ColorFunctions from "./functions/ColorFunctions";

export default function CellVariantMatches(props) {
    const [showBlinking, setShowBlinking] = useState(true);
    const [supervisorActionsModalVisible, setSupervisorActionsModalVisible] =
        useState(false);

    useEffect(() => {
        if (props.item.isRefereeJobLoginRequired && (props.isCurrentRound || props.nextIsCurrentRound)) {
            let i = 0;
            const interval = setInterval(() => {
                setShowBlinking(!!(++i % 2));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, []);

    return (
        <Cell
            {...props}
            cellStyle="RightDetail"
            accessory="DisclosureIndicator"
            backgroundColor={
                props.isRefereeJob ? ColorFunctions.getColor('VioletLightBg')
                    : props.isCurrentRound && !props.item.canceled ? ColorFunctions.getColor('GreenLightBg')
                    : props.backgroundColor
            }
            cellContentView={
                <View
                    style={{
                        alignSelf: 'flex-start',
                        flexDirection: 'row',
                        flex: 1,
                        paddingVertical: 4,
                    }}>
                    <View style={{flex: 1}}>
                        <TextC adjustsFontSizeToFit numberOfLines={1}
                               style={{
                                   fontWeight:
                                       props.isMyTeam === 1 || props.isMyTeam === 2
                                           ? 'bold'
                                           : 'normal',
                               }}>
                            {props.timeText}
                        </TextC>
                        <TextC adjustsFontSizeToFit numberOfLines={1}>
                            {props.timeText2 ??
                            <TextC>
                                {SportFunctions.getSportImage(props.item.sport.code)}
                                {props.item.sport.code}
                                {props.isRefereeJob ?
                                    <TextC style={style().textViolet}>
                                        {'SR' + (props.item.teams4 ? '-E' : '') + (props.refereeGroupName !== props.item.group_name ? ' ' + props.item.group_name + '\u2762' : '')}
                                    </TextC> : null}
                            </TextC>
                            }
                        </TextC>
                        {props.item.isPlayOff ?
                            <TextC numberOfLines={1}>
                                {props.item.playOffName ?? ''}
                            </TextC> : null}

                    </View>
                    <View style={{
                        flex: (props.item.canceled || props.team1Result !== null || (global.settings?.useLiveScouting && (props.isCurrentRound || props.item.isRefereeJobLoginRequired)) ? 3 : 3.6),
                        fontSize: 14
                    }}>
                        <TextC
                            numberOfLines={1}
                            style={[
                                props.item.canceled === 1 || props.item.canceled === 3
                                    ? style().textRed
                                    : null,
                                props.isMyTeam === 1 ? {fontWeight: 'bold'} : null,
                            ]}>
                            {(props.item.teams1?.name ?? '') + (props.item.isTest ? '_test' : '')}
                        </TextC>
                        <TextC
                            numberOfLines={1}
                            style={[
                                props.item.canceled === 2 || props.item.canceled === 3
                                    ? style().textRed
                                    : null,
                                props.isMyTeam === 2 ? {fontWeight: 'bold'} : null,
                            ]}>
                            {(props.item.teams2?.name ?? '') + (props.item.isTest ? '_test' : '')}
                        </TextC>
                        {props.fromRoute === 'ListMatchesByRefereeCanceledTeamsSupervisor' && props.item.teams3 ? (
                            <TextC numberOfLines={1} style={style().textRed}>
                                <TextC
                                    style={style().textViolet}>SR</TextC> {props.item.teams3.name + (props.item.isTest ? '_test' : '')}
                            </TextC>
                        ) : null}
                        {props.fromRoute === 'ListMatchesByRefereeCanceledTeamsSupervisor' && props.item.teams4 ? (
                            <TextC numberOfLines={1} style={style().textGreen}>
                                <TextC
                                    style={style().textViolet}>Ersatz-SR</TextC> {props.item.teams4.name + (props.item.isTest ? '_test' : '')}
                            </TextC>
                        ) : null}
                    </View>

                    {props.item.canceled && props.team1Result === null ?
                        <View style={{flex: 0.6, alignSelf: 'center'}}>
                            <TextC numberOfLines={1} adjustsFontSizeToFit
                                   style={[style().textRed, {fontSize: 16, textAlign: 'right'}]}>
                                abg.
                            </TextC>
                        </View>
                        : (props.team1Result !== null ?
                            <View style={{flex: 0.6, fontSize: 14}}>
                                <TextC numberOfLines={1}
                                       style={{
                                           fontWeight: props.isMyTeam === 1 ? 'bold' : 'normal',
                                           textAlign: 'right',
                                       }}>
                                    {props.team1Result}
                                </TextC>
                                <TextC numberOfLines={1}
                                       style={{
                                           fontWeight: props.isMyTeam === 2 ? 'bold' : 'normal',
                                           textAlign: 'right',
                                       }}>
                                    {props.team2Result}
                                </TextC>
                            </View>
                            : (props.localScore ?
                                <View style={{flex: 1.6, fontSize: 14}}>
                                    <Pressable
                                        style={[style().button1, style().buttonConfirm, style().buttonOrange]}
                                        onPress={() => Linking.openURL('mailto:info@quattfo.de?subject='
                                            + encodeURIComponent('Ergebnis ' + props.item.id)
                                            + '&body=' + encodeURIComponent((props.item.teams1?.name ?? '') + ':\n' + props.localScore[props.item.team1_id] + '\n\n' + (props.item.teams2?.name ?? '') + ':\n' + props.localScore[props.item.team2_id] + '\n\nKommentar des Schiedsrichters:\n'))}>
                                        <TextC numberOfLines={2} adjustsFontSizeToFit style={style().textButton1}>
                                            Ergebnis per Mail senden
                                        </TextC>
                                    </Pressable>
                                </View>
                                : (props.item.isRefereeJobLoginRequired ?
                                        <View style={{flex: 0.6, alignSelf: 'center'}}>
                                            <TextC numberOfLines={1} adjustsFontSizeToFit
                                                   style={[style().textViolet, {
                                                       fontSize: 16,
                                                       textAlign: 'right',
                                                       fontWeight: props.isCurrentRound || props.nextIsCurrentRound ? 'bold' : 'normal'
                                                   }]}>{showBlinking ? 'Login!' : ''}</TextC>
                                        </View>
                                        : (props.isCurrentRound && global.settings?.useLiveScouting ?
                                            <View style={{flex: 0.6, alignSelf: 'center'}}>
                                                <TextC numberOfLines={1} adjustsFontSizeToFit
                                                       style={[style().textRed, {
                                                           fontSize: 16,
                                                           textAlign: 'right'
                                                       }]}>Live!</TextC>
                                            </View>
                                            : null)
                                )))}

                    {props.fromRoute === 'ListMatchesByRefereeCanceledTeamsSupervisor' ? (
                        <View style={{alignSelf: 'center', flex: 1}}>
                            <Pressable
                                style={[style().button1, style().buttonConfirm, style().buttonOrange]}
                                onPress={() => setSupervisorActionsModalVisible(true)}>
                                <TextC numberOfLines={1} style={style().textButton1}>
                                    Supervisor Aktionen
                                </TextC>
                            </Pressable>
                        </View>
                    ) : null}


                    {props.fromRoute === 'ListMatchesByRefereeCanceledTeamsSupervisor' ?
                        <View style={{alignSelf: 'center', flex: 1}}>
                            <TextC
                                numberOfLines={1}
                                style={[style().textBlue, {fontSize: 16, textAlign: 'right'}]}>
                                Gr. {props.item.group_name}
                            </TextC>
                        </View>
                        : null}
                    {props.fromRoute === 'ListMatchesByRefereeCanceledTeamsSupervisor' ? (
                        <SupervisorActionsModal
                            setModalVisible={setSupervisorActionsModalVisible}
                            modalVisible={supervisorActionsModalVisible}
                            match={props.item}
                            loadScreenData={props.loadScreenData}
                        />
                    ) : null}
                </View>
            }
        />
    );
}

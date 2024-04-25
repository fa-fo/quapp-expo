import * as React from 'react';
import {useState} from 'react';
import {Image, Linking, Pressable, Text, View} from 'react-native';
import {Cell} from 'react-native-tableview-simple';
import styles from '../assets/styles.js';
import SupervisorActionsModal from './modals/SupervisorActionsModal';
import * as SportFunctions from './functions/SportFunctions';

export default function CellVariantMatches(props) {
    const [supervisorActionsModalVisible, setSupervisorActionsModalVisible] =
        useState(false);


    return (
        <Cell
            {...props}
            cellStyle="RightDetail"
            accessory="DisclosureIndicator"
            backgroundColor={
                props.isRefereeJob ? 'rgba(208,167,222,0.15)' : props.isCurrentRound && !props.item.canceled ? 'rgba(151,245,135,0.37)' : props.backgroundColor
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
                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={{
                                fontWeight:
                                    props.isMyTeam === 1 || props.isMyTeam === 2
                                        ? 'bold'
                                        : 'normal',
                            }}>
                            {props.timeText}
                        </Text>
                        <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                        >
                            {props.timeText2 ??
                            <Text>
                                <Image
                                    style={styles.sportImage}
                                    source={SportFunctions.getSportImage(props.item.sport.code)}
                                />
                                {props.item.sport.code}
                                {props.isRefereeJob ?
                                    <Text style={styles.textViolet}>
                                        {'SR' + (props.item.teams4 ? '-E' : '') + (props.refereeGroupName !== props.item.group_name ? ' ' + props.item.group_name + '\u2762' : '')}
                                    </Text> : null}
                            </Text>
                            }
                        </Text>
                    </View>
                    <View style={{
                        flex: (props.item.canceled || props.team1Result !== null || props.isCurrentRound ? 3 : 3.6),
                        fontSize: 14
                    }}>
                        <Text
                            numberOfLines={1}
                            style={[
                                props.item.canceled === 1 || props.item.canceled === 3
                                    ? styles.textRed
                                    : null,
                                props.isMyTeam === 1 ? {fontWeight: 'bold'} : null,
                            ]}>
                            {props.item.teams1.name}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={[
                                props.item.canceled === 2 || props.item.canceled === 3
                                    ? styles.textRed
                                    : null,
                                props.isMyTeam === 2 ? {fontWeight: 'bold'} : null,
                            ]}>
                            {props.item.teams2.name}
                        </Text>
                        {props.fromRoute === 'ListMatchesByRefereeCanceledTeamsSupervisor' ? (
                            <Text numberOfLines={1} style={styles.textRed}>
                                <Text style={styles.textViolet}>SR</Text> {props.item.teams3.name}
                            </Text>
                        ) : null}
                        {props.fromRoute === 'ListMatchesByRefereeCanceledTeamsSupervisor' && props.item.teams4 ? (
                            <Text numberOfLines={1} style={styles.textGreen}>
                                <Text style={styles.textViolet}>Ersatz-SR</Text> {props.item.teams4.name}
                            </Text>
                        ) : null}
                    </View>

                    {props.item.canceled && props.team1Result === null ?
                        <View style={{flex: 0.6, alignSelf: 'center'}}>
                            <Text
                                numberOfLines={1}
                                style={[styles.textRed, {fontSize: 16, textAlign: 'right'}]}>
                                abg.
                            </Text>
                        </View>
                        : (props.team1Result !== null ?
                            <View style={{flex: 0.6, fontSize: 14}}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        fontWeight: props.isMyTeam === 1 ? 'bold' : 'normal',
                                        textAlign: 'right',
                                    }}>
                                    {props.team1Result}
                                </Text>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        fontWeight: props.isMyTeam === 2 ? 'bold' : 'normal',
                                        textAlign: 'right',
                                    }}>
                                    {props.team2Result}
                                </Text>
                            </View>
                            : (props.localScore ?
                                    <View style={{flex: 1.6, fontSize: 14}}>
                                        <Pressable
                                            style={[styles.button1, styles.buttonConfirm, styles.buttonOrange]}
                                            onPress={() => Linking.openURL('mailto:info@quattfo.de?subject='
                                                + encodeURIComponent('Ergebnis ' + props.item.id)
                                                + '&body=' + encodeURIComponent(props.item.teams1.name + ':\n' + props.localScore[props.item.team1_id] + '\n\n' + props.item.teams2.name + ':\n' + props.localScore[props.item.team2_id] + '\n\nKommentar des Schiedsrichters:\n'))}>
                                            <Text numberOfLines={2} style={styles.textButton1}>
                                                Ergebnis per Mail senden
                                            </Text>
                                        </Pressable>
                                    </View>
                                    : (props.isCurrentRound ?
                                        <View style={{flex: 0.6, alignSelf: 'center'}}>
                                            <Text numberOfLines={1} style={[styles.textRed, {
                                                fontSize: 16,
                                                textAlign: 'right'
                                            }]}>Live!</Text>
                                        </View>
                                        : null)
                            ))}

                    {props.fromRoute === 'ListMatchesByRefereeCanceledTeamsSupervisor' ? (
                        <View style={{alignSelf: 'center', flex: 1}}>
                            <Pressable
                                style={[styles.button1, styles.buttonConfirm, styles.buttonOrange]}
                                onPress={() => setSupervisorActionsModalVisible(true)}>
                                <Text numberOfLines={1} style={styles.textButton1}>
                                    Supervisor Aktionen
                                </Text>
                            </Pressable>
                        </View>
                    ) : null}


                    {props.fromRoute === 'ListMatchesByRefereeCanceledTeamsSupervisor' ?
                        <View style={{alignSelf: 'center', flex: 1}}>
                            <Text
                                numberOfLines={1}
                                style={[styles.textBlue, {fontSize: 16, textAlign: 'right'}]}>
                                Gr. {props.item.group_name}
                            </Text>
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

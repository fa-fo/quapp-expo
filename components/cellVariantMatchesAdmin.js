import * as React from 'react';
import {useEffect, useState} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {Cell} from 'react-native-tableview-simple';
import styles from '../assets/styles';
import SpecialConfirmModal from './modals/SpecialConfirmModal';
import InsertResultModal from './modals/InsertResultModal';
import SupervisorActionsModal from './modals/SupervisorActionsModal';
import RemarksModal from './modals/RemarksModal';
import CardsModal from './modals/CardsModal';
import * as ConfirmFunctions from './functions/ConfirmFunctions';
import * as SportFunctions from "./functions/SportFunctions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function CellVariantMatchesAdmin(props) {
    const [specialConfirmModalVisible, setSpecialConfirmModalVisible] =
        useState(false);
    const [insertResultModalVisible, setInsertResultModalVisible] =
        useState(false);
    const [supervisorActionsModalVisible, setSupervisorActionsModalVisible] =
        useState(false);
    const [remarksModalVisible, setRemarksModalVisible] =
        useState(false);
    const [cardsModalVisible, setCardsModalVisible] =
        useState(false);

    useEffect(() => {
        return () => {
            setSpecialConfirmModalVisible(false);
            setInsertResultModalVisible(false);
            setSupervisorActionsModalVisible(false);
        };
    }, []);

    let getButtonStyle = function (status) {
        if (!props.item.logsCalc[status]) {
            return status === 'isMatchStarted'
                ? styles.buttonGreyDark
                : styles.buttonRed;
        } else {
            return styles.buttonGreen;
        }
    };

    let getStatus = function (status) {
        return props.item.logsCalc[status];
    };

    let getEventView = function (status, nameTrue, nameFalse) {
        return (
            <View style={[styles.viewStatus, getButtonStyle(status)]}>
                <Text numberOfLines={1} style={styles.textButton1}>
                    {getStatus(status) ? nameTrue : nameFalse}
                </Text>
            </View>
        );
    };

    function getSpecialConfirmModalButton() {
        return (
            <Pressable
                style={[styles.button1, styles.buttonConfirm, styles.buttonGreyDark]}
                onPress={() => setSpecialConfirmModalVisible(true)}>
                <Text numberOfLines={1} style={styles.textButton1}>
                    Sonderwertung
                </Text>
            </Pressable>
        );
    }

    function getInsertResultModalButton() {
        return (
            <Pressable
                style={[styles.button1, styles.buttonConfirm, styles.buttonGreyDark]}
                onPress={() => setInsertResultModalVisible(true)}>
                <Text numberOfLines={1} style={styles.textButton1}>
                    Ergebniseingabe
                </Text>
            </Pressable>
        );
    }

    function showOffsets() {
        return (
            props.fromRoute === 'RoundsMatchesAdmin' && props.item.logsCalc.avgOffset !== undefined ?
                <Text style={styles.textRed}>{'Offset: '
                + props.item.logsCalc.minOffset + '-'
                + props.item.logsCalc.avgOffset + '-'
                + props.item.logsCalc.maxOffset}
                </Text>
                : null)
    }

    function showCardsButton() {
        const array = Object.keys(props.item.logsCalc);
        const fouls = array.filter(s => s.includes('FOUL_'));
        return fouls.length;
    }

    function getCardsAndRemarks() {
        return (
            props.fromRoute === 'RoundsMatchesAdmin' ?
                <Text adjustsFontSizeToFit numberOfLines={1}>
                    {props.item.remarks ?
                        <Pressable
                            style={[styles.button1, styles.buttonConfirm, styles.buttonRed]}
                            onPress={() => setRemarksModalVisible(true)}>
                            <Text style={styles.textButton1}><Icon name="exclamation-thick"
                                                                   size={20}/></Text>
                        </Pressable>
                        : null}
                    {showCardsButton() ?
                        <Pressable
                            style={[styles.button1, styles.buttonConfirm, styles.buttonOrange]}
                            onPress={() => setCardsModalVisible(true)}>
                            <Text style={styles.textButton1}><Icon name="cards"
                                                                   size={20}/></Text>
                        </Pressable>
                        : null}
                </Text>
                : null)
    }

    return (
        <Cell
            {...props}
            cellStyle="RightDetail"
            cellContentView={
                <View
                    style={{
                        alignSelf: 'flex-start',
                        flexDirection: 'row',
                        flex: 1,
                        paddingVertical: 2,
                    }}>
                    <View style={{flex: 3.5, fontSize: 14}}>
                        <Text numberOfLines={1}>
                            {props.timeText}{' '}
                            <Image
                                style={styles.sportImage}
                                source={SportFunctions.getSportImage(props.item.sport.code)}
                            />
                            <Text style={{color: '#8E8E93'}}>{props.item.sport.code}</Text>
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={
                                props.item.canceled === 1 || props.item.canceled === 3
                                    ? styles.textRed
                                    : null
                            }>
                            {props.item.teams1.name}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={
                                props.item.canceled === 2 || props.item.canceled === 3
                                    ? styles.textRed
                                    : null
                            }>
                            {props.item.teams2.name}
                        </Text>
                        <Text numberOfLines={1} style={props.item.isRefereeCanceled ? styles.textRed : ''}>
                            <Text style={styles.textViolet}>SR</Text> {props.item.teams3.name}
                        </Text>
                        {props.item.teams4 ? (
                            <Text numberOfLines={1} style={styles.textGreen}>
                                <Text style={styles.textViolet}>Ersatz-SR</Text> {props.item.teams4.name}
                            </Text>
                        ) : null}

                    </View>
                    {!props.item.logsCalc.isMatchStarted &&
                    !props.item.logsCalc.isResultConfirmed &&
                    !props.item.canceled ? (
                        <View style={{alignSelf: 'center', flex: 2}}>
                            {getEventView('isLoggedIn', 'SR eingeloggt', 'SR nicht eingeloggt')}
                            {getEventView('isRefereeOnPlace', 'SR am Platz', 'SR nicht am Platz')}
                        </View>
                    ) : null}
                    {!props.item.logsCalc.isMatchStarted &&
                    !props.item.logsCalc.isResultConfirmed &&
                    !props.item.canceled ? (
                        <View style={{alignSelf: 'center', flex: 2}}>
                            {getEventView('isTeam1OnPlace', 'Team 1 am Platz', 'Team 1 nicht am Platz')}
                            {getEventView('isTeam2OnPlace', 'Team 2 am Platz', 'Team 2 nicht am Platz')}
                        </View>
                    ) : null}
                    {!props.item.logsCalc.isMatchStarted &&
                    !props.item.logsCalc.isResultConfirmed &&
                    !props.item.canceled ? (
                        <View style={{alignSelf: 'center', flex: 2}}>
                            {getEventView('isMatchStarted', 'Spiel gestartet', 'Spiel nicht gestartet')}
                            {props.fromRoute === 'RoundsMatchesSupervisor' ? (
                                <Pressable
                                    style={[styles.button1, styles.buttonConfirm, styles.buttonOrange]}
                                    onPress={() => setSupervisorActionsModalVisible(true)}>
                                    <Text numberOfLines={1} style={styles.textButton1}>
                                        Supervisor Aktionen
                                    </Text>
                                </Pressable>
                            ) : null}
                            {showOffsets()}
                        </View>
                    ) : null}

                    {!props.item.logsCalc.isResultConfirmed && props.item.canceled ? (
                        <View style={{alignSelf: 'center', flex: 6}}>
                            <Text
                                numberOfLines={1}
                                style={[styles.textRed, {fontSize: 16}]}>
                                abgesagt
                            </Text>
                        </View>
                    ) : null}

                    {props.item.logsCalc.isMatchStarted &&
                    !props.item.logsCalc.isResultConfirmed ? (
                        <View style={[styles.viewCentered, {alignSelf: 'center', flex: 3}]}>
                            <Text
                                adjustsFontSizeToFit
                                numberOfLines={1}
                                style={[styles.big1, styles.textRed]}>
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
                            {getCardsAndRemarks()}
                        </View>
                    ) : null}
                    {props.item.logsCalc.isMatchStarted &&
                    !props.item.logsCalc.isResultConfirmed ? (
                        <View style={{alignSelf: 'center', flex: 3}}>
                            {props.item.logsCalc.isMatchLive ? (
                                <View>
                                    <Text style={styles.textRed}>Live!</Text>
                                    {showOffsets()}
                                    {getEventView('isLoggedIn', 'SR eingeloggt', 'SR nicht eingeloggt')}
                                    {props.fromRoute === 'RoundsMatchesSupervisor' ? (
                                        <Pressable
                                            style={[styles.button1, styles.buttonConfirm, styles.buttonOrange]}
                                            onPress={() => setSupervisorActionsModalVisible(true)}>
                                            <Text numberOfLines={1} style={styles.textButton1}>
                                                Supervisor Aktionen
                                            </Text>
                                        </Pressable>
                                    ) : null}
                                </View>
                            ) : null}
                            {props.item.logsCalc.isMatchEnded ? (
                                <Text
                                    numberOfLines={1}
                                    style={styles.textGreen}>
                                    beendet
                                </Text>
                            ) : null}
                            {props.item.logsCalc.teamWon !== undefined ? (
                                <Text
                                    numberOfLines={1}
                                    style={styles.textGreen}>
                                    Tendenz: {props.item.logsCalc.teamWon}
                                </Text>
                            ) : null}
                            {props.item.logsCalc.isMatchConcluded ? (
                                <Text
                                    numberOfLines={1}
                                    style={styles.textGreen}>
                                    abgeschlossen
                                </Text>
                            ) : null}
                            {props.item.logsCalc.isMatchEnded &&
                            !props.item.logsCalc.isResultConfirmed ? (
                                <Text numberOfLines={1} style={styles.textRed}>
                                    noch nicht bestätigt
                                </Text>
                            ) : null}
                        </View>
                    ) : null}

                    {props.item.logsCalc.isResultConfirmed ? (
                        <View style={[styles.viewCentered, {alignSelf: 'center', flex: 3}]}>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={styles.big1}>
                                {parseInt(props.item.resultGoals1) || 0}
                                {' '}:{' '}
                                {parseInt(props.item.resultGoals2) || 0}
                            </Text>
                            {getCardsAndRemarks()}
                        </View>
                    ) : null}
                    {props.item.logsCalc.isResultConfirmed ? (
                        <View style={{alignSelf: 'center', flex: 3}}>
                            <Text numberOfLines={1}>
                                bestätigt
                            </Text>
                            <Text numberOfLines={1}>
                                {props.item.logsCalc.score !== undefined
                                    ? parseInt(props.item.logsCalc.score[props.item.team1_id]) ||
                                    0
                                    : 0}
                                :
                                {props.item.logsCalc.score !== undefined
                                    ? parseInt(props.item.logsCalc.score[props.item.team2_id]) ||
                                    0
                                    : 0}{' '}
                                im MatchLog
                            </Text>
                            {props.item.resultTrend > 2 ? (
                                <Text numberOfLines={1} style={styles.textRed}>
                                    {ConfirmFunctions.getConfirmResultText(
                                        props.item.resultTrend,
                                    )}
                                    -Wertung
                                </Text>
                            ) : null}
                            <Text numberOfLines={1}>
                                Faktor {props.item.sport.goalFactor}
                            </Text>
                        </View>
                    ) : null}

                    {props.fromRoute === 'RoundsMatchesAdmin' &&
                    props.item.isTime2confirm ? (
                        <View style={[styles.viewCentered, {alignSelf: 'center', flex: 2}]}>
                            {props.item.isResultOk
                                ? ConfirmFunctions.getConfirmButton(
                                    props.item.id,
                                    0,
                                    'regulär werten',
                                    setSpecialConfirmModalVisible,
                                    props.loadScreenData
                                )
                                : null}
                            {!props.item.isResultOk && props.item.logsCalc.score !== undefined
                                ? ConfirmFunctions.getConfirmButton(
                                    props.item.id,
                                    1,
                                    ConfirmFunctions.getConfirmResultText(1),
                                    setSpecialConfirmModalVisible,
                                    props.loadScreenData
                                )
                                : null}
                            {!props.item.isResultOk && props.item.logsCalc.teamWon !== undefined
                                ? ConfirmFunctions.getConfirmButton(
                                    props.item.id,
                                    2,
                                    ConfirmFunctions.getConfirmResultText(2),
                                    setSpecialConfirmModalVisible,
                                    props.loadScreenData
                                )
                                : null}

                            {props.item.canceled === 0 ? getSpecialConfirmModalButton() : null}
                            {props.item.canceled === 0 ? getInsertResultModalButton() : null}
                            {props.item.canceled > 0
                                ? ConfirmFunctions.getConfirmButton(
                                    props.item.id,
                                    ConfirmFunctions.getConfirmModeFromCanceled(props.item.canceled),
                                    ConfirmFunctions.getConfirmResultText(ConfirmFunctions.getConfirmModeFromCanceled(props.item.canceled)),
                                    setSpecialConfirmModalVisible,
                                    props.loadScreenData
                                )
                                : null}
                            {props.item.canceled === 3
                                ? ConfirmFunctions.getConfirmButton(
                                    props.item.id,
                                    6,
                                    ConfirmFunctions.getConfirmResultText(6),
                                    setSpecialConfirmModalVisible,
                                    props.loadScreenData
                                )
                                : null}
                        </View>
                    ) : null}

                    {props.fromRoute === 'RoundsMatchesAdmin' &&
                    props.item.isTime2confirm ? (
                        <SpecialConfirmModal
                            setModalVisible={setSpecialConfirmModalVisible}
                            modalVisible={specialConfirmModalVisible}
                            match={props.item}
                            loadScreenData={props.loadScreenData}
                        />
                    ) : null}
                    {props.fromRoute === 'RoundsMatchesAdmin' &&
                    props.item.isTime2confirm ? (
                        <InsertResultModal
                            setModalVisible={setInsertResultModalVisible}
                            modalVisible={insertResultModalVisible}
                            match={props.item}
                            loadScreenData={props.loadScreenData}
                        />
                    ) : null}
                    {props.fromRoute === 'RoundsMatchesSupervisor' ? (
                        <SupervisorActionsModal
                            setModalVisible={setSupervisorActionsModalVisible}
                            modalVisible={supervisorActionsModalVisible}
                            match={props.item}
                            loadScreenData={props.loadScreenData}
                        />
                    ) : null}
                    {props.fromRoute === 'RoundsMatchesAdmin' ?
                        <RemarksModal
                            setModalVisible={setRemarksModalVisible}
                            modalVisible={remarksModalVisible}
                            match={props.item}
                        />
                        : null}
                    {props.fromRoute === 'RoundsMatchesAdmin' ?
                        <CardsModal
                            setModalVisible={setCardsModalVisible}
                            modalVisible={cardsModalVisible}
                            match={props.item}
                        />
                        : null}
                </View>
            }
        />
    );
}

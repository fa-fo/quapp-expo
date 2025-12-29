import TextC from "../components/customText";
import {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import {Cell} from 'react-native-tableview-simple';
import {style} from '../assets/styles';
import SpecialConfirmModal from './modals/SpecialConfirmModal';
import InsertResultModal from './modals/InsertResultModal';
import SupervisorActionsModal from './modals/SupervisorActionsModal';
import RemarksModal from './modals/RemarksModal';
import CardsModal from './modals/CardsModal';
import * as ConfirmFunctions from './functions/ConfirmFunctions';
import * as SportFunctions from "./functions/SportFunctions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {getAdminInsertResultFields} from "./getAdminInsertResultFields";
import {getAdminInsertRefereeNameField} from "./getAdminInsertRefereeNameField";

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
                ? style().buttonGreyDark
                : style().buttonRed;
        } else {
            return style().buttonGreen;
        }
    };

    let getStatus = function (status) {
        return props.item.logsCalc[status];
    };

    let getEventView = function (status, nameTrue, nameFalse) {
        return (
            <View style={[style().viewStatus, getButtonStyle(status)]}>
                <TextC numberOfLines={1} style={style().textButton1}>
                    {getStatus(status) ? nameTrue : nameFalse}
                </TextC>
            </View>
        );
    };

    function getSpecialConfirmModalButton() {
        return (
            <Pressable
                style={[style().button1, style().buttonConfirm, style().buttonGreyDark]}
                onPress={() => setSpecialConfirmModalVisible(true)}>
                <TextC numberOfLines={1} style={style().textButton1}>
                    Sonderwertung
                </TextC>
            </Pressable>
        );
    }

    function getInsertResultModalButton() {
        return (
            <Pressable
                style={[style().button1, style().buttonConfirm, style().buttonGreyDark]}
                onPress={() => setInsertResultModalVisible(true)}>
                <TextC numberOfLines={1} style={style().textButton1}>
                    Ergebniseingabe
                </TextC>
            </Pressable>
        );
    }

    function showOffsets() {
        return (
            props.fromRoute.includes('Admin') && props.item.logsCalc.avgOffset !== undefined ?
                <TextC style={style().textRed}>{'Offset: '
                    + props.item.logsCalc.minOffset + '-'
                    + props.item.logsCalc.avgOffset + '-'
                    + props.item.logsCalc.maxOffset}
                </TextC>
                : null)
    }

    function showCardsButton() {
        const array = Object.keys(props.item.logsCalc);
        const fouls = array.filter(s => s.includes('FOUL_'));
        return fouls.length;
    }

    function getCardsAndRemarks() {
        return (
            props.fromRoute.includes('Admin') ?
                <TextC adjustsFontSizeToFit numberOfLines={1}>
                    {props.item.remarks ?
                        <Pressable
                            style={[style().button1, style().buttonConfirm, style().buttonRed]}
                            onPress={() => setRemarksModalVisible(true)}>
                            <TextC style={style().textButton1}><Icon name="exclamation-thick"
                                                                     size={20}/></TextC>
                        </Pressable>
                        : null}
                    {showCardsButton() ?
                        <Pressable
                            style={[style().button1, style().buttonConfirm, style().buttonOrange]}
                            onPress={() => setCardsModalVisible(true)}>
                            <TextC style={style().textButton1}><Icon name="cards"
                                                                     size={20}/></TextC>
                        </Pressable>
                        : null}
                </TextC>
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
                        <TextC numberOfLines={1}>
                            {props.timeText}{' '}
                            {SportFunctions.getSportImage(props.item.sport.code)}
                            <TextC style={{color: '#8E8E93'}}>{props.item.sport.code}</TextC>
                        </TextC>
                        {global.settings.useLiveScouting ?
                            <View>
                                <TextC
                                    numberOfLines={1}
                                    style={
                                        props.item.canceled === 1 || props.item.canceled === 3
                                            ? style().textRed
                                            : null
                                    }>
                                    {props.item.teams1?.name ?? ''}
                                </TextC>
                                <TextC
                                    numberOfLines={1}
                                    style={
                                        props.item.canceled === 2 || props.item.canceled === 3
                                            ? style().textRed
                                            : null
                                    }>
                                    {props.item.teams2?.name ?? ''}
                                </TextC>
                            </View> : null}

                        {props.item.isPlayOff ?
                            <TextC adjustsFontSizeToFit numberOfLines={1} style={style().big22}>
                                {props.item.playOffName ?? ''}
                            </TextC> : null}
                        {props.item.teams3 && global.settings.useLiveScouting ?
                            <TextC numberOfLines={1} style={props.item.isRefereeCanceled ? style().textRed : ''}>
                                <TextC style={style().textViolet}>SR</TextC> {props.item.teams3.name}
                            </TextC> : null}
                        {props.item.teams4 ?
                            <TextC numberOfLines={1} style={style().textGreen}>
                                <TextC style={style().textViolet}>Ersatz-SR</TextC> {props.item.teams4.name}
                            </TextC> : null}
                        {!global.settings.useLiveScouting ? getAdminInsertRefereeNameField(props.item) : null}
                    </View>

                    {global.settings.useLiveScouting ?
                        <View style={{flex: 6, alignSelf: 'flex-start', flexDirection: 'row'}}>
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
                                    {props.fromRoute.includes('Supervisor') ? (
                                        <Pressable
                                            style={[style().button1, style().buttonConfirm, style().buttonOrange]}
                                            onPress={() => setSupervisorActionsModalVisible(true)}>
                                            <TextC numberOfLines={1} style={style().textButton1}>
                                                Supervisor Aktionen
                                            </TextC>
                                        </Pressable>
                                    ) : null}
                                    {showOffsets()}
                                </View>
                            ) : null}

                            {!props.item.logsCalc.isResultConfirmed && props.item.canceled ? (
                                <View style={{alignSelf: 'center', flex: 6}}>
                                    <TextC
                                        numberOfLines={1}
                                        style={[style().textRed, {fontSize: 16}]}>
                                        abgesagt
                                    </TextC>
                                </View>
                            ) : null}

                            {props.item.logsCalc.isMatchStarted &&
                            !props.item.logsCalc.isResultConfirmed ? (
                                <View style={[style().viewCentered, {alignSelf: 'center', flex: 3}]}>
                                    <TextC
                                        adjustsFontSizeToFit
                                        numberOfLines={1}
                                        style={[style().big1, style().textRed]}>
                                        {parseInt(props.item.logsCalc.score?.[props.item.team1_id] ?? 0) || 0}
                                        {' '}:{' '}
                                        {parseInt(props.item.logsCalc.score?.[props.item.team2_id] ?? 0) || 0}
                                    </TextC>
                                    {getCardsAndRemarks()}
                                </View>
                            ) : null}
                            {props.item.logsCalc.isMatchStarted &&
                            !props.item.logsCalc.isResultConfirmed ? (
                                <View style={{alignSelf: 'center', flex: 3}}>
                                    {props.item.logsCalc.isMatchLive ? (
                                        <View>
                                            <TextC style={style().textRed}>Live!</TextC>
                                            {showOffsets()}
                                            {getEventView('isLoggedIn', 'SR eingeloggt', 'SR nicht eingeloggt')}
                                            {props.fromRoute.includes('Supervisor') ? (
                                                <Pressable
                                                    style={[style().button1, style().buttonConfirm, style().buttonOrange]}
                                                    onPress={() => setSupervisorActionsModalVisible(true)}>
                                                    <TextC numberOfLines={1} style={style().textButton1}>
                                                        Supervisor Aktionen
                                                    </TextC>
                                                </Pressable>
                                            ) : null}
                                        </View>
                                    ) : null}
                                    {props.item.logsCalc.isMatchEnded ? (
                                        <TextC
                                            numberOfLines={1}
                                            style={style().textGreen}>
                                            beendet
                                        </TextC>
                                    ) : null}
                                    {props.item.logsCalc.teamWon !== undefined ? (
                                        <TextC
                                            numberOfLines={1}
                                            style={style().textGreen}>
                                            Tendenz: {props.item.logsCalc.teamWon}
                                        </TextC>
                                    ) : null}
                                    {props.item.logsCalc.isMatchConcluded ? (
                                        <TextC
                                            numberOfLines={1}
                                            style={style().textGreen}>
                                            abgeschlossen
                                        </TextC>
                                    ) : null}
                                    {props.item.logsCalc.isMatchEnded &&
                                    !props.item.logsCalc.isResultConfirmed ? (
                                        <TextC numberOfLines={1} style={style().textRed}>
                                            noch nicht bestätigt
                                        </TextC>
                                    ) : null}
                                </View>
                            ) : null}

                            {props.item.logsCalc.isResultConfirmed ? (
                                <View style={[style().viewCentered, {alignSelf: 'center', flex: 3}]}>
                                    <TextC adjustsFontSizeToFit numberOfLines={1} style={style().big1}>
                                        {parseInt(props.item.resultGoals1) || 0}
                                        {' '}:{' '}
                                        {parseInt(props.item.resultGoals2) || 0}
                                    </TextC>
                                    {getCardsAndRemarks()}
                                </View>
                            ) : null}
                            {props.item.logsCalc.isResultConfirmed ? (
                                <View style={{alignSelf: 'center', flex: 3}}>
                                    {props.item.resultAdmin === 1 ?
                                        <TextC numberOfLines={1} style={style().textRed}>
                                            <TextC> {'\u2714'} </TextC>
                                            Ergebnis durch Admins korrigiert
                                        </TextC> : null}
                                    {props.item.resultAdmin === 2 ?
                                        <TextC numberOfLines={1} style={style().textRed}>
                                            <TextC> {'\u2714'} </TextC>
                                            Ergebnisübertrag aus Papierbogen
                                        </TextC> : null}
                                    <TextC numberOfLines={1} style={style().textGreen}>
                                        <TextC> {'\u2714'} </TextC>bestätigt
                                    </TextC>
                                    <TextC numberOfLines={1}>
                                        {parseInt(props.item.logsCalc.score?.[props.item.team1_id] ?? 0) || 0}
                                        :
                                        {parseInt(props.item.logsCalc.score?.[props.item.team2_id] ?? 0) || 0}{' '}
                                        im MatchLog
                                    </TextC>
                                    {props.item.resultTrend > 2 ? (
                                        <TextC numberOfLines={1} style={style().textRed}>
                                            {ConfirmFunctions.getConfirmResultText(
                                                props.item.resultTrend,
                                            )}
                                            -Wertung
                                        </TextC>
                                    ) : null}
                                    <TextC numberOfLines={1}>
                                        Faktor {props.item.sport.goalFactor}
                                    </TextC>
                                </View>
                            ) : null}

                            {props.fromRoute.includes('Admin') &&
                            props.item.isTime2confirm ? (
                                <View style={[style().viewCentered, {alignSelf: 'center', flex: 2}]}>
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
                        </View> : null}

                    {!global.settings.useLiveScouting ?
                        <View style={[style().matchflexRowView, {flex: 5}]}>
                            {getAdminInsertResultFields(props.item, props.loadScreenData, props.playOffTeams)}
                            <View style={{flex: 1}}>
                                {props.item.isTime2confirm ? getSpecialConfirmModalButton() : null}
                                {props.item.resultTrend > 2 ?
                                    <TextC numberOfLines={1} style={style().textRed}>
                                        {ConfirmFunctions.getConfirmResultText(
                                            props.item.resultTrend,
                                        )}
                                        -Wertung
                                    </TextC> : null}
                            </View>
                        </View> : null}

                    {props.fromRoute.includes('Admin') &&
                    props.item.isTime2confirm ? (
                        <SpecialConfirmModal
                            setModalVisible={setSpecialConfirmModalVisible}
                            modalVisible={specialConfirmModalVisible}
                            match={props.item}
                            loadScreenData={props.loadScreenData}
                        />
                    ) : null}
                    {props.fromRoute.includes('Admin') &&
                    props.item.isTime2confirm ? (
                        <InsertResultModal
                            setModalVisible={setInsertResultModalVisible}
                            modalVisible={insertResultModalVisible}
                            match={props.item}
                            loadScreenData={props.loadScreenData}
                        />
                    ) : null}
                    {props.fromRoute.includes('Supervisor') ? (
                        <SupervisorActionsModal
                            setModalVisible={setSupervisorActionsModalVisible}
                            modalVisible={supervisorActionsModalVisible}
                            match={props.item}
                            loadScreenData={props.loadScreenData}
                        />
                    ) : null}
                    {props.fromRoute.includes('Admin') ?
                        <RemarksModal
                            setModalVisible={setRemarksModalVisible}
                            modalVisible={remarksModalVisible}
                            match={props.item}
                        />
                        : null}
                    {props.fromRoute.includes('Admin') ?
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

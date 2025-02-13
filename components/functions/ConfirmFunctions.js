import TextC from "../../components/customText";
import {ActivityIndicator, Pressable, TextInput, View} from 'react-native';
import {style} from '../../assets/styles.js';
import fetchApi from '../fetchApi';
import {useEffect, useState} from "react";
import * as SportFunctions from "./SportFunctions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {isNumber} from "./CheckFunctions";
import {Picker} from "@react-native-picker/picker";

export function getMatches2Confirm(object) {
    let matches = [];

    if (object?.groups?.length) {
        object.groups.map(group => {
            if (group?.matches?.length) {
                group.matches.map(item => {
                    if (!item.logsCalc?.isResultConfirmed && item.isTime2confirm) {
                        if (item.isResultOk || item.canceled > 0) {
                            let a = {
                                'id': item.id,
                                'mode': item.isResultOk ? 0 : getConfirmModeFromCanceled(item.canceled),
                            };
                            matches = [a, ...matches];
                        }
                    }
                })
            }
        })
    }

    return matches;
}

export const confirmResults = (matches, setModalVisible, loadScreenData, postData, setSaved) => {
    postData = {'password': global.adminPW, ...postData};
    postData = {'matches': JSON.stringify(matches), ...postData};

    return fetchApi('matches/confirmMulti', 'POST', postData)
        .then(data => {
            if (data?.status === 'success') {
                if (loadScreenData)
                    loadScreenData(data.object.round_id);
                if (setModalVisible)
                    setModalVisible(false);
                if (setSaved)
                    setSaved(true);

                return data.object[1] ?? null;
            }
        })
};

export function getConfirmButton(matchId, mode, text, setModalVisible, loadScreenData) {

    return (
        <Pressable
            style={[
                style().button1,
                style().buttonConfirm,
                mode === 0
                    ? style().buttonGreen
                    : (mode === 1) || (mode === 2)
                    ? style().buttonGreyDark
                    : style().buttonRed,
            ]}
            onPress={() => confirmResults([{'id': matchId, 'mode': mode}], setModalVisible, loadScreenData, null)}>
            <TextC numberOfLines={1} style={style().textButton1}>
                {text}
            </TextC>
        </Pressable>
    );
}

export function getConfirmResultText(mode) {
    return mode === 1
        ? 'wie Score werten'
        : mode === 2
            ? 'wie Trend werten'
            : mode === 3
                ? 'X:0'
                : mode === 4
                    ? '0:X'
                    : mode === 5
                        ? 'X:X'
                        : mode === 6
                            ? '0:0'
                            : '';
}

export function getConfirmModeFromCanceled(canceled) {
    return canceled === 1
        ? 4
        : canceled === 2
            ? 3
            : canceled === 3
                ? 5
                : 0;
}

export function getInsertRefereeNameField(match) {
    const [oldRefName, setOldRefName] = useState(match.refereeName ?? '');
    const [refName, setRefName] = useState(oldRefName);
    const [isTryingSave, setIsTryingSave] = useState(false);
    const [saved, setSaved] = useState(false);

    const submit = () => {
        if (refName !== oldRefName) {
            setIsTryingSave(true);
            let postData = {'refereeName': refName};

            SportFunctions.saveRefereeName(match, postData, setSaved)
                .finally(() => {
                    setOldRefName(refName);
                    setIsTryingSave(false)
                });
        }
    }

    return (
        match.isTime2confirm ?
            (match.refereeName ?
                <TextC numberOfLines={1} style={style().textGreen}>
                    <TextC style={style().textViolet}>SR: </TextC> {match.refereeName}
                </TextC> : null)
            :
            <TextC>SR:{' '}
                <View>
                    <TextInput style={[style().textInput, {borderColor: refName !== '' ? 'green' : 'red'}]}
                               disabled={isTryingSave}
                               onChangeText={setRefName}
                               onFocus={() => setSaved(false)}
                               onBlur={submit}
                               keyboardType="default"
                               maxLength={32}
                               value={refName ?? ''}
                    />
                    {saved ?
                        <Icon name="checkbox-marked-circle" size={24}
                              style={{position: 'absolute', right: 2, top: 2, color: 'green'}}/>
                        : null}
                    {isTryingSave ?
                        <ActivityIndicator size={24} color="green"
                                           style={{
                                               position: 'absolute',
                                               right: 2,
                                               top: 2,
                                               color: 'green'
                                           }}/> : null}
                </View>
            </TextC>
    );
}

export function getInsertResultFields(match0, loadScreenData, playOffTeams) {
    const [match, setMatch] = useState(match0);
    const [selectedTeam1, setSelectedTeam1] = useState(match0.team1_id);
    const [selectedTeam2, setSelectedTeam2] = useState(match0.team2_id);
    const [oldGoals1, setOldGoals1] = useState('');
    const [oldGoals2, setOldGoals2] = useState('');
    const [goals1, setGoals1] = useState('');
    const [goals2, setGoals2] = useState('');
    const [okGoals1, setOkGoals1] = useState(false);
    const [okGoals2, setOkGoals2] = useState(false);
    const [oldResultAdmin, setOldResultAdmin] = useState('');
    const [selectedResultAdmin, setSelectedResultAdmin] = useState('');
    const [isTryingSave, setIsTryingSave] = useState(false);
    const [saved, setSaved] = useState(false);
    const [teamsSaved, setTeamsSaved] = useState(false);

    function getGoalsFromResultGoals(resultGoals) {
        return resultGoals !== null ? Number(resultGoals / match.sport.goalFactor) : '';
    }

    function getResultAdminFromMatch(m) {
        return m.resultAdmin === 0 ? global.settings.useLiveScouting : m.resultAdmin;
    }

    useEffect(() => {
        let g1 = getGoalsFromResultGoals(match.resultGoals1);
        let g2 = getGoalsFromResultGoals(match.resultGoals2);
        setOldGoals1(g1);
        setOldGoals2(g2);
        setGoals1(g1);
        setGoals2(g2);
        setOkGoals1(g1 !== '');
        setOkGoals2(g2 !== '');

        let rA = getResultAdminFromMatch(match);
        setOldResultAdmin(rA);
        setSelectedResultAdmin(rA);
    }, [match]);

    useEffect(() => {
        if (!global.settings.useLiveScouting) // For modal view, do not reload from match0!
            setMatch(match0);
    }, [match0]);

    useEffect(() => {
        if (selectedTeam1 && selectedTeam2 && selectedTeam1 !== match.team1_id || selectedTeam2 !== match.team2_id) {
            setIsTryingSave(true);
            let postData = {'team1_id': selectedTeam1, 'team2_id': selectedTeam2};

            SportFunctions.saveMatchTeamIds(match, postData, setTeamsSaved)
                .finally(() => setIsTryingSave(false))
        }
    }, [selectedTeam1, selectedTeam2]);

    useEffect(() => {
        submit();
    }, [selectedResultAdmin]);

    const submit = () => {
        let submitGoals1 = isNumber(goals1.toString()) ? parseInt(goals1.toString()) : '';
        let submitGoals2 = isNumber(goals2.toString()) ? parseInt(goals2.toString()) : '';

        setOkGoals1(submitGoals1 !== '');
        setOkGoals2(submitGoals2 !== '');

        if (submitGoals1 !== '' && submitGoals2 !== '' && (submitGoals1 !== oldGoals1 || submitGoals2 !== oldGoals2 || selectedResultAdmin !== oldResultAdmin)) {
            setIsTryingSave(true);

            let postData = {
                'goals1': submitGoals1,
                'goals2': submitGoals2,
                'resultAdmin': selectedResultAdmin
            };

            confirmResults([{'id': match.id, 'mode': 1}], null, loadScreenData, postData, setSaved)
                .then(m => setMatch(m))
                .finally(() => setIsTryingSave(false))
        }
    }

    const getPlayOffTeamSelect = (team) => {
        return (
            <View>
                <Picker
                    disabled={isTryingSave}
                    selectedValue={(team === 1 ? selectedTeam1 : selectedTeam2) ?? ''}
                    onValueChange={(itemValue) => team === 1 ? setSelectedTeam1(itemValue) : setSelectedTeam2(itemValue)}
                    style={[style().button1, style().pickerSelect, {width: '90%', paddingHorizontal: '5%', borderColor: (team === 1 ? selectedTeam1 : selectedTeam2) ? 'green' : 'red'}]}
                >
                    <Picker.Item key="0" value="0" label="Bitte auswählen..." style={{fontcolor: 'red'}}/>
                    {playOffTeams ? playOffTeams.map(item => (
                        <Picker.Item key={item.id} value={item.team_id}
                                     label={(item.calcRanking ?? 0) + '. ' + item.team.name}/>
                    )) : null}
                </Picker>
                {teamsSaved ?
                    <Icon name="checkbox-marked-circle" size={24}
                          style={{position: 'absolute', right: 2, top: 2, color: 'green'}}/>
                    : null}
            </View>
        );
    }

    return (
        <View style={{flex: 5}}>
            <View style={[style().matchflexRowView, {flex: 1, alignItems: 'center'}]}>
                <View style={{flex: 2}}>
                    <TextC
                        numberOfLines={1}
                        style={[{textAlign: 'right'},
                            (match.canceled === 1 || match.canceled === 3
                                ? style().textRed
                                : null)
                        ]}>
                        {match.isPlayOff > 0 ? getPlayOffTeamSelect(1)
                            : (match.teams1?.name ?? '')
                        }
                    </TextC>
                    {match.isTime2confirm ?
                        <TextInput
                            style={[style().textInput, {textAlign: 'right', borderColor: okGoals1 ? 'green' : 'red'}]}
                            disabled={isTryingSave}
                            onChangeText={setGoals1}
                            onFocus={() => setSaved(false)}
                            onBlur={submit}
                            keyboardType="numeric"
                            maxLength={3}
                            value={goals1?.toString() ?? ''}
                        /> : <TextC style={{
                            fontSize: 16,
                            textAlign: 'right'
                        }}>{match.resultGoals1 !== null ? match.resultGoals1 / match.sport.goalFactor : ''}</TextC>}
                </View>
                <View style={{flex: 1.5, paddingHorizontal: 8}}>
                    <TextC style={{fontSize: 10, textAlign: 'center'}}>{'\n\nFaktor ' + match.sport.goalFactor}</TextC>
                    <View style={[style().matchflexRowView, {flex: 1, alignItems: 'center'}]}>
                        <TextC style={{flex: 2, fontSize: 24, textAlign: 'right'}}>{match.resultGoals1}</TextC>
                        <TextC style={{flex: 1, fontSize: 24, textAlign: 'center'}}>{':'}</TextC>
                        <TextC style={{flex: 2, fontSize: 24, textAlign: 'left'}}>{match.resultGoals2}</TextC>
                    </View>
                </View>
                <View style={{flex: 2}}>
                    <TextC
                        numberOfLines={1}
                        style={
                            match.canceled === 2 || match.canceled === 3
                                ? style().textRed
                                : null
                        }>
                        {match.isPlayOff > 0 ? getPlayOffTeamSelect(2)
                            : (match.teams2?.name ?? '')
                        }
                    </TextC>
                    {match.isTime2confirm ?
                        <View>
                            <TextInput style={[style().textInput, {borderColor: okGoals2 ? 'green' : 'red'}]}
                                       disabled={isTryingSave}
                                       onChangeText={setGoals2}
                                       onFocus={() => setSaved(false)}
                                       onBlur={submit}
                                       keyboardType="numeric"
                                       maxLength={3}
                                       value={goals2?.toString() ?? ''}
                            />
                            {saved ?
                                <Icon name="checkbox-marked-circle" size={24}
                                      style={{position: 'absolute', right: 2, top: 2, color: 'green'}}/>
                                : null}
                            {isTryingSave ?
                                <ActivityIndicator size={24} color="green"
                                                   style={{
                                                       position: 'absolute',
                                                       right: 2,
                                                       top: 2,
                                                       color: 'green'
                                                   }}/> : null}
                        </View>
                        : <TextC
                            style={{fontSize: 16}}>{match.resultGoals2 !== null ? match.resultGoals2 / match.sport.goalFactor : ''}</TextC>}
                </View>
            </View>
            {global.settings.useLiveScouting ?
                <View>
                    <TextC>{'\n'}</TextC>
                    <TextC>Ergebniseingabe/-korrektur: [gespeichert: ({match.resultAdmin})]</TextC>
                    <Picker
                        disabled={isTryingSave}
                        selectedValue={selectedResultAdmin}
                        onValueChange={(v) => setSelectedResultAdmin(v)}
                        style={[style().button1, style().pickerSelect]}
                    >
                        <Picker.Item label="(0) nein" value="0"/>
                        <Picker.Item label="(1) korrigiert durch Admin" value="1"/>
                        <Picker.Item label="(2) Übertrag von Papierbogen" value="2"/>
                    </Picker>
                </View> : null}
        </View>
    );
}

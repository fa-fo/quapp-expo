import TextC from "../components/customText";
import {ActivityIndicator, TextInput, View} from 'react-native';
import {style} from '../assets/styles';
import {Picker} from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {confirmResults} from "./functions/ConfirmFunctions";
import {useEffect, useState} from "react";
import * as SportFunctions from "./functions/SportFunctions";
import {isNumber} from "./functions/CheckFunctions";

export function getAdminInsertResultFields(match0, loadScreenData, playOffTeams) {
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
        if (match) {
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
        }
    }, [match]);

    useEffect(() => {
        if (!global.settings.useLiveScouting) // For modal view, do not reload from match0!
            setMatch(match0);
    }, [match0]);

    useEffect(() => {
        setTeamsSaved(false);

        if (selectedTeam1 > 0 && selectedTeam2 > 0
            && parseInt(selectedTeam1) !== parseInt(selectedTeam2)
            && (selectedTeam1 !== match.team1_id || selectedTeam2 !== match.team2_id)) {
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
                    style={[style().button1, style().pickerSelect, {
                        width: '90%',
                        paddingHorizontal: '5%',
                        borderColor: (team === 1 ? selectedTeam1 : selectedTeam2) ? 'green' : 'red'
                    }]}
                >
                    <Picker.Item key="0" value="0" label="Bitte auswählen..." style={{fontcolor: 'red'}}/>
                    {playOffTeams?.all ? playOffTeams.all.map(item => (
                        (match.isPlayOff % 10 === 2 && playOffTeams.winners?.includes(item.team_id))
                        || (match.isPlayOff % 10 === 3 && playOffTeams.losers?.includes(item.team_id))
                        || match.isPlayOff % 10 === 4 ?
                            <Picker.Item key={item.team_id} value={item.team_id}
                                         label={(item.calcRanking ?? 0) + '. ' + item.team.name}/> : null
                    )) : null}
                </Picker>
                {teamsSaved ?
                    <Icon name="checkbox-marked-circle" size={24}
                          style={{position: 'absolute', right: 2, top: 2, color: 'green'}}/>
                    : null}
            </View>
        );
    }

    return (match ?
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
                            {match.isPlayOff > 0 && match.resultTrend === null ? getPlayOffTeamSelect(1)
                                : (match.teams1?.name ?? '')
                            }
                        </TextC>
                        {match.isTime2confirm && match.team1_id ?
                            <TextInput
                                style={[style().textInput, {
                                    textAlign: 'right',
                                    borderColor: okGoals1 ? 'green' : 'red'
                                }]}
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
                        <TextC
                            style={{fontSize: 10, textAlign: 'center'}}>{'\n\nFaktor ' + match.sport.goalFactor}</TextC>
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
                            {match.isPlayOff > 0 && match.resultTrend === null ? getPlayOffTeamSelect(2)
                                : (match.teams2?.name ?? '')
                            }
                        </TextC>
                        {match.isTime2confirm && match.team2_id ?
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
            </View> : null
    );
}

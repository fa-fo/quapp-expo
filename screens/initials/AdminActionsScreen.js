import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, TextInput, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import fetchApi from '../../components/fetchApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as DateFunctions from "../../components/functions/DateFunctions";
import * as SportFunctions from "../../components/functions/SportFunctions";
import * as ColorFunctions from "../../components/functions/ColorFunctions";
import SettingsModal from "./modals/SettingsModal";
import ChangePWModal from "./modals/ChangePWModal";
import ClearLogsModal from "./modals/ClearLogsModal";
import NewYearModal from "./modals/NewYearModal";
import {format} from "date-fns";
import {style} from "../../assets/styles";

export default function AdminActionsScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selectedValue1, setSelectedValue1] = useState('standard');
    const [selectedValue2, setSelectedValue2] = useState('standard');
    const [teamNames, setTeamNames] = useState('');
    const [teamNamesSplit, setTeamNamesSplit] = useState([]);
    const [clearLogsModalVisible, setClearLogsModalVisible] = useState(false);
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);
    const [newYearModalVisible, setNewYearModalVisible] = useState(false);
    const [changePWModalVisible, setChangePWModalVisible] = useState(false);

    useEffect(() => {
        return navigation.addListener('focus', () => {
            setLoading(true);
            loadScreenData();
        });
    }, []);

    const loadScreenData = (mergeJson) => {
        fetchApi('years/getStatus')
            .then((json) => setData({...json, ...mergeJson}))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const adminAction = (url, parameter) => {
        let postData = {
            'password': global.adminPW,
        };

        fetchApi(url + '/' + parameter, 'POST', postData)
            .then((json) => json.object ? loadScreenData(json.object) : {})
            .catch((error) => console.error(error));
    };

    const downloadPdf = (url) => {
        let postData = {
            'password': global.adminPW,
        };

        fetchApi(url, 'POST', postData, 'pdf')
            .then(response => response.blob())
            .then(blob => {
                const fileURL = URL.createObjectURL(blob);
                window.open(fileURL);
            })
            .catch((error) => console.error(error));
    };

    const insertTestTeamNames = () => {
        fetchApi('teams/getTestTeamNames')
            .then((json) => setTeamNames(json.object.teamNames.split('\\n').join('\n')))
            .catch((error) => console.error(error));
    };

    const checkTeamNames = () => {
        let postData = {'teamNames': teamNames};

        fetchApi('teams/checkTeamNames/', 'POST', postData)
            .then((json) => setTeamNamesSplit(json.object))
            .catch((error) => console.error(error));
    };

    const addTeamName = (name, i) => {
        let postData = {'password': global.adminPW, 'name': name};

        fetchApi('teams/add/', 'POST', postData)
            .then((json) => {
                if (json.object.team_id > 0) {
                    let a = teamNamesSplit.slice();
                    a[i]['team_id'] = parseInt(json.object.team_id);
                    setTeamNamesSplit(a);
                }
            })
            .catch((error) => console.error(error));
    };

    const countTeamsFound = () => {
        let count = 0;
        teamNamesSplit.map(team =>
            count += (team.team_id > 0 ? 1 : 0)
        )
        return count;
    };

    const insertTeamYears = () => {
        let postData = {'password': global.adminPW, 'teamNamesSplit': JSON.stringify(teamNamesSplit)};

        fetchApi('teamYears/insert/', 'POST', postData)
            .then(() => loadScreenData())
            .catch((error) => console.error(error));
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            {global.settings.isTest ?
                <TextC style={[style().textInputLarge, style().testMode]}>Test-Modus!</TextC> : null}
            {isLoading ? null :
                (data?.status === 'success' ? (
                    <View style={style().matchflexEventsView}>
                        <View style={{position: 'absolute', left: 0, top: 10}}>
                            <Pressable
                                style={[style().button1, style().buttonConfirm, style().buttonGreen, {width: 120}]}
                                onPress={() => loadScreenData()}>
                                <TextC style={style().textButton1}>
                                    <Icon name="reload" size={25}/> neu laden
                                </TextC>
                            </Pressable>
                        </View>

                        <View style={{position: 'absolute', left: 0, top: 65}}>
                            <Pressable
                                style={[style().button1, style().buttonConfirm, style().buttonRed, {width: 140}]}
                                onPress={() => setSettingsModalVisible(true)}>
                                <TextC style={style().textButton1}>
                                    <Icon name="heart-settings" size={25}/> Einstellungen
                                </TextC>
                            </Pressable>
                        </View>

                        <View style={{position: 'absolute', left: 0, top: 110}}>
                            <Pressable
                                style={[style().button1, style().buttonConfirm, style().buttonRed, {width: 140}]}
                                onPress={() => setChangePWModalVisible(true)}>
                                <TextC style={style().textButton1}>
                                    <Icon name="form-textbox-password" size={25}/> PW ändern
                                </TextC>
                            </Pressable>
                        </View>

                        {data.object.roundsWithPossibleLogsDelete.length && global.settings.useLiveScouting ?
                            <View style={{position: 'absolute', right: 0, top: 85}}>
                                <Pressable
                                    style={[style().button1, style().buttonConfirm, style().buttonRed, {width: 120}]}
                                    onPress={() => setClearLogsModalVisible(true)}>
                                    <TextC style={style().textButton1}>
                                        <Icon name="delete" size={25}/> Logs leeren
                                    </TextC>
                                </Pressable>
                            </View> : null}

                        <TextC style={{fontSize: 32}}>{data.year.name}</TextC>
                        <TextC style={{fontSize: 26}}>{'Tag ' + data.year.settings.currentDay_id}</TextC>
                        <TextC
                            style={{fontSize: 18}}>{DateFunctions.getDateFormatted(data.year.day)}</TextC>
                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                        {data.object.teamYearsCount === 0 ?
                            <View style={style().matchflexEventsView}>
                                <TextC>Teams anlegen:</TextC>
                                {teamNamesSplit.length !== data.year.teamsCount ?
                                    <View style={style().matchflexEventsView}>
                                        <TextC>
                                            {teamNames !== '' ? teamNames.split('\n').length : 0} => {data.year.teamsCount}
                                            {teamNames.split('\n').length === data.year.teamsCount ?
                                                <TextC style={style().textGreen}> {'\u2714'}</TextC>
                                                : <TextC style={style().textRed}> {'\u2762'}</TextC>}
                                        </TextC>
                                        <View style={style().matchflexEventsView}>
                                            {data.year.settings.isTest === 1 && teamNames.split('\n').length !== data.year.teamsCount ?
                                                <Pressable
                                                    style={[style().button1, (teamNames.split('\n').length !== data.year.teamsCount ? style().buttonGreen : style().buttonGrey)]}
                                                    onPress={() => insertTestTeamNames()}>
                                                    <TextC style={style().textButton1}>Test-Teams einfügen</TextC>
                                                </Pressable>
                                                : null}
                                        </View>
                                        <TextC>Ein Team je Zeile {'\u2B0E'} dann Team-Namen
                                            überprüfen {'\u2B0E\u2B0E'}</TextC>
                                        <TextInput
                                            multiline
                                            numberOfLines={data.year.teamsCount}
                                            value={teamNames}
                                            style={[style().textInput, {width: '80%'}]}
                                            onChangeText={(value) => setTeamNames(value)}
                                            placeholder={Array(data.year.teamsCount).fill(0).map((_, i) => ('hier Team ' + (i + 1) + ' einfügen')).join('\n')}
                                            placeholderTextColor="rgba(229, 229, 231, 0.28)"
                                        />
                                    </View>
                                    :
                                    <View>
                                        <Pressable style={[style().button1, style().buttonCancel, style().buttonRed]}
                                                   onPress={() => setTeamNamesSplit([])}>
                                            <TextC style={style().textButton1}>zurück</TextC>
                                        </Pressable>
                                        {[...Array(data.year.teamsCount)].map((e, i) =>
                                            <View key={i}>
                                                <TextC style={style().textGreen}>
                                                    <TextInput style={[style().textInput]}
                                                               value={teamNamesSplit[i]['name'] || ''}/>
                                                    {teamNamesSplit[i]['team_id'] > 0 ? ' \u2714'
                                                        :
                                                        <Pressable style={[style().button1, style().buttonGreen]}
                                                                   onPress={() => addTeamName(teamNamesSplit[i]['name'], i)}>
                                                            <TextC style={style().textButton1}>anlegen</TextC>
                                                        </Pressable>
                                                    }
                                                </TextC>
                                            </View>
                                        )}
                                    </View>
                                }
                                <View style={style().matchflexEventsView}>
                                    <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                                    {teamNamesSplit.length !== data.year.teamsCount && teamNames.split('\n').length === data.year.teamsCount ?
                                        <Pressable
                                            style={[style().button1, (teamNames.split('\n').length === data.year.teamsCount ? style().buttonGreen : style().buttonGrey)]}
                                            onPress={() => checkTeamNames()}>
                                            <TextC style={style().textButton1}>Team-Namen überprüfen</TextC>
                                        </Pressable> : <TextC>Team-Namen überprüfen</TextC>}
                                </View>

                                <View style={style().matchflexEventsView}>
                                    <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                                    {countTeamsFound() === data.year.teamsCount ?
                                        <Pressable style={[style().button1, style().buttonGreen]}
                                                   onPress={() => insertTeamYears()}>
                                            <TextC style={style().textButton1}>Teams im aktuellen Jahr anlegen</TextC>
                                        </Pressable>
                                        : <TextC>Teams im aktuellen Jahr angelegt: {data.object.teamYearsCount}</TextC>}
                                </View>
                            </View>
                            :
                            <View>
                                <TextC>Teams im aktuellen Jahr angelegt: {data.object.teamYearsCount}
                                    {data.object.teamYearsCount === data.year.teamsCount ?
                                        <TextC style={style().textGreen}> {'\u2714'}</TextC> : null}
                                </TextC>
                                {global.settings.useLiveScouting ?
                                    <TextC>Team-PINs angelegt: {data.object.teamYearsPins}
                                        {data.object.teamYearsPins === data.object.teamYearsCount ?
                                            <TextC style={style().textGreen}> {'\u2714'}</TextC> : null}
                                    </TextC> : null}
                            </View>
                        }

                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                        <TextC>Gruppen angelegt: {data.object.groupsCount}
                            {global.settings.usePlayOff > 0 ? ' (inkl. Endrunde)' : ''}
                            {data.object.groupsCount > 0 ?
                                <TextC style={style().textGreen}> {'\u2714'}</TextC> : null}
                        </TextC>
                        {data.object.groupsCount === 0 && data.object.teamYearsCount === data.year.teamsCount ?
                            <View>
                                <Pressable style={[style().button1, style().buttonGreen]}
                                           onPress={() => adminAction('groups/addAll', '')}>
                                    <TextC style={style().textButton1}>Gruppen
                                        anlegen</TextC>
                                </Pressable>
                            </View> : null}

                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>

                        <TextC>Teams in Gruppen gelegt: {data.object.groupTeamsCount}
                            {data.object.groupTeamsCount === data.year.teamsCount ?
                                <TextC style={style().textGreen}> {'\u2714'}</TextC> : null}
                        </TextC>
                        {data.object.groupTeamsCount === 0 && data.object.groupsCount > 0 ?
                            <View>
                                <Pressable style={[style().button1, style().buttonGreen]}
                                           onPress={() => adminAction('groupTeams/addAll', '')}>
                                    <TextC style={style().textButton1}>Teams in Gruppen
                                        legen</TextC>
                                </Pressable>
                            </View> : null}

                        {data.object.groupsCount - (global.settings.usePlayOff > 0 ? 1 : 0) > 1 ?
                            <View style={style().matchflexEventsView}>
                                <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                                {data.year.settings.currentDay_id === 1 && data.object.matchesCount === 0 && data.object.groupTeamsCount === data.year.teamsCount ?
                                    <View>
                                        <TextC>Nur Tag 1: Gruppenzuordnung der Teams sortieren:</TextC>
                                        <View>
                                            <Picker
                                                selectedValue={selectedValue1}
                                                onValueChange={(itemValue) => setSelectedValue1(itemValue)}
                                                style={[style().button1, style().pickerSelect]}
                                            >
                                                <Picker.Item label="Standard (groupTeamsId / Excel-Skript)"
                                                             value="standard"/>
                                                <Picker.Item label="nach Ranglistenpunkte/Jahr und Zufall"
                                                             value="random"/>
                                            </Picker>
                                            <Pressable style={[style().button1, style().buttonGreen]}
                                                       onPress={() => adminAction('groups/sortAfterAddAllGroupTeams', selectedValue1)}>
                                                <TextC style={style().textButton1}>Los!</TextC>
                                            </Pressable>
                                        </View>
                                        <TextC>{data.avgRankingPointsPerYear !== undefined ?
                                            <TextC>Durchschnittsranglistenpunkte Gr.
                                                {Object.entries(data.avgRankingPointsPerYear).map(([key, val]) => (
                                                    <TextC key={key}>{key}: {val}   </TextC>
                                                ))}</TextC> : null}</TextC>
                                    </View>
                                    :
                                    (data.object.matchesCount === 0 ?
                                            <TextC>Gruppenzuordnungen sortieren</TextC>
                                            :
                                            <TextC>Gruppenzuordnungen sortiert<TextC
                                                style={style().textGreen}> {'\u2714'}</TextC></TextC>
                                    )
                                }
                            </View> : null}

                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                        {data.object.matchesCount === 0 && data.object.groupTeamsCount === data.year.teamsCount ?
                            <View>
                                <TextC>Platzziffern an Teams verteilen:</TextC>
                                <View>
                                    <Picker
                                        selectedValue={selectedValue2}
                                        onValueChange={(itemValue) => setSelectedValue2(itemValue)}
                                        style={[style().button1, style().pickerSelect]}
                                    >
                                        <Picker.Item label="initial" value="initial"/>
                                        <Picker.Item label="Standard, wie Excel-Skript" value="standard"/>
                                        <Picker.Item label="ranking" value="ranking"/>
                                        <Picker.Item label="random4 - only within a quartet" value="random4"/>
                                        <Picker.Item label="random2 - overall" value="random2"/>
                                    </Picker>
                                    <Pressable style={[style().button1, style().buttonGreen]}
                                               onPress={() => adminAction('groupTeams/sortPlaceNumberAfterAddAll', selectedValue2)}>
                                        <TextC style={style().textButton1}>Los!</TextC>
                                    </Pressable>
                                </View>
                                <TextC>{data.avgOpponentRankingPointsPerYear ?
                                    <TextC>Durchschnittsranglistenpunkte der Gegner in Gruppe
                                        {Object.entries(data.avgOpponentRankingPointsPerYear).map(([key, val]) => (
                                            <TextC key={key}>{'\n' + key}: {Object.entries(val).map(([k, v]) => (
                                                <TextC
                                                    key={k}>{k}: {v}   </TextC>))}</TextC>
                                        ))}</TextC> : null}</TextC>
                                <TextC>{data.year.settings.currentDay_id === 2 && data.avgOpponentPrevDayRanking ?
                                    <TextC>{'\n'}Durchschnittsvortagesplatz der Gegner in Gruppe
                                        {Object.entries(data.avgOpponentPrevDayRanking).map(([key, val]) => (
                                            <TextC key={key}>{'\n' + key}: {Object.entries(val).map(([k, v]) => (
                                                <TextC
                                                    key={k}>{k}: {v}   </TextC>))}</TextC>
                                        ))}</TextC> : null}</TextC>
                                <TextC>{data.countDoubleMatches ?
                                    <TextC>{'\n'}Gleiche Paarungen wie zuvor:
                                        {Object.entries(data.countDoubleMatches).map(([key, val]) => (
                                            <TextC key={key}>{'\n' + key}: {val}</TextC>
                                        ))}</TextC> : null}</TextC>
                            </View>
                            :
                            (data.object.matchesCount === 0 ?
                                    <TextC>Platzziffern an Teams verteilen</TextC>
                                    :
                                    <TextC>Platzziffern an Teams verteilt<TextC
                                        style={style().textGreen}> {'\u2714'}</TextC></TextC>
                            )
                        }

                        {data.year.settings.isTest === 1 && data.object.matchesCount > 0 && data.object.matchResultCount === 0 ?
                            <View style={{position: 'absolute', right: 0, top: 5}}>
                                <Pressable style={[style().button1, style().buttonRed]}
                                           onPress={() => adminAction('years/clearMatchesAndLogs', '')}>
                                    <TextC style={style().textButton1}>Testmodus:
                                        Alle Spiele{'\n'}und Matchlogs löschen</TextC>
                                </Pressable>
                            </View> : null}
                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                        <TextC>Spiele angelegt: {data.object.matchesCount}
                            {global.settings.usePlayOff > 0 ? ' (inkl. Endrunde)' : ''}
                            {data.object.matchesCount === data.year.teamsCount * 4 + data.object.matchesPlayOff ?
                                <TextC style={style().textGreen}> {'\u2714'}</TextC> : null}
                        </TextC>
                        {global.settings.useLiveScouting && data.object.matchesCount > 0 ?
                            <TextC>Spiel-PINs angelegt: {data.object.matchesPins}
                                {data.object.matchesPins === data.object.matchesCount ?
                                    <TextC style={style().textGreen}> {'\u2714'}</TextC> : null}
                            </TextC> : null}
                        {data.object.matchesCount > 0 && global.settings.usePlayOff > 0 ?
                            <TextC>Endrunden-Spiele angelegt: {data.object.matchesPlayOff}
                                {data.object.matchesPlayOff === global.settings.usePlayOff ?
                                    <TextC style={style().textGreen}> {'\u2714'}</TextC>
                                    : <TextC style={style().textRed}> {'\u2762'}</TextC>}
                            </TextC> : null}
                        {data.object.matchesCount > 0 ?
                            <View style={style().matchflexEventsView}>
                                {global.settings.usePlayOff > 0 ? <TextC>{'\n'}Ohne Endrunde:</TextC> : null}
                                <TextC>Spiele je
                                    Team: {data.object.minMatchesByTeam} - {data.object.maxMatchesByTeam} (min/max)
                                    {data.object.minMatchesByTeam === data.object.maxMatchesByTeam ?
                                        <TextC style={style().textGreen}> {'\u2714'}</TextC> : null}
                                </TextC>
                                <TextC>Max. Jobs je Team je
                                    Runde: {data.object.maxJobsByTeamPerRound}
                                    {data.object.maxJobsByTeamPerRound === 1 ?
                                        <TextC style={style().textGreen}> {'\u2714'}</TextC>
                                        : <TextC style={style().textRed}> {'\u2762'}</TextC>}
                                </TextC>
                                {data.object.teamYearsCount === 24 ?
                                    <TextC>Max. Jobs je Team je
                                        3 Runden: {data.object.maxJobsByTeamPer3Rounds}
                                        {data.object.maxJobsByTeamPer3Rounds === 1 ?
                                            <TextC style={style().textGreen}> {'\u2714'}</TextC>
                                            : <TextC style={style().textRed}> {'\u2762'}</TextC>}
                                    </TextC> : null}
                            </View> : null}

                        {data.object.matchesCount === 0 && data.object.groupTeamsCount === data.year.teamsCount ?
                            <View>
                                <Pressable style={[style().button1, style().buttonGreen]}
                                           onPress={() => adminAction('matches/addAllFromSchedulingPattern', '')}>
                                    <TextC style={style().textButton1}>Spiele analog
                                        Rasterspielplan anlegen</TextC>
                                </Pressable>
                            </View>
                            : null}

                        {data.object.matchesCount > data.object.matchResultCount ?
                            <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                            : null}
                        {data.object.matchesCount > data.object.matchResultCount ?
                            <TextC>Fehlende SR: {data.object.missingRefereesCount}
                                {global.settings.usePlayOff > 0 ? ' (inkl. Endrunde)' : ''}
                                {data.object.missingRefereesCount === 0 ?
                                    <TextC style={style().textGreen}> {'\u2714'}</TextC>
                                    : <TextC style={style().textRed}> {'\u2762'}</TextC>
                                }
                            </TextC>
                            : null}
                        {data.object.matchesCount > data.object.matchResultCount && data.object.matchesRefChangeable.length > 0 ?
                            <View><TextC style={{fontSize: 26}}>Fehlende SR von abgesagten Spielen besetzen:</TextC>
                                {Object.entries(data.object.matchesRefChangeable).map(([key, val]) => (
                                    <Pressable key={key} style={[style().button1, style().buttonGrey]}
                                               onPress={() => adminAction('matches/changeReferees', val[0].id + '/' + val[1].id)}>
                                        <TextC>
                                            <TextC style={style().textRed}>
                                                {val[0].group_name + val[0].round_id + ': '}
                                                {SportFunctions.getSportImage(val[0].sport.code)}
                                                {val[0].sport.code + ' - ' + val[0].teams3.name}
                                            </TextC>
                                            {' <=> ' + val[1].group_name + val[1].round_id + ': '}
                                            {SportFunctions.getSportImage(val[1].sport.code)}
                                            {val[1].sport.code + ' - ' + val[1].teams3.name}
                                        </TextC>
                                    </Pressable>
                                ))}

                            </View> : null}
                        {data.year.settings.currentDay_id > 1 && data.object.matchesCount > data.object.matchResultCount ?
                            <TextC>Abgesagte Spiele wg. 1 fehlenden Team: {data.object.matchesWith1CanceledCount}
                                {data.object.matchesWith1CanceledCount === 0 ?
                                    <TextC style={style().textGreen}> {'\u2714'}</TextC>
                                    : <TextC style={style().textRed}> {'\u2762'}</TextC>}
                            </TextC> : null}
                        {data.year.settings.currentDay_id > 1 && data.object.matchesCount > data.object.matchResultCount && data.object.matchesTeamsChangeable.length > 0 && data.object.matchesRefChangeable.length === 0 ?
                            <View><TextC style={{fontSize: 26}}>Abgesagte Spiele - Teams tauschen:</TextC>
                                {Object.entries(data.object.matchesTeamsChangeable).map(([key, val]) => (
                                    <Pressable key={key} style={[style().button1, style().buttonGrey]}
                                               onPress={() => adminAction('matches/changeTeams', val[0].id + '/' + val[1].id)}>
                                        <TextC>
                                            <TextC style={style().textRed}>
                                                {val[0].group_name + val[0].round_id + ': '}
                                                {SportFunctions.getSportImage(val[0].sport.code)}
                                                {val[0].sport.code + ' - ' + (val[0].canceled === 1 ? val[0].teams1.name : val[0].teams2.name)}
                                            </TextC>
                                            {' <=> ' + val[1].group_name + val[1].round_id + ': '}
                                            {SportFunctions.getSportImage(val[1].sport.code)}
                                            {val[1].sport.code + ' - ' + (val[1].canceled === 1 ? val[1].teams2.name : val[1].teams1.name)}
                                        </TextC>
                                    </Pressable>
                                ))}
                            </View> : null}

                        {data.object.matchesCount > data.object.matchResultCount ?
                            <TextC style={{fontSize: 32}}>Spielbetrieb läuft!</TextC> : null}
                        {data.object.matchesCount > data.object.matchResultCount ?
                            <View style={style().matchflexRowView}>
                                <View style={[style().viewStatus, {flex: 1}]}>
                                    <Pressable style={[style().button1, style().buttonGreyDark]}
                                               onPress={() => downloadPdf('teamYears/pdfAllTeamsMatches')}>
                                        <TextC style={style().textButton1}><Icon name="file-pdf-box"
                                                                                 size={25}/>Pdf-Download:{'\n'}Alle
                                            Team-Spielpläne </TextC>
                                    </Pressable>
                                </View>
                                {/*
                                <View style={[style().viewStatus, {flex: 1}]}>
                                    <Pressable style={[style().button1, style().buttonGrey]}
                                               onPress={() => downloadPdf('teamYears/pdfAllTeamsMatchesWithGroupMatches/0')}>
                                        <TextC style={style().textButton1}><Icon name="file-pdf-box"
                                                                                 size={25}/>Pdf-Download:{'\n'}Alle
                                            Team-Spielpläne{'\n'}+alle Gr.Spiele Teil 1</TextC>
                                    </Pressable>
                                </View>
                                <View style={[style().viewStatus, {flex: 1}]}>
                                    <Pressable style={[style().button1, style().buttonGrey]}
                                               onPress={() => downloadPdf('teamYears/pdfAllTeamsMatchesWithGroupMatches/1')}>
                                        <TextC style={style().textButton1}><Icon name="file-pdf-box"
                                                                                 size={25}/>Pdf-Download:{'\n'}Alle
                                            Team-Spielpläne{'\n'}+alle Gr.Spiele Teil 2</TextC>
                                    </Pressable>
                                </View>
                                */}
                            </View> : null}

                        {data.object.matchesCount > 0 ?
                            <View style={style().matchflexRowView}>
                                <View style={[style().viewStatus, {flex: 1}]}>
                                    {data.object.matchesCount > data.object.matchResultCount ?
                                        <Pressable style={[style().button1, style().buttonGreyDark]}
                                                   onPress={() => downloadPdf('sports/pdfAllFieldsMatches')}>
                                            <TextC style={style().textButton1}><Icon name="file-pdf-box"
                                                                                     size={25}/>Pdf-Download:{'\n'}Alle
                                                Feld-Spielpläne </TextC>
                                        </Pressable>
                                        : null}
                                </View>
                                <View style={[style().viewStatus, {flex: 1}]}>
                                    <Pressable style={[style().button1, style().buttonGreyDark]}
                                               onPress={() => downloadPdf('groupTeams/pdfAllRankings')}>
                                        <TextC style={style().textButton1}><Icon name="file-pdf-box"
                                                                                 size={25}/>Pdf-Download:{'\n'}Alle
                                            Tabellen
                                        </TextC>
                                    </Pressable>
                                </View>
                                <View style={[style().viewStatus, {flex: 1}]}>
                                    <Pressable style={[style().button1, style().buttonGreyDark]}
                                               onPress={() => downloadPdf('matches/pdfMatchesByGroup')}>
                                        <TextC style={style().textButton1}><Icon name="file-pdf-box"
                                                                                 size={25}/>Pdf-Download:{'\n'}Alle
                                            Gruppen-Spielpläne </TextC>
                                    </Pressable>
                                </View>
                            </View> : null}

                        {data.object.matchesCount > 0 ?
                            <View style={style().matchflexEventsView}>
                                <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                                <TextC>Spiele
                                    gewertet: {data.object.matchResultCount} / {data.object.sumCalcMatchesGroupTeams} (gewertet
                                    / in Tabelle freigeschaltet)
                                    {data.object.matchesCount === data.object.matchResultCount && data.object.matchResultCount > 0 ?
                                        <TextC style={style().textGreen}> {'\u2714'}</TextC> :
                                        <TextC
                                            style={style().textRed}> {'-> ' + data.object.matchesCount + ' \u2762'}</TextC>}
                                </TextC>
                                {global.settings.usePlayOff && data.object.matchResultCount >= data.object.matchesCount - global.settings.usePlayOff ?
                                    <View>
                                        <Pressable
                                            style={style().link}
                                            onPress={() => navigation.navigateDeprecated('Admin', {
                                                screen: 'RoundsMatchesAdmin',
                                                params: {
                                                    id: 25,
                                                    roundsCount: 25,
                                                }
                                            })}>
                                            <TextC
                                                style={[style().textButton1, style().big22, {color: ColorFunctions.getColor('primary')}]}>
                                                {'\u279E'} Admin Endrunde</TextC>
                                        </Pressable>
                                    </View> : null}
                                {data.year.settings.isTest === 1 && data.object.matchesCount > data.object.matchResultCount ?
                                    <View>
                                        {global.settings.useLiveScouting ?
                                            <Pressable style={[style().button1, style().buttonGreen]}
                                                       onPress={() => adminAction('matcheventLogs/insertTestLogs', '')}>
                                                <TextC style={style().textButton1}>Testmodus:
                                                    Zufällig geloggte Tore eintragen</TextC>
                                            </Pressable> : null}
                                        <Pressable style={[style().button1, style().buttonGreen]}
                                                   onPress={() => adminAction('matches/insertTestResults', '')}>
                                            <TextC style={style().textButton1}>Testmodus:
                                                Zufallszahlen als bestätigte Spielergebnisse eintragen</TextC>
                                        </Pressable>
                                    </View> : null}

                                {!global.settings.alwaysAutoUpdateResults ?
                                    <View style={style().matchflexEventsView}>
                                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                                        {data.object.matchesCount > 0 && data.object.matchesCount === data.object.matchResultCount && !data.year.settings.alwaysAutoUpdateResults ?
                                            <View>
                                                <Pressable style={[style().button1, style().buttonGreen]}
                                                           onPress={() => adminAction('years/setAlwaysAutoUpdateResults', '')}>
                                                    <TextC style={style().textButton1}>Ergebnisse und Tabellen
                                                        freischalten{'\n'}(mit
                                                        Tabellen-Neuberechnung)</TextC>
                                                </Pressable>
                                            </View>
                                            :
                                            <View>
                                                {data.object.matchesCount > 0 && data.object.matchesCount === data.object.matchResultCount ?
                                                    <TextC>Ergebnisse und Tabellen freigeschaltet<TextC
                                                        style={style().textGreen}> {'\u2714'}</TextC></TextC>
                                                    :
                                                    <TextC>Ergebnisse und Tabellen freischalten</TextC>
                                                }
                                            </View>
                                        }
                                    </View> : null}
                            </View> : null}

                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                        {data.object.matchesCount > 0 ?
                            <View>
                                <Pressable style={[style().button1, style().buttonGreenLight]}
                                           onPress={() => adminAction('years/reCalcRanking', '')}>
                                    <TextC style={[style().textButton1, {color: ColorFunctions.getColor('primary')}]}>Optional:
                                        Tabellen neu berechnen</TextC>
                                </Pressable>
                            </View>
                            :
                            <TextC>Tabellen neu berechnen</TextC>
                        }

                        {data.year.settings.usePushTokenRatings && data.object.matchesCount > 0 && data.object.ptrAll > 0 ?
                            <View style={style().matchflexEventsView}>
                                <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                                <Pressable
                                    style={[style().button1, (data.object.ptrAll === data.object.ptrConfirmed ? style().buttonGreenLight : style().buttonGreen)]}
                                    onPress={() => adminAction('pushTokenRatings/checkAll', '')}>
                                    <TextC
                                        style={data.object.ptrAll === data.object.ptrConfirmed ? {color: ColorFunctions.getColor('primary')} : style().textButton1}>
                                        PT-Ratings bestätigen: {data.object.ptrConfirmed} / {data.object.ptrAll}</TextC>
                                </Pressable>
                                {data.object.ptrRanking > 0 ?
                                    <View>
                                        <TextC>
                                            <Pressable
                                                style={style().link}
                                                onPress={() => navigation.navigate('AdminPushTokenRanking')}>
                                                <TextC style={style().textButton1}>{'\u279E'} PTR-Ranking</TextC>
                                            </Pressable>
                                        </TextC>
                                    </View> : null}
                            </View> : null}

                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                        {data.object.matchesCount > 0 && data.object.matchesCount === data.object.matchResultCount && data.year.settings.alwaysAutoUpdateResults ?
                            <View>
                                {data.year.settings.currentDay_id === data.year.daysCount ?
                                    <View>
                                        <Pressable
                                            style={[style().button1, (data.object.teamYearsEndRankingCount > 0 && data.object.teamYearsEndRankingCount === data.object.teamYearsCount ? style().buttonGreenLight : style().buttonGreen)]}
                                            onPress={() => adminAction('teamYears/setEndRanking', '')}>
                                            <TextC
                                                style={data.object.teamYearsEndRankingCount > 0 && data.object.teamYearsEndRankingCount === data.object.teamYearsCount ? {color: ColorFunctions.getColor('primary')} : style().textButton1}>
                                                Jahres-Endtabelle erstellen
                                            </TextC>
                                        </Pressable>
                                        {data.object.teamYearsEndRankingCount > 0 && data.object.teamYearsEndRankingCount === data.object.teamYearsCount ?
                                            <View>
                                                <TextC>
                                                    <Pressable
                                                        style={style().link}
                                                        onPress={() => navigation.navigate('TeamYearsEndRankingAdmin', {
                                                            item: {
                                                                year_id: data.year.id,
                                                                year_name: data.year.name
                                                            }
                                                        })}>
                                                        <TextC style={style().textButton1}>{'\u279E'} Jahres-Endtabelle</TextC>
                                                    </Pressable> erstellt <TextC
                                                    style={style().textGreen}> {'\u2714'}</TextC>
                                                </TextC>
                                                <Pressable style={[style().button1, style().buttonGreyDark]}
                                                           onPress={() => downloadPdf('teamYears/pdfEndRanking')}>
                                                    <TextC style={style().textButton1}><Icon name="file-pdf-box"
                                                                                             size={25}/>Pdf-Download:{'\n'}Jahres-Endtabelle</TextC>
                                                </Pressable>
                                            </View> : null}
                                    </View> : null}
                                {data.year.settings.currentDay_id < data.year.daysCount ?
                                    <View>
                                        <TextC style={{fontSize: 32}}>Spielbetrieb für heute beendet!</TextC>
                                        <Pressable style={[style().button1, style().buttonGreen]}
                                                   onPress={() => adminAction('years/setCurrentDayIncrement', '')}>
                                            <TextC style={style().textButton1}>Umstellen auf
                                                Tag {data.year.settings.currentDay_id + 1}</TextC>
                                        </Pressable>
                                    </View> : null}
                            </View>
                            :
                            <View>
                                {data.year.settings.currentDay_id === data.year.daysCount ?
                                    <TextC>Jahres-Endtabelle erstellen</TextC> : null}
                                {data.year.settings.currentDay_id < data.year.daysCount ?
                                    <TextC>Umstellen auf
                                        Tag {data.year.settings.currentDay_id + 1}</TextC> : null}
                            </View>
                        }

                        {data.year.settings.currentDay_id === data.year.daysCount ?
                            <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                            : null}
                        {data.year.settings.currentDay_id === data.year.daysCount ?
                            <View>
                                {data.object.teamYearsEndRankingCount > 0 && data.object.teamYearsEndRankingCount === data.object.teamYearsCount ?
                                    (data.year.settings.showEndRanking ?
                                            <View style={style().matchflexEventsView}>
                                                <Pressable style={[style().button1, style().buttonRed]}
                                                           onPress={() => adminAction('years/showEndRanking', 0)}>
                                                    <TextC style={style().textButton1}>Tabellen und Jahres-Endtabelle
                                                        sperren</TextC>
                                                </Pressable>
                                                <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                                                <TextC style={{fontSize: 32}}>Spielbetrieb beendet!</TextC>
                                                {data.year.name !== format(new Date(), "yyyy") || data.year.settings.isTest === 1 ?
                                                    <Pressable style={[style().button1, style().buttonGreen]}
                                                               onPress={() => setNewYearModalVisible(true)}>
                                                        <TextC style={style().textButton1}>Neues Turnier-Jahr
                                                            erstellen</TextC>
                                                    </Pressable> : null}
                                            </View>
                                            :
                                            <Pressable style={[style().button1, style().buttonGreen]}
                                                       onPress={() => adminAction('years/showEndRanking', 1)}>
                                                <TextC style={style().textButton1}>Tabellen und Jahres-Endtabelle
                                                    freigeben</TextC>
                                            </Pressable>
                                    )
                                    :
                                    <TextC>Tabellen und Jahres-Endtabelle freigeben</TextC>
                                }
                            </View>
                            : null}


                        {data.year.settings.isTest === 1 ?
                            <View style={style().matchflexEventsView}>
                                <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                                <Pressable style={[style().button1, style().buttonRed]}
                                           onPress={() => adminAction('years/clearTest', '')}>
                                    <TextC style={style().textButton1}>Testmodus:
                                        Alle Testdaten löschen</TextC>
                                </Pressable>
                            </View> : null}
                    </View>
                ) : <TextC>Fehler!</TextC>)}
            <SettingsModal
                setModalVisible={setSettingsModalVisible}
                modalVisible={settingsModalVisible}
                loadScreenData={loadScreenData}
            />
            <ChangePWModal
                setModalVisible={setChangePWModalVisible}
                modalVisible={changePWModalVisible}
                loadScreenData={loadScreenData}
            />
            <ClearLogsModal
                setModalVisible={setClearLogsModalVisible}
                modalVisible={clearLogsModalVisible}
                loadScreenData={loadScreenData}
                roundsWithPossibleLogsDelete={data?.object?.roundsWithPossibleLogsDelete}
            />
            {data?.year ?
                <NewYearModal
                    setModalVisible={setNewYearModalVisible}
                    modalVisible={newYearModalVisible}
                    loadScreenData={loadScreenData}
                    oldYear={data.year}
                /> : null}
        </ScrollView>
    )
}

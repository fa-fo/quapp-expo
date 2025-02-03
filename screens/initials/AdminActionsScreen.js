import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {Image, Pressable, RefreshControl, ScrollView, TextInput, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import fetchApi from '../../components/fetchApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as DateFunctions from "../../components/functions/DateFunctions";
import {style} from "../../assets/styles";
import * as SportFunctions from "../../components/functions/SportFunctions";
import ClearLogsModal from "./modals/ClearLogsModal";

export default function AdminActionsScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selectedValue1, setSelectedValue1] = useState('standard');
    const [selectedValue2, setSelectedValue2] = useState('standard');
    const [teamNames, setTeamNames] = useState('');
    const [teamNamesSplit, setTeamNamesSplit] = useState([]);
    const [clearLogsModalVisible, setClearLogsModalVisible] = useState(false);

    useEffect(() => {
        loadScreenData({});
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
            {isLoading ? null :
                (data?.status === 'success' ? (
                    <View style={style().matchflexEventsView}>
                        <View style={{position: 'absolute', left: 0, top: 10}}>
                            <Pressable
                                style={[style().button1, style().buttonConfirm, style().buttonGreen, {width: 120}]}
                                onPress={() => loadScreenData()}>
                                <Icon name="reload" size={25}/>
                                <TextC style={style().textButton1}>neu laden</TextC>
                            </Pressable>
                        </View>

                        {data.object.roundsWithPossibleLogsDelete.length && global.settings.useLiveScouting ?
                            <View style={{position: 'absolute', right: 0, top: 10}}>
                                <Pressable
                                    style={[style().button1, style().buttonConfirm, style().buttonRed, {width: 120}]}
                                    onPress={() => setClearLogsModalVisible(true)}>
                                    <Icon name="delete" size={25}/>
                                    <TextC style={style().textButton1}>Logs leeren</TextC>
                                </Pressable>
                            </View> : null}

                        <TextC style={{fontSize: 32}}>{data.year.name}</TextC>
                        <TextC style={{fontSize: 26}}>{'Tag ' + data.year.settings.currentDay_id}</TextC>
                        <TextC
                            style={{fontSize: 18}}>{DateFunctions.getDateFormatted(data.year.day)}</TextC>
                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                        {data.object.teamYearsCount === 0 ?
                            <View>
                                <TextC>Teams anlegen:</TextC>
                                {teamNamesSplit.length !== data.year.teamsCount ?
                                    <View>
                                        {teamNames.split('\n').length !== data.year.teamsCount ?
                                            <TextC>{teamNames.split('\n').length} => {data.year.teamsCount}</TextC>
                                            :
                                            <Pressable style={[style().button1, style().buttonGreen]}
                                                       onPress={() => checkTeamNames()}>
                                                <TextC style={style().textButton1}>Team-Namen überprüfen</TextC>
                                            </Pressable>
                                        }
                                        <TextInput
                                            multiline
                                            numberOfLines={data.year.teamsCount}
                                            style={[style().textInput]}
                                            onChangeText={(value) => setTeamNames(value)}
                                        />
                                    </View>
                                    :
                                    <View>
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
                                {countTeamsFound() === data.year.teamsCount ?
                                    <Pressable style={[style().button1, style().buttonGreen]}
                                               onPress={() => insertTeamYears()}>
                                        <TextC style={style().textButton1}>Teams im aktuellen Jahr anlegen</TextC>
                                    </Pressable>
                                    : null}
                            </View>
                            :
                            <View>
                                <TextC>Teams im aktuellen Jahr angelegt: {data.object.teamYearsCount}
                                    {data.object.teamYearsCount === data.year.teamsCount ?
                                        <TextC style={style().textGreen}> {'\u2714'}</TextC> : null}
                                </TextC>
                                <TextC>Team-PINs angelegt: {data.object.teamYearsPins}
                                    {data.object.teamYearsPins === data.object.teamYearsCount ?
                                        <TextC style={style().textGreen}> {'\u2714'}</TextC> : null}
                                </TextC>
                            </View>
                        }

                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                        <TextC>Gruppen angelegt: {data.object.groupsCount}
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
                                        <Picker.Item label="nach Ranglistenpunkte/Jahr und Zufall" value="random"/>
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
                            <View style={{position: 'absolute', right: 0}}>
                                <Pressable style={[style().button1, style().buttonRed]}
                                           onPress={() => adminAction('years/clearMatchesAndLogs', '')}>
                                    <TextC style={style().textButton1}>Testmodus:
                                        Alle Spiele{'\n'}und Matchlogs löschen</TextC>
                                </Pressable>
                            </View> : null}
                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                        <TextC>Spiele angelegt: {data.object.matchesCount}
                            {data.object.matchesCount === data.year.teamsCount * 4 ?
                                <TextC style={style().textGreen}> {'\u2714'}</TextC> : null}
                        </TextC>
                        <TextC>Spiel-PINs angelegt: {data.object.matchesPins}
                            {data.object.matchesPins === data.object.matchesCount ?
                                <TextC style={style().textGreen}> {'\u2714'}</TextC> : null}
                        </TextC>
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
                                                <Image
                                                    style={style().sportImage}
                                                    source={SportFunctions.getSportImage(val[0].sport.code)}
                                                />
                                                {val[0].sport.code + ' - ' + val[0].teams3.name}
                                            </TextC>
                                            {' <=> ' + val[1].group_name + val[1].round_id + ': '}
                                            <Image
                                                style={style().sportImage}
                                                source={SportFunctions.getSportImage(val[1].sport.code)}
                                            />
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
                                                <Image
                                                    style={style().sportImage}
                                                    source={SportFunctions.getSportImage(val[0].sport.code)}
                                                />
                                                {val[0].sport.code + ' - ' + (val[0].canceled === 1 ? val[0].teams1.name : val[0].teams2.name)}
                                            </TextC>
                                            {' <=> ' + val[1].group_name + val[1].round_id + ': '}
                                            <Image
                                                style={style().sportImage}
                                                source={SportFunctions.getSportImage(val[1].sport.code)}
                                            />
                                            {val[1].sport.code + ' - ' + (val[1].canceled === 1 ? val[1].teams2.name : val[1].teams1.name)}
                                        </TextC>
                                    </Pressable>
                                ))}
                            </View> : null}

                        {data.object.matchesCount > data.object.matchResultCount ?
                            <TextC style={{fontSize: 32}}>Spielbetrieb läuft!</TextC>
                            : null}
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
                            </View>
                            : null}

                        {data.object.matchesCount > 0 ?
                            <View style={style().matchflexRowView}>
                                <View style={[style().viewStatus, {flex: 1}]}>
                                    {data.object.matchesCount > data.object.matchResultCount ?
                                        <Pressable style={[style().button1, style().buttonGreyBright]}
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
                            </View>
                            : null}

                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                        <TextC>Spiele
                            gewertet: {data.object.matchResultCount} / {data.object.sumCalcMatchesGroupTeams} (gewertet
                            / freigeschaltet)
                            {data.object.matchesCount === data.object.matchResultCount && data.object.matchResultCount > 0 ?
                                <TextC style={style().textGreen}> {'\u2714'}</TextC> : null}
                        </TextC>
                        {data.year.settings.isTest === 1 && data.object.matchesCount > data.object.matchResultCount ?
                            <View>
                                <Pressable style={[style().button1, style().buttonGreen]}
                                           onPress={() => adminAction('matcheventLogs/insertTestLogs', '')}>
                                    <TextC style={style().textButton1}>Testmodus:
                                        Zufällig geloggte Tore eintragen</TextC>
                                </Pressable>
                                <Pressable style={[style().button1, style().buttonGreen]}
                                           onPress={() => adminAction('matches/insertTestResults', '')}>
                                    <TextC style={style().textButton1}>Testmodus:
                                        Zufallszahlen als bestätigte Spielergebnisse eintragen</TextC>
                                </Pressable>
                            </View> : null}

                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                        {data.object.matchesCount > 0 && data.object.matchesCount === data.object.matchResultCount && !data.year.settings.alwaysAutoUpdateResults ?
                            <View>
                                <Pressable style={[style().button1, style().buttonGreen]}
                                           onPress={() => adminAction('years/setAlwaysAutoUpdateResults', '')}>
                                    <TextC style={style().textButton1}>Ergebnisse und Tabellen freischalten{'\n'}(mit
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

                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                        {data.object.matchesCount > 0 ?
                            <View>
                                <Pressable style={[style().button1, style().buttonGreen]}
                                           onPress={() => adminAction('years/reCalcRanking', '')}>
                                    <TextC style={style().textButton1}>Optional: Tabellen neu berechnen</TextC>
                                </Pressable>
                            </View>
                            :
                            <TextC>Tabellen neu berechnen</TextC>
                        }

                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                        {data.object.matchesCount > 0 && data.object.matchesCount === data.object.matchResultCount && data.year.settings.alwaysAutoUpdateResults ?
                            <View>
                                {data.year.settings.currentDay_id === data.year.daysCount ?
                                    <View>
                                        <Pressable style={[style().button1, style().buttonGreen]}
                                                   onPress={() => adminAction('teamYears/setEndRanking', '')}>
                                            <TextC style={style().textButton1}>Jahres-Endtabelle erstellen</TextC>
                                        </Pressable>
                                        {data.object.teamYearsEndRankingCount > 0 && data.object.teamYearsEndRankingCount === data.object.teamYearsCount ?
                                            <View>
                                                <TextC>Jahres-Endtabelle erstellt<TextC
                                                    style={style().textGreen}> {'\u2714'}</TextC></TextC>
                                                <Pressable
                                                    style={[style().button1, style().buttonConfirm, style().buttonGreen]}
                                                    onPress={() => navigation.navigate('TeamYearsEndRankingAdmin', {
                                                        item: {
                                                            year_id: data.year.id,
                                                            year_name: data.year.name
                                                        }
                                                    })}>
                                                    <TextC style={style().textButton1}>Jahres-Endtabelle
                                                        aufrufen</TextC>
                                                </Pressable>
                                                <Pressable style={[style().button1, style().buttonGreyDark]}
                                                           onPress={() => downloadPdf('teamYears/pdfEndRanking')}>
                                                    <TextC style={style().textButton1}><Icon name="file-pdf-box"
                                                                                             size={25}/>Pdf-Download:{'\n'}Jahres-Endtabelle</TextC>
                                                </Pressable>
                                            </View> : null}
                                    </View> : null}
                                {data.year.settings.currentDay_id < data.year.daysCount ?
                                    <View>
                                        <TextC>Spielbetrieb beendet!</TextC>
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
                                            <Pressable style={[style().button1, style().buttonRed]}
                                                       onPress={() => adminAction('years/showEndRanking', 0)}>
                                                <TextC style={style().textButton1}>Tabellen und Jahres-Endtabelle
                                                    sperren</TextC>
                                            </Pressable>
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


                        <TextC style={{fontSize: 32}}>{'\u27F1'}</TextC>
                        {data.year.settings.isTest === 1 ?
                            <View>
                                <Pressable style={[style().button1, style().buttonRed]}
                                           onPress={() => adminAction('years/clearTest', '')}>
                                    <TextC style={style().textButton1}>Testmodus:
                                        Alle Testdaten löschen</TextC>
                                </Pressable>
                            </View> : null}
                    </View>
                ) : <TextC>Fehler!</TextC>)}
            <ClearLogsModal
                setModalVisible={setClearLogsModalVisible}
                modalVisible={clearLogsModalVisible}
                loadScreenData={loadScreenData}
                roundsWithPossibleLogsDelete={data?.object?.roundsWithPossibleLogsDelete}
            />
        </ScrollView>
    )
}

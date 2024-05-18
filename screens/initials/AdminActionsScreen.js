import * as React from 'react';
import {useEffect, useState} from 'react';
import {Image, Pressable, RefreshControl, ScrollView, Text, TextInput, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import fetchApi from '../../components/fetchApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as DateFunctions from "../../components/functions/DateFunctions";
import styles from "../../assets/styles";
import * as SportFunctions from "../../components/functions/SportFunctions";

export default function AdminActionsScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selectedValue1, setSelectedValue1] = useState('standard');
    const [selectedValue2, setSelectedValue2] = useState('standard');
    const [teamNames, setTeamNames] = useState('');
    const [teamNamesSplit, setTeamNamesSplit] = useState([]);

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
                    <View style={styles.matchflexEventsView}>
                        <View style={{position: 'absolute', left: 0, top: 10}}>
                            <Pressable
                                style={[styles.button1, styles.buttonConfirm, styles.buttonGreen, {width: 120}]}
                                onPress={() => loadScreenData()}>
                                <Icon name="reload" size={25}/>
                                <Text style={styles.textButton1}>neu laden</Text>
                            </Pressable>
                        </View>

                        <Text style={{fontSize: 32}}>{data.year.name}</Text>
                        <Text style={{fontSize: 26}}>{'Tag ' + data.year.settings.currentDay_id}</Text>
                        <Text
                            style={{fontSize: 18}}>{DateFunctions.getDateFormatted(data.year.day)}</Text>
                        <Text style={{fontSize: 32}}>{'\u27F1'}</Text>
                        {data.object.teamYearsCount === 0 ?
                            <View>
                                <Text>Teams anlegen:</Text>
                                {teamNamesSplit.length !== data.year.teamsCount ?
                                    <View>
                                        {teamNames.split('\n').length !== data.year.teamsCount ?
                                            <Text>{teamNames.split('\n').length} => {data.year.teamsCount}</Text>
                                            :
                                            <Pressable style={[styles.button1, styles.buttonGreen]}
                                                       onPress={() => checkTeamNames()}>
                                                <Text style={styles.textButton1}>Team-Namen überprüfen</Text>
                                            </Pressable>
                                        }
                                        <TextInput
                                            multiline
                                            numberOfLines={data.year.teamsCount}
                                            style={[styles.textInput]}
                                            onChangeText={(value) => setTeamNames(value)}
                                        />
                                    </View>
                                    :
                                    <View>
                                        {[...Array(data.year.teamsCount)].map((e, i) =>
                                            <View key={i}>
                                                <Text style={styles.textGreen}>
                                                    <TextInput style={[styles.textInput]}
                                                               value={teamNamesSplit[i]['name'] || ''}/>
                                                    {teamNamesSplit[i]['team_id'] > 0 ? ' \u2714'
                                                        :
                                                        <Pressable style={[styles.button1, styles.buttonGreen]}
                                                                   onPress={() => addTeamName(teamNamesSplit[i]['name'], i)}>
                                                            <Text style={styles.textButton1}>anlegen</Text>
                                                        </Pressable>
                                                    }
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                }
                                {countTeamsFound() === data.year.teamsCount ?
                                    <Pressable style={[styles.button1, styles.buttonGreen]}
                                               onPress={() => insertTeamYears()}>
                                        <Text style={styles.textButton1}>Teams im aktuellen Jahr anlegen</Text>
                                    </Pressable>
                                    : null}
                            </View>
                            :
                            <View>
                                <Text>Teams im aktuellen Jahr angelegt: {data.object.teamYearsCount}
                                    {data.object.teamYearsCount === data.year.teamsCount ?
                                        <Text style={styles.textGreen}> {'\u2714'}</Text> : null}
                                </Text>
                                <Text>Team-PINs angelegt: {data.object.teamYearsPins}
                                    {data.object.teamYearsPins === data.object.teamYearsCount ?
                                        <Text style={styles.textGreen}> {'\u2714'}</Text> : null}
                                </Text>
                            </View>
                        }

                        <Text style={{fontSize: 32}}>{'\u27F1'}</Text>
                        <Text>Gruppen angelegt: {data.object.groupsCount}
                            {data.object.groupsCount > 0 ?
                                <Text style={styles.textGreen}> {'\u2714'}</Text> : null}
                        </Text>
                        {data.object.groupsCount === 0 && data.object.teamYearsCount === data.year.teamsCount ?
                            <View>
                                <Pressable style={[styles.button1, styles.buttonGreen]}
                                           onPress={() => adminAction('groups/addAll', '')}>
                                    <Text style={styles.textButton1}>Gruppen
                                        anlegen</Text>
                                </Pressable>
                            </View> : null}

                        <Text style={{fontSize: 32}}>{'\u27F1'}</Text>

                        <Text>Teams in Gruppen gelegt: {data.object.groupTeamsCount}
                            {data.object.groupTeamsCount === data.year.teamsCount ?
                                <Text style={styles.textGreen}> {'\u2714'}</Text> : null}
                        </Text>
                        {data.object.groupTeamsCount === 0 && data.object.groupsCount > 0 ?
                            <View>
                                <Pressable style={[styles.button1, styles.buttonGreen]}
                                           onPress={() => adminAction('groupTeams/addAll', '')}>
                                    <Text style={styles.textButton1}>Teams in Gruppen
                                        legen</Text>
                                </Pressable>
                            </View> : null}

                        <Text style={{fontSize: 32}}>{'\u27F1'}</Text>
                        {data.year.settings.currentDay_id === 1 && data.object.matchesCount === 0 && data.object.groupTeamsCount === data.year.teamsCount ?
                            <View>
                                <Text>Nur Tag 1: Gruppenzuordnung der Teams sortieren:</Text>
                                <View>
                                    <Picker
                                        selectedValue={selectedValue1}
                                        onValueChange={(itemValue) => setSelectedValue1(itemValue)}
                                        style={[styles.button1, styles.pickerSelect]}
                                    >
                                        <Picker.Item label="Standard (groupTeamsId / Excel-Skript)"
                                                     value="standard"/>
                                        <Picker.Item label="nach Ranglistenpunkte/Jahr und Zufall" value="random"/>
                                    </Picker>
                                    <Pressable style={[styles.button1, styles.buttonGreen]}
                                               onPress={() => adminAction('groups/sortAfterAddAllGroupTeams', selectedValue1)}>
                                        <Text style={styles.textButton1}>Los!</Text>
                                    </Pressable>
                                </View>
                                <Text>{data.avgRankingPointsPerYear !== undefined ?
                                    <Text>Durchschnittsranglistenpunkte Gr.
                                        {Object.entries(data.avgRankingPointsPerYear).map(([key, val]) => (
                                            <Text key={key}>{key}: {val}   </Text>
                                        ))}</Text> : null}</Text>
                            </View>
                            :
                            (data.object.matchesCount === 0 ?
                                    <Text>Gruppenzuordnungen sortieren</Text>
                                    :
                                    <Text>Gruppenzuordnungen sortiert<Text
                                        style={styles.textGreen}> {'\u2714'}</Text></Text>
                            )
                        }

                        <Text style={{fontSize: 32}}>{'\u27F1'}</Text>
                        {data.object.matchesCount === 0 && data.object.groupTeamsCount === data.year.teamsCount ?
                            <View>
                                <Text>Platzziffern an Teams verteilen:</Text>
                                <View>
                                    <Picker
                                        selectedValue={selectedValue2}
                                        onValueChange={(itemValue) => setSelectedValue2(itemValue)}
                                        style={[styles.button1, styles.pickerSelect]}
                                    >
                                        <Picker.Item label="initial" value="initial"/>
                                        <Picker.Item label="Standard, wie Excel-Skript" value="standard"/>
                                        <Picker.Item label="ranking" value="ranking"/>
                                        <Picker.Item label="random" value="random"/>
                                    </Picker>
                                    <Pressable style={[styles.button1, styles.buttonGreen]}
                                               onPress={() => adminAction('groupTeams/sortPlaceNumberAfterAddAll', selectedValue2)}>
                                        <Text style={styles.textButton1}>Los!</Text>
                                    </Pressable>
                                </View>
                                <Text>{data.avgOpponentRankingPointsPerYear ?
                                    <Text>Durchschnittsranglistenpunkte der Gegner in Gruppe
                                        {Object.entries(data.avgOpponentRankingPointsPerYear).map(([key, val]) => (
                                            <Text key={key}>{'\n' + key}: {Object.entries(val).map(([k, v]) => (
                                                <Text
                                                    key={k}>{k}: {v}   </Text>))}</Text>
                                        ))}</Text> : null}</Text>
                                <Text>{data.year.settings.currentDay_id === 2 && data.avgOpponentPrevDayRanking ?
                                    <Text>{'\n'}Durchschnittsvortagesplatz der Gegner in Gruppe
                                        {Object.entries(data.avgOpponentPrevDayRanking).map(([key, val]) => (
                                            <Text key={key}>{'\n' + key}: {Object.entries(val).map(([k, v]) => (
                                                <Text
                                                    key={k}>{k}: {v}   </Text>))}</Text>
                                        ))}</Text> : null}</Text>
                                <Text>{data.countDoubleMatches ?
                                    <Text>{'\n'}Gleiche Paarungen wie zuvor:
                                        {Object.entries(data.countDoubleMatches).map(([key, val]) => (
                                            <Text key={key}>{'\n' + key}: {val}</Text>
                                        ))}</Text> : null}</Text>
                            </View>
                            :
                            (data.object.matchesCount === 0 ?
                                    <Text>Platzziffern an Teams verteilen</Text>
                                    :
                                    <Text>Platzziffern an Teams verteilt<Text
                                        style={styles.textGreen}> {'\u2714'}</Text></Text>
                            )
                        }

                        {data.year.settings.isTest === 1 && data.object.matchesCount > 0 && data.object.matchResultCount === 0 ?
                            <View style={{position: 'absolute', right: 0}}>
                                <Pressable style={[styles.button1, styles.buttonRed]}
                                           onPress={() => adminAction('years/clearMatchesAndLogs', '')}>
                                    <Text style={styles.textButton1}>Testmodus:
                                        Alle Spiele{'\n'}und Matchlogs löschen</Text>
                                </Pressable>
                            </View> : null}
                        <Text style={{fontSize: 32}}>{'\u27F1'}</Text>
                        <Text>Spiele angelegt: {data.object.matchesCount}
                            {data.object.matchesCount === data.year.teamsCount * 4 ?
                                <Text style={styles.textGreen}> {'\u2714'}</Text> : null}
                        </Text>
                        <Text>Spiel-PINs angelegt: {data.object.matchesPins}
                            {data.object.matchesPins === data.object.matchesCount ?
                                <Text style={styles.textGreen}> {'\u2714'}</Text> : null}
                        </Text>
                        <Text>Spiele je
                            Team: {data.object.minMatchesByTeam} - {data.object.maxMatchesByTeam} (min/max)
                            {data.object.minMatchesByTeam === data.object.maxMatchesByTeam ?
                                <Text style={styles.textGreen}> {'\u2714'}</Text> : null}
                        </Text>

                        {data.object.matchesCount === 0 && data.object.groupTeamsCount === data.year.teamsCount ?
                            <View>
                                <Pressable style={[styles.button1, styles.buttonGreen]}
                                           onPress={() => adminAction('matches/addAllFromSchedulingPattern', '')}>
                                    <Text style={styles.textButton1}>Spiele analog
                                        Rasterspielplan anlegen</Text>
                                </Pressable>
                            </View>
                            : null}

                        {data.object.matchesCount > data.object.matchResultCount ?
                            <Text style={{fontSize: 32}}>{'\u27F1'}</Text>
                            : null}
                        {data.object.matchesCount > data.object.matchResultCount ?
                            <Text>Fehlende SR: {data.object.missingRefereesCount}
                                {data.object.missingRefereesCount === 0 ?
                                    <Text style={styles.textGreen}> {'\u2714'}</Text>
                                    : <Text style={styles.textRed}> {'\u2762'}</Text>
                                }
                            </Text>
                            : null}
                        {data.object.matchesCount > data.object.matchResultCount && data.object.matchesRefChangeable.length > 0 ?
                            <View><Text style={{fontSize: 26}}>Fehlende SR von abgesagten Spielen besetzen:</Text>
                                {Object.entries(data.object.matchesRefChangeable).map(([key, val]) => (
                                    <Pressable key={key} style={[styles.button1, styles.buttonGrey]}
                                               onPress={() => adminAction('matches/changeReferees', val[0].id + '/' + val[1].id)}>
                                        <Text>
                                            <Text style={styles.textRed}>
                                                {val[0].group_name + val[0].round_id + ': '}
                                                <Image
                                                    style={styles.sportImage}
                                                    source={SportFunctions.getSportImage(val[0].sport.code)}
                                                />
                                                {val[0].sport.code + ' - ' + val[0].teams3.name}
                                            </Text>
                                            {' <=> ' + val[1].group_name + val[1].round_id + ': '}
                                            <Image
                                                style={styles.sportImage}
                                                source={SportFunctions.getSportImage(val[1].sport.code)}
                                            />
                                            {val[1].sport.code + ' - ' + val[1].teams3.name}
                                        </Text>
                                    </Pressable>
                                ))}

                            </View> : null}
                        {data.year.settings.currentDay_id > 1 && data.object.matchesCount > data.object.matchResultCount ?
                            <Text>Abgesagte Spiele wg. 1 fehlenden Team: {data.object.matchesWith1CanceledCount}
                                {data.object.matchesWith1CanceledCount === 0 ?
                                    <Text style={styles.textGreen}> {'\u2714'}</Text>
                                    : <Text style={styles.textRed}> {'\u2762'}</Text>}
                            </Text> : null}
                        {data.year.settings.currentDay_id > 1 && data.object.matchesCount > data.object.matchResultCount && data.object.matchesTeamsChangeable.length > 0 && data.object.matchesRefChangeable.length === 0 ?
                            <View><Text style={{fontSize: 26}}>Abgesagte Spiele - Teams tauschen:</Text>
                                {Object.entries(data.object.matchesTeamsChangeable).map(([key, val]) => (
                                    <Pressable key={key} style={[styles.button1, styles.buttonGrey]}
                                               onPress={() => adminAction('matches/changeTeams', val[0].id + '/' + val[1].id)}>
                                        <Text>
                                            <Text style={styles.textRed}>
                                                {val[0].group_name + val[0].round_id + ': '}
                                                <Image
                                                    style={styles.sportImage}
                                                    source={SportFunctions.getSportImage(val[0].sport.code)}
                                                />
                                                {val[0].sport.code + ' - ' + (val[0].canceled === 1 ? val[0].teams1.name : val[0].teams2.name)}
                                            </Text>
                                            {' <=> ' + val[1].group_name + val[1].round_id + ': '}
                                            <Image
                                                style={styles.sportImage}
                                                source={SportFunctions.getSportImage(val[1].sport.code)}
                                            />
                                            {val[1].sport.code + ' - ' + (val[1].canceled === 1 ? val[1].teams2.name : val[1].teams1.name)}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View> : null}

                        {data.object.matchesCount > data.object.matchResultCount ?
                            <Text style={{fontSize: 32}}>Spielbetrieb läuft!</Text>
                            : null}
                        {data.object.matchesCount > data.object.matchResultCount ?
                            <View style={styles.matchflexRowView}>
                                <View style={[styles.viewStatus, {flex: 1}]}>
                                    <Pressable style={[styles.button1, styles.buttonGreyDark]}
                                               onPress={() => downloadPdf('teamYears/pdfAllTeamsMatches')}>
                                        <Text style={styles.textButton1}><Icon name="file-pdf-box"
                                                                               size={25}/>Pdf-Download:{'\n'}Alle
                                            Team-Spielpläne </Text>
                                    </Pressable>
                                </View>
                                <View style={[styles.viewStatus, {flex: 1}]}>
                                    <Pressable style={[styles.button1, styles.buttonGrey]}
                                               onPress={() => downloadPdf('teamYears/pdfAllTeamsMatchesWithGroupMatches/0')}>
                                        <Text style={styles.textButton1}><Icon name="file-pdf-box"
                                                                               size={25}/>Pdf-Download:{'\n'}Alle
                                            Team-Spielpläne{'\n'}+alle Gr.Spiele Teil 1</Text>
                                    </Pressable>
                                </View>
                                <View style={[styles.viewStatus, {flex: 1}]}>
                                    <Pressable style={[styles.button1, styles.buttonGrey]}
                                               onPress={() => downloadPdf('teamYears/pdfAllTeamsMatchesWithGroupMatches/1')}>
                                        <Text style={styles.textButton1}><Icon name="file-pdf-box"
                                                                               size={25}/>Pdf-Download:{'\n'}Alle
                                            Team-Spielpläne{'\n'}+alle Gr.Spiele Teil 2</Text>
                                    </Pressable>
                                </View>
                            </View>
                            : null}

                        {data.object.matchesCount > 0 ?
                            <View style={styles.matchflexRowView}>
                                <View style={[styles.viewStatus, {flex: 1}]}>
                                    {data.object.matchesCount > data.object.matchResultCount ?
                                        <Pressable style={[styles.button1, styles.buttonGreyBright]}
                                                   onPress={() => downloadPdf('sports/pdfAllFieldsMatches')}>
                                            <Text style={styles.textButton1}><Icon name="file-pdf-box"
                                                                                   size={25}/>Pdf-Download:{'\n'}Alle
                                                Feld-Spielpläne </Text>
                                        </Pressable>
                                        : null}
                                </View>
                                <View style={[styles.viewStatus, {flex: 1}]}>
                                    <Pressable style={[styles.button1, styles.buttonGreyDark]}
                                               onPress={() => downloadPdf('groupTeams/pdfAllRankings')}>
                                        <Text style={styles.textButton1}><Icon name="file-pdf-box"
                                                                               size={25}/>Pdf-Download:{'\n'}Alle
                                            Tabellen
                                        </Text>
                                    </Pressable>
                                </View>
                                <View style={[styles.viewStatus, {flex: 1}]}>
                                    <Pressable style={[styles.button1, styles.buttonGreyDark]}
                                               onPress={() => downloadPdf('matches/pdfMatchesByGroup')}>
                                        <Text style={styles.textButton1}><Icon name="file-pdf-box"
                                                                               size={25}/>Pdf-Download:{'\n'}Alle
                                            Gruppen-Spielpläne </Text>
                                    </Pressable>
                                </View>
                            </View>
                            : null}

                        <Text style={{fontSize: 32}}>{'\u27F1'}</Text>
                        <Text>Spiele
                            gewertet: {data.object.matchResultCount} / {data.object.sumCalcMatchesGroupTeams} (matchResultCount
                            / sumCalcMatchesGroupTeams)
                            {data.object.matchesCount === data.object.matchResultCount && data.object.matchResultCount > 0 ?
                                <Text style={styles.textGreen}> {'\u2714'}</Text> : null}
                        </Text>
                        {data.year.settings.isTest === 1 && data.object.matchesCount > data.object.matchResultCount ?
                            <View>
                                <Pressable style={[styles.button1, styles.buttonGreen]}
                                           onPress={() => adminAction('matcheventLogs/insertTestLogs', '')}>
                                    <Text style={styles.textButton1}>Testmodus:
                                        Zufällig geloggte Tore eintragen</Text>
                                </Pressable>
                                <Pressable style={[styles.button1, styles.buttonGreen]}
                                           onPress={() => adminAction('matches/insertTestResults', '')}>
                                    <Text style={styles.textButton1}>Testmodus:
                                        Zufallszahlen als bestätigte Spielergebnisse eintragen</Text>
                                </Pressable>
                            </View> : null}

                        <Text style={{fontSize: 32}}>{'\u27F1'}</Text>
                        {data.object.matchesCount > 0 && data.object.matchesCount === data.object.matchResultCount && !data.year.settings.alwaysAutoUpdateResults ?
                            <View>
                                <Pressable style={[styles.button1, styles.buttonGreen]}
                                           onPress={() => adminAction('years/setAlwaysAutoUpdateResults', '')}>
                                    <Text style={styles.textButton1}>Ergebnisse und Tabellen freischalten{'\n'}(mit
                                        Tabellen-Neuberechnung)</Text>
                                </Pressable>
                            </View>
                            :
                            <View>
                                {data.object.matchesCount > 0 && data.object.matchesCount === data.object.matchResultCount ?
                                    <Text>Ergebnisse und Tabellen freigeschaltet<Text
                                        style={styles.textGreen}> {'\u2714'}</Text></Text>
                                    :
                                    <Text>Ergebnisse und Tabellen freischalten</Text>
                                }
                            </View>
                        }

                        <Text style={{fontSize: 32}}>{'\u27F1'}</Text>
                        {data.object.matchesCount > 0 ?
                            <View>
                                <Pressable style={[styles.button1, styles.buttonGreen]}
                                           onPress={() => adminAction('years/reCalcRanking', '')}>
                                    <Text style={styles.textButton1}>Optional: Tabellen neu berechnen</Text>
                                </Pressable>
                            </View>
                            :
                            <Text>Tabellen neu berechnen</Text>
                        }

                        <Text style={{fontSize: 32}}>{'\u27F1'}</Text>
                        {data.object.matchesCount > 0 && data.object.matchesCount === data.object.matchResultCount && data.year.settings.alwaysAutoUpdateResults ?
                            <View>
                                {data.year.settings.currentDay_id === data.year.daysCount ?
                                    <View>
                                        <Pressable style={[styles.button1, styles.buttonGreen]}
                                                   onPress={() => adminAction('teamYears/setEndRanking', '')}>
                                            <Text style={styles.textButton1}>Jahres-Endtabelle erstellen</Text>
                                        </Pressable>
                                        {data.object.teamYearsEndRankingCount > 0 && data.object.teamYearsEndRankingCount === data.object.teamYearsCount ?
                                            <View>
                                                <Text>Jahres-Endtabelle erstellt<Text
                                                    style={styles.textGreen}> {'\u2714'}</Text></Text>
                                                <Pressable
                                                    style={[styles.button1, styles.buttonConfirm, styles.buttonGreen]}
                                                    onPress={() => navigation.navigate('TeamYearsEndRankingAdmin', {
                                                        item: {
                                                            year_id: data.year.id,
                                                            year_name: data.year.name
                                                        }
                                                    })}>
                                                    <Text style={styles.textButton1}>Jahres-Endtabelle
                                                        aufrufen</Text>
                                                </Pressable>
                                                <Pressable style={[styles.button1, styles.buttonGreyDark]}
                                                           onPress={() => downloadPdf('teamYears/pdfEndRanking')}>
                                                    <Text style={styles.textButton1}><Icon name="file-pdf-box"
                                                                                           size={25}/>Pdf-Download:{'\n'}Jahres-Endtabelle</Text>
                                                </Pressable>
                                            </View> : null}
                                    </View> : null}
                                {data.year.settings.currentDay_id < data.year.daysCount ?
                                    <View>
                                        <Text>Spielbetrieb beendet!</Text>
                                        <Pressable style={[styles.button1, styles.buttonGreen]}
                                                   onPress={() => adminAction('years/setCurrentDayIncrement', '')}>
                                            <Text style={styles.textButton1}>Umstellen auf
                                                Tag {data.year.settings.currentDay_id + 1}</Text>
                                        </Pressable>
                                    </View> : null}
                            </View>
                            :
                            <View>
                                {data.year.settings.currentDay_id === data.year.daysCount ?
                                    <Text>Jahres-Endtabelle erstellen</Text> : null}
                                {data.year.settings.currentDay_id < data.year.daysCount ?
                                    <Text>Umstellen auf
                                        Tag {data.year.settings.currentDay_id + 1}</Text> : null}
                            </View>
                        }

                        {data.year.settings.currentDay_id === data.year.daysCount ?
                            <Text style={{fontSize: 32}}>{'\u27F1'}</Text>
                            : null}
                        {data.year.settings.currentDay_id === data.year.daysCount ?
                            <View>
                                {data.object.teamYearsEndRankingCount > 0 && data.object.teamYearsEndRankingCount === data.object.teamYearsCount ?
                                    (data.year.settings.showEndRanking ?
                                            <Pressable style={[styles.button1, styles.buttonRed]}
                                                       onPress={() => adminAction('years/showEndRanking', 0)}>
                                                <Text style={styles.textButton1}>Tabellen und Jahres-Endtabelle
                                                    sperren</Text>
                                            </Pressable>
                                            :
                                            <Pressable style={[styles.button1, styles.buttonGreen]}
                                                       onPress={() => adminAction('years/showEndRanking', 1)}>
                                                <Text style={styles.textButton1}>Tabellen und Jahres-Endtabelle
                                                    freigeben</Text>
                                            </Pressable>
                                    )
                                    :
                                    <Text>Tabellen und Jahres-Endtabelle freigeben</Text>
                                }
                            </View>
                            : null}


                        <Text style={{fontSize: 32}}>{'\u27F1'}</Text>
                        {data.year.settings.isTest === 1 ?
                            <View>
                                <Pressable style={[styles.button1, styles.buttonRed]}
                                           onPress={() => adminAction('years/clearTest', '')}>
                                    <Text style={styles.textButton1}>Testmodus:
                                        Alle Testdaten löschen</Text>
                                </Pressable>
                            </View> : null}
                    </View>
                ) : <Text>Fehler!</Text>)}
        </ScrollView>
    )
}

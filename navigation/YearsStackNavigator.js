import * as React from 'react';

import YearsAllScreen from '../screens/years/YearsAllScreen';
import TeamsAllTimeRankingScreen from '../screens/years/TeamsAllTimeRankingScreen';
import TeamYearsEndRankingScreen from '../screens/years/TeamYearsEndRankingScreen';
import TeamYearsInfoScreen from '../screens/years/TeamYearsInfoScreen';
import TeamYearsInfoBalanceScreen from '../screens/years/TeamYearsInfoBalanceScreen';
import TeamYearsInfoBalanceMatchesScreen from "../screens/years/TeamYearsInfoBalanceMatchesScreen";

import GroupsAllScreen from "../screens/initials/GroupsAllScreen";
import RankingInGroupsScreen from "../screens/matches/RankingInGroupsScreen";
import ListMatchesByTeamScreen from "../screens/matches/ListMatchesByTeamScreen";
import ListMatchesByGroupScreen from "../screens/matches/ListMatchesByGroupScreen";
import MatchDetailsScreen from "../screens/matches/MatchDetailsScreen";

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as DateFunctions from "../components/functions/DateFunctions";

const Stack = createNativeStackNavigator();

export default function YearsStackNavigator({navigation}) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="YearsAll"
                component={YearsAllScreen}
                options={{title: 'Archiv'}}
            />
            <Stack.Screen
                name="TeamsAllTimeRanking"
                component={TeamsAllTimeRankingScreen}
                options={{title: 'Ewige Tabelle'}}
            />
            <Stack.Screen
                name="TeamYearsEndRanking"
                component={TeamYearsEndRankingScreen}
                options={({route}) => ({
                    title: 'Endtabelle ' + route.params.item.year_name,
                })}
            />
            <Stack.Screen
                name="TeamYearsInfo"
                component={TeamYearsInfoScreen}
                options={({route}) => ({
                    title: 'Team-Infos ' + route.params.item.team_name,
                })}
            />
            <Stack.Screen
                name="TeamYearsInfoBalance"
                component={TeamYearsInfoBalanceScreen}
                options={({route}) => ({
                    title: 'Team-Bilanz ' + route.params.team.team_name,
                })}
            />
            <Stack.Screen
                name="TeamYearsInfoBalanceMatches"
                component={TeamYearsInfoBalanceMatchesScreen}
                options={({route}) => ({
                    title: 'Team-Bilanz: Spiele im ' + route.params.sport.name,
                })}
            />

            <Stack.Screen
                name="GroupsAll"
                component={GroupsAllScreen}
                options={{title: 'Archiv: Alle Gruppen'}}
            />
            <Stack.Screen
                name="RankingInGroups"
                component={RankingInGroupsScreen}
                options={({route}) => ({
                    title: 'Archiv: Tabelle der Gruppe ' + route.params.item.group_name,
                })}
            />
            <Stack.Screen
                name="ListMatchesByGroup"
                component={ListMatchesByGroupScreen}
                options={({route}) => ({
                    title: 'Archiv: Spiele der Gruppe ' + route.params.item.group_name,
                })}
            />
            <Stack.Screen
                name="ListMatchesByTeam"
                component={ListMatchesByTeamScreen}
                options={({route}) => ({
                    title: 'Archiv:  Spiele des Teams ' + route.params.item.team.name,
                })}
            />
            <Stack.Screen
                name="MatchDetails"
                component={MatchDetailsScreen}
                options={({route}) => ({
                    title: 'Archiv: ' +
                        DateFunctions.getFormatted(route.params.item.matchStartTime) +
                        ' Uhr: ' +
                        route.params.item.sport.name +
                        ' Gruppe ' +
                        route.params.item.group_name,
                })}
            />
        </Stack.Navigator>
    );
}

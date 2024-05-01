import * as React from 'react';
import RoundsCurrentScreen from '../screens/rounds/RoundsCurrentScreen';
import RoundsMatchesScreen from '../screens/rounds/RoundsMatchesScreen';
import RoundsMatchesManagerScreen from "../screens/rounds/RoundsMatchesManagerScreen";
import ListMatchesByRefereeCanceledTeamsScreen from '../screens/matches/ListMatchesByRefereeCanceledTeamsScreen';
import RankingRefereeSubstScreen from '../screens/matches/RankingRefereeSubstScreen';
import MatchDetailsScreen from "../screens/matches/MatchDetailsScreen";
import AutoPilotSupervisorScreen from "../screens/matches/AutoPilotSupervisorScreen";

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as DateFunctions from "../components/functions/DateFunctions";

const Stack = createNativeStackNavigator();

export default function SupervisorStackNavigator({navigation}) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'thistle',
                },
                headerBackTitleVisible: false
            }}>
            <Stack.Screen
                name="RoundsCurrentSupervisor"
                component={RoundsCurrentScreen}
                options={{title: 'Aktuelle Spielrunden'}}
            />
            <Stack.Screen
                name="RoundsMatchesSupervisor"
                component={RoundsMatchesScreen}
                options={({route}) => ({
                    title: 'Spiele der Runde ' + route.params.id,
                })}
            />
            <Stack.Screen
                name="RoundsMatchesManager"
                component={RoundsMatchesManagerScreen}
                options={{title: 'Aktuelle Spielrunde: Manager'}}
            />
            <Stack.Screen
                name="ListMatchesByRefereeCanceledTeamsSupervisor"
                component={ListMatchesByRefereeCanceledTeamsScreen}
                options={{title: 'Fehlende SR'}}
            />
            <Stack.Screen
                name="RankingRefereeSubstSupervisor"
                component={RankingRefereeSubstScreen}
                options={{title: 'Ersatz-SR-Rangliste'}}
            />
            <Stack.Screen
                name="MatchDetailsSupervisor"
                component={MatchDetailsScreen}
                options={({route}) => ({
                    title:
                        DateFunctions.getFormatted(route.params.item.matchStartTime) +
                        ' Uhr: ' +
                        route.params.item.sport.name +
                        ' Gr. ' +
                        route.params.item.group_name,
                })}
            />
            <Stack.Screen
                name="AutoPilotSupervisor"
                component={AutoPilotSupervisorScreen}
                options={{title: 'Supervisor Auto-Pilot'}}
            />
        </Stack.Navigator>
    );
}

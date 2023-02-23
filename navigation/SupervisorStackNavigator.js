import * as React from 'react';
import RoundsCurrentScreen from '../screens/rounds/RoundsCurrentScreen';
import RoundsMatchesScreen from '../screens/rounds/RoundsMatchesScreen';
import ListMatchesByRefereeCanceledTeamsScreen from '../screens/matches/ListMatchesByRefereeCanceledTeamsScreen';
import RankingRefereeSubstScreen from '../screens/matches/RankingRefereeSubstScreen';
import AutoPilotSupervisorScreen from "../screens/matches/AutoPilotSupervisorScreen";

import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function SupervisorStackNavigator({navigation}) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'thistle',
                },
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
                name="AutoPilotSupervisor"
                component={AutoPilotSupervisorScreen}
                options={{title: 'Supervisor Auto-Pilot'}}
            />
        </Stack.Navigator>
    );
}

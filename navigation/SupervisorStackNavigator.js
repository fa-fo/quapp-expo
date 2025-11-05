import RoundsCurrentScreen from '../screens/rounds/RoundsCurrentScreen';
import RoundsMatchesScreen from '../screens/rounds/RoundsMatchesScreen';
import RoundsMatchesManagerScreen from "../screens/rounds/RoundsMatchesManagerScreen";
import ListMatchesByRefereeCanceledTeamsScreen from '../screens/matches/ListMatchesByRefereeCanceledTeamsScreen';
import RankingRefereeSubstScreen from '../screens/matches/RankingRefereeSubstScreen';
import MatchDetailsScreen from "../screens/matches/MatchDetailsScreen";
import AutoPilotSupervisorScreen from "../screens/matches/AutoPilotSupervisorScreen";

import {createStackNavigator} from '@react-navigation/stack';
import * as DateFunctions from "../components/functions/DateFunctions";

const Stack = createStackNavigator();

export default function SupervisorStackNavigator({navigation}) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'thistle',
                },
                headerBackButtonDisplayMode: 'minimal',
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
                    title: 'Runde ' + route.params.id,
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
                name="AutoPilotSupervisor"
                component={AutoPilotSupervisorScreen}
                options={{title: 'Supervisor Auto-Pilot'}}
            />
        </Stack.Navigator>
    );
}

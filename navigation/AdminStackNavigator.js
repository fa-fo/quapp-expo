import * as React from 'react';
import RoundsCurrentScreen from '../screens/rounds/RoundsCurrentScreen';
import RoundsMatchesScreen from '../screens/rounds/RoundsMatchesScreen';
import AdminActionsScreen from '../screens/initials/AdminActionsScreen';
import GroupsAllScreen from "../screens/initials/GroupsAllScreen";
import TeamsCurrentScreen from '../screens/initials/TeamsCurrentScreen';
import PushNotificationsScreen from "../screens/initials/PushNotificationsScreen";

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RankingInGroupsScreen from "../screens/matches/RankingInGroupsScreen";
import ListMatchesByTeamScreen from "../screens/matches/ListMatchesByTeamScreen";
import ListMatchesByGroupScreen from "../screens/matches/ListMatchesByGroupScreen";
import TeamYearsEndRankingScreen from "../screens/years/TeamYearsEndRankingScreen";

const Stack = createNativeStackNavigator();

export default function AdminStackNavigator({navigation}) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'violet',
                },
            }}>
            <Stack.Screen
                name="RoundsCurrentAdmin"
                component={RoundsCurrentScreen}
                options={{title: 'Admin: Spielrunden'}}
            />
            <Stack.Screen
                name="RoundsMatchesAdmin"
                component={RoundsMatchesScreen}
                options={({route}) => ({
                    title: 'Admin: Spiele der Runde ' + route.params.id,
                })}
            />
            <Stack.Screen
                name="AdminActions"
                component={AdminActionsScreen}
                options={{title: 'Admin: Aktionen'}}
            />
            <Stack.Screen
                name="TeamYearsEndRankingAdmin"
                component={TeamYearsEndRankingScreen}
                options={({route}) => ({
                    title: 'Admin: Endtabelle ' + route.params.item.year_name,
                })}
            />
            <Stack.Screen
                name="GroupsAllAdmin"
                component={GroupsAllScreen}
                options={{title: 'Admin: Gruppen am ' + global.currentDayName}}
            />
            <Stack.Screen
                name="RankingInGroupsAdmin"
                component={RankingInGroupsScreen}
                options={({route}) => ({
                    title: 'Admin: Tabelle der Gruppe ' + route.params.item.group_name,
                })}
            />
            <Stack.Screen
                name="ListMatchesByTeamAdmin"
                component={ListMatchesByTeamScreen}
                options={({route}) => ({
                    title: 'Admin: Spiele des Teams ' + (route.params?.item?.team?.name ?? ''),
                })}
            />
            <Stack.Screen
                name="ListMatchesByGroupAdmin"
                component={ListMatchesByGroupScreen}
                options={({route}) => ({
                    title: 'Admin: Spiele der Gruppe ' + route.params.item.group_name,
                })}
            />
            <Stack.Screen
                name="TeamsCurrentAdmin"
                component={TeamsCurrentScreen}
                options={{title: 'Admin: Teams am ' + global.currentDayName}}
            />
            <Stack.Screen
                name="PushNotifications"
                component={PushNotificationsScreen}
                options={{title: 'Admin: Push Notifications'}}
            />
        </Stack.Navigator>
    );
}

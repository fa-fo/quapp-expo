import ListMatchesByTeamScreen from '../screens/matches/ListMatchesByTeamScreen';
import RankingInGroupsScreen from '../screens/matches/RankingInGroupsScreen';
import ListMatchesByGroupScreen from '../screens/matches/ListMatchesByGroupScreen';
import MatchDetailsScreen from '../screens/matches/MatchDetailsScreen';
import MatchLogsScreen from '../screens/matches/MatchLogsScreen';
import GroupsAllScreen from '../screens/initials/GroupsAllScreen';
import RoundsCurrentScreen from '../screens/rounds/RoundsCurrentScreen';
import RoundsMatchesScreen from '../screens/rounds/RoundsMatchesScreen';
import TeamsCurrentScreen from '../screens/initials/TeamsCurrentScreen';
import ListMatchesByRefereeScreen from '../screens/matches/ListMatchesByRefereeScreen';
import AllMatchPhotosScreen from "../screens/matches/AllMatchPhotosScreen";
import ResourceContentScreen from "../screens/matches/ResourceContentScreen";
import SettingsScreen from "../screens/initials/SettingsScreen";
import NoInternetModalScreen from "../screens/initials/modals/NoInternetModalScreen";
import {createStackNavigator} from '@react-navigation/stack';
import * as DateFunctions from "../components/functions/DateFunctions";
import * as ColorFunctions from "../components/functions/ColorFunctions";

const Stack = createStackNavigator();

export default function MyMatchesStackNavigator({navigation}) {
    return (
        <Stack.Navigator
            initialRouteName={
                global.myTeamId === 0 ? (global.currentYear?.teamsCount > 24 ? 'GroupsAll' : 'RankingInGroups') : 'MyMatchesCurrent'
            }
            screenOptions={{
                headerStyle: {
                    backgroundColor: ColorFunctions.getColor('YellowBg'),
                },
                headerBackButtonDisplayMode: 'minimal',
            }}>
            <Stack.Screen
                name="MyMatchesCurrent"
                component={ListMatchesByTeamScreen}
                options={{title: 'Meine Spiele ' + (global.currentDayName ? 'am ' + global.currentDayName : '')}}
            />
            <Stack.Screen
                name="RankingInGroups"
                component={RankingInGroupsScreen}
                options={({route}) => ({
                    title: 'Tabelle der Gr. ' + (route.params?.item?.group_name ?? 'A'),
                })}
            />
            <Stack.Screen
                name="ListMatchesByTeam"
                component={ListMatchesByTeamScreen}
                options={({route}) => ({
                    title: 'Spiele des Teams ' + (route.params?.item?.team?.name ?? ''),
                })}
            />
            <Stack.Screen
                name="ListMatchesByGroup"
                component={ListMatchesByGroupScreen}
                options={({route}) => ({
                    title: 'Spiele der Gr. ' + (route.params?.item?.group_name ?? 'A'),
                })}
            />
            <Stack.Screen
                name="MatchDetails"
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
                name="MatchLogs"
                component={MatchLogsScreen}
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
                name="GroupsAll"
                component={GroupsAllScreen}
                options={{title: 'Alle Gruppen'}}
            />
            <Stack.Screen
                name="RoundsCurrent"
                component={RoundsCurrentScreen}
                options={{title: 'Alle Spielrunden'}}
            />
            <Stack.Screen
                name="RoundsMatches"
                component={RoundsMatchesScreen}
                options={({route}) => ({
                    title: 'Runde ' + route.params.id,
                })}
            />
            <Stack.Screen
                name="TeamsCurrent"
                component={TeamsCurrentScreen}
                options={{title: 'Teams am ' + global.currentDayName}}
            />
            <Stack.Screen
                name="ListMatchesByReferee"
                component={ListMatchesByRefereeScreen}
                options={{title: 'SR-Spielsuche'}}
            />
            <Stack.Screen
                name="AllMatchPhotos"
                component={AllMatchPhotosScreen}
                options={{title: 'Fotos'}}
            />
            <Stack.Screen
                name="ResourceContent"
                component={ResourceContentScreen}
                options={({route}) => ({
                    title: route.params.title
                })}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={({route}) => ({
                    title: 'Einstellungen'
                })}
            />
            <Stack.Screen
                name="NoInternetModal"
                component={NoInternetModalScreen}
                options={{title: 'Keine Verbindung', presentation: 'modal'}}
            />
        </Stack.Navigator>
    );
}

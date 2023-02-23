import * as React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';
import {useWindowDimensions} from 'react-native';
import MyMatchesStackNavigator from "./MyMatchesStackNavigator";
import YearsStackNavigator from "./YearsStackNavigator";
import SupervisorStackNavigator from "./SupervisorStackNavigator";
import AdminStackNavigator from "./AdminStackNavigator";

const Drawer = createDrawerNavigator();

export default function MyDrawer() {
    const dimensions = useWindowDimensions();
    let title = 'QuattFo ' + global.currentYearName;

    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
            }}>
            <Drawer.Screen
                name="MyMatches"
                component={MyMatchesStackNavigator}
                options={{title: title}}
            />
            <Drawer.Screen
                name="Years"
                component={YearsStackNavigator}
                options={{
                    title: 'QuattFo Historie',
                }}
            />
            <Drawer.Screen
                name="Supervisor"
                component={SupervisorStackNavigator}
                options={{
                    title: 'QuattFo Supervisor',
                }}
            />
            <Drawer.Screen
                name="Admin"
                component={AdminStackNavigator}
                options={{
                    title: 'QuattFo Admin',
                }}
            />
        </Drawer.Navigator>
)
    ;
}

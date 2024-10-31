import * as React from 'react';
import {Text, useWindowDimensions} from 'react-native';

import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';
import MyMatchesStackNavigator from "./MyMatchesStackNavigator";
import YearsStackNavigator from "./YearsStackNavigator";
import SupervisorStackNavigator from "./SupervisorStackNavigator";
import AdminStackNavigator from "./AdminStackNavigator";
import * as ColorFunctions from "../components/functions/ColorFunctions";
import styles from "../assets/styles";

const Drawer = createDrawerNavigator();

export default function MyDrawer() {
    const dimensions = useWindowDimensions();
    const title = () => {
        return <Text>
            {'QuattFo'}
            {window?.location?.hostname === 'localhost' ?
                <Text style={[styles.big22, styles.textRed]}> localhost</Text> : null}
        </Text>
    }

    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
                drawerStyle:
                    window?.location?.hostname === 'localhost' ? {
                        backgroundColor: ColorFunctions.getColor('RedLightBg'),
                    } : {},
            }}>
            <Drawer.Screen
                name="MyMatches"
                component={MyMatchesStackNavigator}
                options={{title: <Text>{title()} {global.currentYearName}</Text>}}
            />
            <Drawer.Screen
                name="Years"
                component={YearsStackNavigator}
                options={{
                    title: <Text>{title()} {'Historie'}</Text>,
                }}
            />
            <Drawer.Screen
                name="Supervisor"
                component={SupervisorStackNavigator}
                options={{
                    title: <Text>{title()} {'Supervisor'}</Text>,
                }}
            />
            <Drawer.Screen
                name="Admin"
                component={AdminStackNavigator}
                options={{
                    title: <Text>{title()} {'Admin'}</Text>,
                }}
            />
        </Drawer.Navigator>
    )
        ;
}

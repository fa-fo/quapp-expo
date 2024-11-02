import TextC from "../components/customText";
import {Pressable, useWindowDimensions} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';
import MyMatchesStackNavigator from "./MyMatchesStackNavigator";
import YearsStackNavigator from "./YearsStackNavigator";
import SupervisorStackNavigator from "./SupervisorStackNavigator";
import AdminStackNavigator from "./AdminStackNavigator";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ColorFunctions from "../components/functions/ColorFunctions";
import {style} from "../assets/styles";
import {useNavigation} from "@react-navigation/native";

const Drawer = createDrawerNavigator();

function HeaderLeft() {
    const navigation = useNavigation();

    const toggleMenu = () => {
        navigation.toggleDrawer();
    };

    return <Pressable onPress={() => toggleMenu()}>
        <Icon name="menu" size={40} style={{paddingHorizontal: 10}} color={ColorFunctions.getColor('primary')}/>
    </Pressable>;
}

export default function MyDrawer() {
    const dimensions = useWindowDimensions();
    const title = () => {
        return <TextC>
            {'QuattFo'}
            {window?.location?.hostname === 'localhost' ?
                <TextC style={[style().big22, style().textRed]}> localhost</TextC> : null}
        </TextC>
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
                headerLeft: () => <HeaderLeft/>
            }}>
            <Drawer.Screen
                name="MyMatches"
                component={MyMatchesStackNavigator}
                options={{title: <TextC>{title()} {global.currentYearName}</TextC>}}
            />
            <Drawer.Screen
                name="Years"
                component={YearsStackNavigator}
                options={{
                    title: <TextC>{title()} {'Historie'}</TextC>,
                }}
            />
            <Drawer.Screen
                name="Supervisor"
                component={SupervisorStackNavigator}
                options={{
                    title: <TextC>{title()} {'Supervisor'}</TextC>,
                }}
            />
            <Drawer.Screen
                name="Admin"
                component={AdminStackNavigator}
                options={{
                    title: <TextC>{title()} {'Admin'}</TextC>,
                }}
            />
        </Drawer.Navigator>
    )
        ;
}

import {useEffect, useState} from 'react';
import TextC from "../components/customText";
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {Image, Linking, Platform, Text, View} from 'react-native';
import {style} from '../assets/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from "expo-constants";
import * as ColorFunctions from "../components/functions/ColorFunctions";

export default function CustomDrawerContent(props) {
    const [currentYearId, setCurrentYearId] = useState(0);
    const [currentYearName, setCurrentYearName] = useState('');
    const [currentDayId, setCurrentDayId] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setCurrentYearId(global.currentYearId);
            setCurrentYearName(global.currentYearName);
            setCurrentDayId(global.settings?.currentDay_id ?? 0);
        }, 3000); // wait for first api request (global variables are set)
    }, [global.settings]);

    return (
        <DrawerContentScrollView {...props}>
            <View style={style().logoView}>
                <Image
                    style={style().logoImage}
                    source={require('../assets/images/logo.png')}
                />
            </View>
            <View style={style().drawerSectionView}>
                <TextC style={{marginLeft: 10}}>
                    {'QuattFo ' + (currentDayId > 0 ? currentYearName + ', Tag ' + currentDayId : '')}
                    {window?.location?.hostname === 'localhost' ?
                        <TextC style={[style().big22, style().textRed]}> localhost</TextC> : null}
                </TextC>
                <View style={style().separatorLine}/>
            </View>
            {global.myTeamId === 0 ? null
                :
                <DrawerItem
                    icon={() => <Icon name="exclamation-thick" size={25} style={style().yellowBg}/>}
                    label="Meine Spiele"
                    onPress={() =>
                        props.navigation.reset({
                            index: 0,
                            routes: [{name: 'MyMatches', screen: 'MyMatchesCurrent'}],
                        })
                    }
                />
            }
            <DrawerItem
                icon={() => <Icon name="timetable" size={25} color={ColorFunctions.getColor('primary')}/>}
                label="Alle Spielrunden"
                onPress={() =>
                    props.navigation.navigate('MyMatches', {screen: 'RoundsCurrent'})
                }
            />
            <DrawerItem
                icon={() => <Icon name="view-grid-outline" size={25} color={ColorFunctions.getColor('primary')}/>}
                label="Alle Gruppen"
                onPress={() =>
                    props.navigation.navigate('MyMatches', {screen: 'GroupsAll'})
                }
            />
            <DrawerItem
                icon={() => <Icon name="cpu-64-bit" size={25} color={ColorFunctions.getColor('primary')}/>}
                label="Alle Teams"
                onPress={() =>
                    props.navigation.navigate('MyMatches', {screen: 'TeamsCurrent'})
                }
            />
            {Platform.OS === 'web' && process?.env?.NODE_ENV !== 'development' ? null
                :
                (global.settings.useLiveScouting ?
                    <DrawerItem
                        icon={() => <Icon name="picture-in-picture-bottom-right" size={25}
                                          color={ColorFunctions.getColor('primary')}/>}
                        label="Fotos"
                        onPress={() =>
                            props.navigation.navigate('MyMatches', {screen: 'AllMatchPhotos'})
                        }
                    /> : null)
            }
            <DrawerItem
                icon={() => <Icon name="playlist-check" size={25} color={ColorFunctions.getColor('primary')}/>}
                label="Spielregeln"
                onPress={() =>
                    props.navigation.navigate('MyMatches', {
                        screen: 'ResourceContent',
                        params: {
                            resource_id: 16,
                            title: 'Spielregeln'
                        }
                    })
                }
            />
            <DrawerItem
                icon={() => <Icon name="food-fork-drink" size={25} color={ColorFunctions.getColor('primary')}/>}
                label="Speisekarte"
                onPress={() =>
                    props.navigation.navigate('MyMatches', {
                        screen: 'ResourceContent',
                        params: {
                            resource_id: 77,
                            title: 'Speisekarte'
                        }
                    })
                }
            />
            {currentDayId > 1 ?
                <DrawerItem
                    icon={() => <Icon name="history" size={25} color={ColorFunctions.getColor('primary')}/>}
                    label="Archiv Tag 1"
                    onPress={() => props.navigation.navigate('Years', {
                        screen: 'GroupsAll',
                        params: {
                            year_id: currentYearId,
                            day_id: (currentDayId - 1)
                        }
                    })}
                />
                : null}
            {global.settings.usePlayOff && global.settings.showEndRanking ?
                <DrawerItem
                    icon={() => <Icon name="table-large-plus" size={25} color={ColorFunctions.getColor('primary')}/>}
                    label="Endstand nach Play-Offs"
                    onPress={() => props.navigation.navigate('Years', {
                        screen: 'TeamYearsEndRanking',
                        params: {item: {year_id: currentYearId, year_name: currentYearName}}
                    })}
                />
                : null}
            {global.settings.showArchieve ?
                <View>
                    <View style={style().drawerSectionView}>
                        <TextC style={{marginLeft: 10}}>QuattFo Historie</TextC>
                        <View style={style().separatorLine}/>
                    </View>
                    <DrawerItem
                        icon={() => <Icon name="history" size={25} color={ColorFunctions.getColor('primary')}/>}
                        label="Archiv"
                        onPress={() => props.navigation.navigate('Years', {screen: 'YearsAll'})}
                    />
                    <DrawerItem
                        icon={() => <Icon name="table-star" size={25} color={ColorFunctions.getColor('primary')}/>}
                        label="Ewige Tabelle"
                        onPress={() =>
                            props.navigation.navigate('Years', {screen: 'TeamsAllTimeRanking'})
                        }
                    />
                </View> : null}
            <View>
                <View style={style().drawerSectionView}>
                    <View style={style().separatorLine}/>
                </View>
                <DrawerItem
                    icon={() => <Icon name="account-settings-outline" size={25}
                                      color={ColorFunctions.getColor('primary')}/>}
                    label="Einstellungen"
                    onPress={() => {
                        props.navigation.navigate('MyMatches', {screen: 'Settings'})
                    }}
                />
            </View>
            {global.supervisorPW === undefined ?
                null
                :
                <View>
                    <View style={style().drawerSectionView}>
                        <TextC style={{marginLeft: 10}}>Supervisor</TextC>
                        <View style={style().separatorLine}/>
                    </View>
                    <DrawerItem
                        icon={() => <Icon name="timetable" size={25} color={ColorFunctions.getColor('primary')}/>}
                        label="Supervisor Spielrunden"
                        onPress={() =>
                            props.navigation.navigate('Supervisor', {
                                screen: 'RoundsCurrentSupervisor',
                            })
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="phone-missed" size={25} color={ColorFunctions.getColor('primary')}/>}
                        label="Fehlende SR"
                        onPress={() =>
                            props.navigation.navigate('Supervisor', {
                                screen: 'ListMatchesByRefereeCanceledTeamsSupervisor',
                            })
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="clipboard-list-outline" size={25}
                                          color={ColorFunctions.getColor('primary')}/>}
                        label="Ersatz-SR-Rangliste"
                        onPress={() =>
                            props.navigation.navigate('Supervisor', {
                                screen: 'RankingRefereeSubstSupervisor',
                            })
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="refresh-auto" size={25} color={ColorFunctions.getColor('primary')}/>}
                        label="Supervisor Auto-Pilot"
                        onPress={() =>
                            props.navigation.navigate('Supervisor', {
                                screen: 'AutoPilotSupervisor',
                            })
                        }
                    />
                </View>
            }
            {global.adminPW === undefined ?
                null
                :
                <View>
                    <View style={style().drawerSectionView}>
                        <TextC style={{marginLeft: 10}}>Admin</TextC>
                        <View style={style().separatorLine}/>
                    </View>
                    <DrawerItem
                        icon={() => <Icon name="timetable" size={25} color={ColorFunctions.getColor('primary')}/>}
                        label="Admin Spielrunden"
                        onPress={() =>
                            props.navigation.navigate('Admin', {screen: 'RoundsCurrentAdmin'})
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="heart-flash" size={25} color={ColorFunctions.getColor('primary')}/>}
                        label="Admin Aktionen"
                        onPress={() =>
                            props.navigation.navigate('Admin', {screen: 'AdminActions'})
                        }
                    />
                    {global.settings.useLiveScouting ?
                        <DrawerItem
                            icon={() => <Icon name="picture-in-picture-bottom-right" size={25}
                                              color={ColorFunctions.getColor('primary')}/>}
                            label="Admin Fotos"
                            onPress={() =>
                                props.navigation.navigate('Admin', {screen: 'AdminMatchPhotos'})
                            }
                        /> : null}
                    {global.settings.useLiveScouting ?
                        <DrawerItem
                            icon={() => <Icon name="view-grid-outline" size={25}
                                              color={ColorFunctions.getColor('primary')}/>}
                            label="Admin Gruppen"
                            onPress={() =>
                                props.navigation.navigate('Admin', {screen: 'GroupsAllAdmin'})
                            }
                        /> : null}
                    <DrawerItem
                        icon={() => <Icon name="cpu-64-bit" size={25} color={ColorFunctions.getColor('primary')}/>}
                        label="Admin Teams"
                        onPress={() =>
                            props.navigation.navigate('Admin', {screen: 'TeamsCurrentAdmin'})
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="email-send-outline" size={25}
                                          color={ColorFunctions.getColor('primary')}/>}
                        label="Push Notifications"
                        onPress={() =>
                            props.navigation.navigate('Admin', {screen: 'PushNotifications'})
                        }
                    />
                </View>
            }
            <View style={style().drawerSectionView}>
                <View style={style().separatorLine}/>
            </View>
            <View style={style().matchflexEventsView}>
                <Text style={style().textBlue}>
                    <Text
                        onPress={() => Linking.openURL('https://www.quattfo.de/infos/impressum.html')}>Impressum</Text>
                    {'  -  '}
                    <Text
                        onPress={() => Linking.openURL('https://www.quattfo.de/infos/datenschutz.html')}>Datenschutz</Text>
                </Text>
            </View>
            {Constants?.expoConfig?.version ?
                <View style={style().matchflexEventsView}>
                    <TextC>
                        Quapp v{Constants.expoConfig.version}
                    </TextC>
                </View> : null}
        </DrawerContentScrollView>
    );
}

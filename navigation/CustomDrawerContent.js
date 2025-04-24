import {useEffect, useState} from 'react';
import TextC from "../components/customText";
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {Image, Linking, Platform, Text, View} from 'react-native';
import {style} from '../assets/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from "expo-constants";
import * as ColorFunctions from "../components/functions/ColorFunctions";

export default function CustomDrawerContent(props) {
    const [tournamentName, setTournamentName] = useState('Quattroball');
    const [currentYearId, setCurrentYearId] = useState(0);
    const [currentYearName, setCurrentYearName] = useState('');
    const [currentDayId, setCurrentDayId] = useState(0);

    useEffect(() => {
        if (global.settings) {
            setTournamentName(global.tournamentName ?? '');
            setCurrentYearId(global.currentYear?.id ?? 0);
            setCurrentYearName(global.currentYear?.name ?? '');
            setCurrentDayId(global.settings?.currentDay_id ?? 0);
        }
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
                    {tournamentName + ' ' + (currentDayId > 0 ? currentYearName + ', Tag ' + currentDayId : '')}
                    {global.isLocalhostWebview ?
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
                    props.navigation.navigateDeprecated('MyMatches', {screen: 'RoundsCurrent'})
                }
            />
            {global.currentYear?.teamsCount > 24 ?
                <DrawerItem
                    icon={() => <Icon name="view-grid-outline" size={25} color={ColorFunctions.getColor('primary')}/>}
                    label="Alle Gruppen"
                    onPress={() =>
                        props.navigation.navigateDeprecated('MyMatches', {screen: 'GroupsAll'})
                    }
                />
                : <DrawerItem
                    icon={() => <Icon name="table-large" size={25} color={ColorFunctions.getColor('primary')}/>}
                    label="Tabelle"
                    onPress={() =>
                        props.navigation.navigateDeprecated('MyMatches', {screen: 'RankingInGroups'})
                    }
                />
            }
            <DrawerItem
                icon={() => <Icon name="cpu-64-bit" size={25} color={ColorFunctions.getColor('primary')}/>}
                label="Alle Teams"
                onPress={() =>
                    props.navigation.navigateDeprecated('MyMatches', {screen: 'TeamsCurrent'})
                }
            />
            {Platform.OS === 'web' && process?.env?.NODE_ENV !== 'development' ? null
                :
                (global.settings?.useLiveScouting ?
                    <DrawerItem
                        icon={() => <Icon name="picture-in-picture-bottom-right" size={25}
                                          color={ColorFunctions.getColor('primary')}/>}
                        label="Fotos"
                        onPress={() =>
                            props.navigation.navigateDeprecated('MyMatches', {screen: 'AllMatchPhotos'})
                        }
                    /> : null)
            }
            <DrawerItem
                icon={() => <Icon name="playlist-check" size={25} color={ColorFunctions.getColor('primary')}/>}
                label="Spielregeln"
                onPress={() =>
                    props.navigation.navigateDeprecated('MyMatches', {
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
                    props.navigation.navigateDeprecated('MyMatches', {
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
                    onPress={() => props.navigation.navigateDeprecated('Years', {
                        screen: 'GroupsAll',
                        params: {
                            year_id: currentYearId,
                            day_id: (currentDayId - 1)
                        }
                    })}
                />
                : null}
            {global.settings?.usePlayOff ?
                <DrawerItem
                    icon={() => <Icon name="playlist-plus" size={25}
                                      color={ColorFunctions.getColor('primary')}/>}
                    label="Endrunden-Spiele"
                    onPress={() => props.navigation.navigateDeprecated('MyMatches', {
                        screen: 'RoundsMatches',
                        params: {
                            id: 25,
                            roundsCount: 25,
                        }
                    })}
                />
                : null}
            {global.settings?.usePlayOff && global.settings?.showEndRanking ?
                <DrawerItem
                    icon={() => <Icon name="table-large-plus" size={25} color={ColorFunctions.getColor('primary')}/>}
                    label="Endstand nach Endrunde"
                    onPress={() => props.navigation.navigateDeprecated('Years', {
                        screen: 'TeamYearsEndRanking',
                        params: {item: {year_id: currentYearId, year_name: currentYearName}}
                    })}
                />
                : null}
            {global.settings?.showArchieve ?
                <View>
                    <View style={style().drawerSectionView}>
                        <TextC style={{marginLeft: 10}}>{tournamentName} Historie</TextC>
                        <View style={style().separatorLine}/>
                    </View>
                    <DrawerItem
                        icon={() => <Icon name="history" size={25} color={ColorFunctions.getColor('primary')}/>}
                        label="Archiv"
                        onPress={() => props.navigation.navigateDeprecated('Years', {screen: 'YearsAll'})}
                    />
                    <DrawerItem
                        icon={() => <Icon name="table-star" size={25} color={ColorFunctions.getColor('primary')}/>}
                        label="Ewige Tabelle"
                        onPress={() =>
                            props.navigation.navigateDeprecated('Years', {screen: 'TeamsAllTimeRanking'})
                        }
                    />
                </View> : null}
            <View>
                <View style={style().drawerSectionView}>
                    <View style={style().separatorLine}/>
                </View>
                {global.settings?.useRefereeName ?
                    <DrawerItem
                        icon={() => <Icon name="text-box-search" size={25} color={ColorFunctions.getColor('primary')}/>}
                        label="SR-Spielsuche"
                        onPress={() => props.navigation.navigateDeprecated('MyMatches', {screen: 'ListMatchesByReferee'})}
                    /> : null}
                <DrawerItem
                    icon={() => <Icon name="account-settings-outline" size={25}
                                      color={ColorFunctions.getColor('primary')}/>}
                    label="Einstellungen"
                    onPress={() => {
                        props.navigation.navigateDeprecated('MyMatches', {screen: 'Settings'})
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
                            props.navigation.navigateDeprecated('Supervisor', {
                                screen: 'RoundsCurrentSupervisor',
                            })
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="phone-missed" size={25} color={ColorFunctions.getColor('primary')}/>}
                        label="Fehlende SR"
                        onPress={() =>
                            props.navigation.navigateDeprecated('Supervisor', {
                                screen: 'ListMatchesByRefereeCanceledTeamsSupervisor',
                            })
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="clipboard-list-outline" size={25}
                                          color={ColorFunctions.getColor('primary')}/>}
                        label="Ersatz-SR-Rangliste"
                        onPress={() =>
                            props.navigation.navigateDeprecated('Supervisor', {
                                screen: 'RankingRefereeSubstSupervisor',
                            })
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="refresh-auto" size={25} color={ColorFunctions.getColor('primary')}/>}
                        label="Supervisor Auto-Pilot"
                        onPress={() =>
                            props.navigation.navigateDeprecated('Supervisor', {
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
                            props.navigation.reset({
                                index: 0,
                                routes: [{name: 'Admin', screen: 'RoundsCurrentAdmin'}],
                            })
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="heart-flash" size={25} color={ColorFunctions.getColor('primary')}/>}
                        label="Admin Aktionen"
                        onPress={() =>
                            props.navigation.navigateDeprecated('Admin', {screen: 'AdminActions'})
                        }
                    />
                    {global.settings?.useLiveScouting ?
                        <DrawerItem
                            icon={() => <Icon name="picture-in-picture-bottom-right" size={25}
                                              color={ColorFunctions.getColor('primary')}/>}
                            label="Admin Fotos"
                            onPress={() =>
                                props.navigation.navigateDeprecated('Admin', {screen: 'AdminMatchPhotos'})
                            }
                        /> : null}
                    {global.settings?.useLiveScouting ?
                        <DrawerItem
                            icon={() => <Icon name="view-grid-outline" size={25}
                                              color={ColorFunctions.getColor('primary')}/>}
                            label="Admin Gruppen"
                            onPress={() =>
                                props.navigation.navigateDeprecated('Admin', {screen: 'GroupsAllAdmin'})
                            }
                        /> : null}
                    <DrawerItem
                        icon={() => <Icon name="cpu-64-bit" size={25} color={ColorFunctions.getColor('primary')}/>}
                        label="Admin Teams"
                        onPress={() =>
                            props.navigation.navigateDeprecated('Admin', {screen: 'TeamsCurrentAdmin'})
                        }
                    />
                    {Platform.OS === 'web' && !global.settings?.useResourceContentApi ?
                        <DrawerItem
                            icon={() => <Icon name="playlist-check" size={25}
                                              color={ColorFunctions.getColor('primary')}/>}
                            label="Admin Spielregeln"
                            onPress={() =>
                                props.navigation.navigateDeprecated('Admin', {
                                    screen: 'ResourceContentAdmin',
                                    params: {
                                        resource_id: 16,
                                        title: 'Admin Spielregeln'
                                    }
                                })
                            }
                        /> : null}
                    {Platform.OS === 'web' && !global.settings?.useResourceContentApi ?
                        <DrawerItem
                            icon={() => <Icon name="food-fork-drink" size={25}
                                              color={ColorFunctions.getColor('primary')}/>}
                            label="Admin Speisekarte"
                            onPress={() =>
                                props.navigation.navigateDeprecated('Admin', {
                                    screen: 'ResourceContentAdmin',
                                    params: {
                                        resource_id: 77,
                                        title: 'Admin Speisekarte'
                                    }
                                })
                            }
                        /> : null}
                    {Platform.OS === 'web' && global.settings?.usePush ?
                        <DrawerItem
                            icon={() => <Icon name="email-send-outline" size={25}
                                              color={ColorFunctions.getColor('primary')}/>}
                            label="Push Notifications"
                            onPress={() =>
                                props.navigation.navigateDeprecated('Admin', {screen: 'PushNotifications'})
                            }
                        /> : null}
                    {global.settings?.usePushTokenRatings ?
                        <DrawerItem
                            icon={() => <Icon name="table-eye" size={25}
                                              color={ColorFunctions.getColor('primary')}/>}
                            label="PTR-Ranking"
                            onPress={() =>
                                props.navigation.navigateDeprecated('Admin', {screen: 'AdminPushTokenRanking'})
                            }
                        /> : null}
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
                        {Constants.expoConfig.name} v{Constants.expoConfig.version}
                    </TextC>
                </View> : null}
        </DrawerContentScrollView>
    );
}

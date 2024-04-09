import * as React from 'react';
import {useEffect, useState} from 'react';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {Image, Linking, Text, View} from 'react-native';
import styles from '../assets/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from "expo-constants";

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
            <View style={styles.logoView}>
                <Image
                    style={styles.logoImage}
                    source={require('../assets/images/logo2024.png')}
                />
            </View>
            <View style={styles.drawerSectionView}>
                <Text style={{marginLeft: 10}}>
                    {'QuattFo ' + (currentDayId > 0 ? currentYearName + ', Tag ' + currentDayId : '')}
                </Text>
                <View style={styles.separatorLine}/>
            </View>
            {global.myTeamId === 0 ? null
                :
                <DrawerItem
                    icon={() => <Icon name="exclamation-thick" size={25} style={styles.bgYellow}/>}
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
                icon={() => <Icon name="timetable" size={25}/>}
                label="Alle Spielrunden"
                onPress={() =>
                    props.navigation.navigate('MyMatches', {screen: 'RoundsCurrent'})
                }
            />
            <DrawerItem
                icon={() => <Icon name="view-grid-outline" size={25}/>}
                label="Alle Gruppen"
                onPress={() =>
                    props.navigation.navigate('MyMatches', {screen: 'GroupsAll'})
                }
            />
            <DrawerItem
                icon={() => <Icon name="cpu-64-bit" size={25}/>}
                label="Alle Teams"
                onPress={() =>
                    props.navigation.navigate('MyMatches', {screen: 'TeamsCurrent'})
                }
            />
            <DrawerItem
                icon={() => <Icon name="playlist-check" size={25}/>}
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
                icon={() => <Icon name="food-fork-drink" size={25}/>}
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
                    icon={() => <Icon name="history" size={25}/>}
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
            <View style={styles.drawerSectionView}>
                <Text style={{marginLeft: 10}}>QuattFo Historie</Text>
                <View style={styles.separatorLine}/>
            </View>
            <DrawerItem
                icon={() => <Icon name="history" size={25}/>}
                label="Archiv"
                onPress={() => props.navigation.navigate('Years', {screen: 'YearsAll'})}
            />
            <DrawerItem
                icon={() => <Icon name="table-star" size={25}/>}
                label="Ewige Tabelle"
                onPress={() =>
                    props.navigation.navigate('Years', {screen: 'TeamsAllTimeRanking'})
                }
            />
            <View>
                <View style={styles.drawerSectionView}>
                    <View style={styles.separatorLine}/>
                </View>
                <DrawerItem
                    icon={() => <Icon name="account-settings-outline" size={25}/>}
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
                    <View style={styles.drawerSectionView}>
                        <Text style={{marginLeft: 10}}>Supervisor</Text>
                        <View style={styles.separatorLine}/>
                    </View>
                    <DrawerItem
                        icon={() => <Icon name="timetable" size={25}/>}
                        label="Supervisor Spielrunden"
                        onPress={() =>
                            props.navigation.navigate('Supervisor', {
                                screen: 'RoundsCurrentSupervisor',
                            })
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="phone-missed" size={25}/>}
                        label="Fehlende SR"
                        onPress={() =>
                            props.navigation.navigate('Supervisor', {
                                screen: 'ListMatchesByRefereeCanceledTeamsSupervisor',
                            })
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="clipboard-list-outline" size={25}/>}
                        label="Ersatz-SR-Rangliste"
                        onPress={() =>
                            props.navigation.navigate('Supervisor', {
                                screen: 'RankingRefereeSubstSupervisor',
                            })
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="refresh-auto" size={25}/>}
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
                    <View style={styles.drawerSectionView}>
                        <Text style={{marginLeft: 10}}>Admin</Text>
                        <View style={styles.separatorLine}/>
                    </View>
                    <DrawerItem
                        icon={() => <Icon name="timetable" size={25}/>}
                        label="Admin Spielrunden"
                        onPress={() =>
                            props.navigation.navigate('Admin', {screen: 'RoundsCurrentAdmin'})
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="heart-flash" size={25}/>}
                        label="Admin Aktionen"
                        onPress={() =>
                            props.navigation.navigate('Admin', {screen: 'AdminActions'})
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="picture-in-picture-bottom-right" size={25}/>}
                        label="Admin Fotos"
                        onPress={() =>
                            props.navigation.navigate('Admin', {screen: 'AdminMatchPhotos'})
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="view-grid-outline" size={25}/>}
                        label="Admin Gruppen"
                        onPress={() =>
                            props.navigation.navigate('Admin', {screen: 'GroupsAllAdmin'})
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="cpu-64-bit" size={25}/>}
                        label="Admin Teams"
                        onPress={() =>
                            props.navigation.navigate('Admin', {screen: 'TeamsCurrentAdmin'})
                        }
                    />
                    <DrawerItem
                        icon={() => <Icon name="email-send-outline" size={25}/>}
                        label="Push Notifications"
                        onPress={() =>
                            props.navigation.navigate('Admin', {screen: 'PushNotifications'})
                        }
                    />
                </View>
            }
            <View style={styles.drawerSectionView}>
                <View style={styles.separatorLine}/>
            </View>
            <View style={styles.matchflexEventsView}>
                <Text style={{color: '#0155fd'}}>
                    <Text
                        onPress={() => Linking.openURL('https://www.quattfo.de/infos/impressum.html')}>Impressum</Text>
                    {'  -  '}
                    <Text
                        onPress={() => Linking.openURL('https://www.quattfo.de/infos/datenschutz.html')}>Datenschutz</Text>
                </Text>
            </View>
            {Constants?.expoConfig?.version ?
                <View style={styles.matchflexEventsView}>
                    <Text>
                        Quapp v{Constants.expoConfig.version}
                    </Text>
                </View> : null}
        </DrawerContentScrollView>
    );
}

import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {Appearance, Platform, Pressable, ScrollView, View} from 'react-native';
import {style} from "../../assets/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import UsernameLoginModal from "../../navigation/modals/UsernameLoginModal";
import MyTeamSelectModal from "./modals/MyTeamSelectModal";
import {Picker} from "@react-native-picker/picker";
import * as AsyncStorageFunctions from "../../components/functions/AsyncStorageFunctions";
import {reloadAppAsync} from "expo";

export default function SettingsScreen({navigation}) {
    const [selectedScheme, setSelectedScheme] = useState(global.colorSchemeSaved);
    const [showReloadButton, setShowReloadButton] = useState(false);
    const [usernameModalVisible, setUsernameModalVisible] = useState(false);
    const [myTeamSelectModalVisible, setMyTeamSelectModalVisible] = useState(false);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        if (global.colorSchemeSaved !== selectedScheme) {
            AsyncStorageFunctions.setAsyncStorage('colorScheme', selectedScheme);
            global.colorSchemeSaved = selectedScheme;
            global.colorScheme = global.colorSchemeSaved === 'system' ? Appearance.getColorScheme() : global.colorSchemeSaved;
            setShowReloadButton(true);
        }
    }, [selectedScheme]);

    function logout(username) {
        delete global[username + 'PW'];
        setUsername(username + 'logout'); // +'logout' needed to reload screen
        navigation.navigate('MyMatches', {screen: 'Settings'})
    }

    return (
        <ScrollView style={[style().headerComponentView, {minHeight: '100%'}]}>
            <View>
                {global.isProductionWebview ? null :
                    <Pressable style={[style().button1, style().buttonGreen]}
                               onPress={() => {
                                   setMyTeamSelectModalVisible(true)
                               }}
                    >
                        <TextC style={style().textButton1}>
                            <Icon name="account-switch-outline" size={30}/>
                            Mein Team ändern
                        </TextC>
                    </Pressable>
                }

                <TextC>{'\n\n'}</TextC>
                <TextC>Farbschema ändern (Neustart erforderlich):</TextC>
                <Picker
                    selectedValue={selectedScheme}
                    onValueChange={(itemValue) => setSelectedScheme(itemValue)}
                    style={[style().button1, style().pickerSelect, {width: '100%'}]}
                    itemStyle={style().pickerItem}
                >
                    <Picker.Item label={'wie Systemeinstellung (' + Appearance.getColorScheme() + ')'} value="system"/>
                    <Picker.Item label="hell" value="light"/>
                    <Picker.Item label="dunkel" value="dark"/>
                </Picker>
                {showReloadButton ?
                    <Pressable
                        style={[style().button1, style().buttonConfirm, style().buttonGreen, {width: 120}]}
                        onPress={() => {
                            if (Platform.OS === 'web')
                                window?.location?.reload()
                            else reloadAppAsync();
                        }}>
                        <Icon name="reload" size={25}/>
                        <TextC style={style().textButton1}>App neu starten</TextC>
                    </Pressable>
                    : null
                }
                <TextC>{'\n\n'}</TextC>

                {global.settings.useLiveScouting ?
                    <View>
                        {global.supervisorPW === undefined ?
                            <Pressable style={[style().button1, style().buttonRed50]}
                                       onPress={() => {
                                           setUsername('supervisor');
                                           setUsernameModalVisible(true);
                                       }}
                            >
                                <TextC style={style().textButton1}>
                                    <Icon name="login" size={30}/>
                                    Supervisor Login
                                </TextC>
                            </Pressable>
                            :
                            <TextC>Du bist als Supervisor eingeloggt.
                                <Pressable style={[style().button1, style().buttonRed50]}
                                           onPress={() => logout('supervisor')}
                                >
                                    <TextC style={style().textButton1}>
                                        <Icon name="login" size={15}/> Logout
                                    </TextC>
                                </Pressable>
                            </TextC>
                        }
                    </View> : null}

                {global.adminPW === undefined ?
                    <Pressable style={[style().button1, style().buttonRed]}
                               onPress={() => {
                                   setUsername('admin');
                                   setUsernameModalVisible(true);
                               }}
                    >
                        <TextC style={style().textButton1}>
                            <Icon name="login-variant" size={30}/>
                            Admin Login
                        </TextC>
                    </Pressable>
                    :
                    <TextC>Du bist als Admin eingeloggt.
                        <Pressable style={[style().button1, style().buttonRed]}
                                   onPress={() => logout('admin')}
                        >
                            <TextC style={style().textButton1}>
                                <Icon name="login" size={15}/> Logout
                            </TextC>
                        </Pressable>
                    </TextC>
                }

                <UsernameLoginModal
                    setModalVisible={setUsernameModalVisible}
                    modalVisible={usernameModalVisible}
                    username={username}
                    navigation={navigation}
                />
            </View>
            {global.isProductionWebview ? null :
                <MyTeamSelectModal
                    navigation={navigation}
                    setModalVisible={setMyTeamSelectModalVisible}
                    modalVisible={myTeamSelectModalVisible}
                />}
        </ScrollView>
    );
}

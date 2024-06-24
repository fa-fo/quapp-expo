import * as React from 'react';
import {useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import styles from "../../assets/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import UsernameLoginModal from "../../navigation/modals/UsernameLoginModal";

export default function SettingsScreen({navigation}) {
    const [usernameModalVisible, setUsernameModalVisible] = useState(false);
    const [username, setUsername] = useState(null);

    function logout(username) {
        delete global[username + 'PW'];
        setUsername(username + 'logout'); // +'logout' needed to reload screen
        navigation.navigate('MyMatches', {screen: 'Settings'})
    }

    return (
        <ScrollView style={[styles.headerComponentView, {minHeight: '100%'}]}>
            <View>
                {window?.location?.hostname === 'api.quattfo.de' ? null :
                    <Pressable style={[styles.button1, styles.buttonGreen]}
                               onPress={() => {
                                   navigation.navigate('MyMatches', {screen: 'MyTeamSelect'})
                               }}
                    >
                        <Text style={styles.textButton1}>
                            <Icon name="account-switch-outline" size={30}/>
                            Mein Team ändern
                        </Text>
                    </Pressable>
                }

                <Text>{'\n\n'}</Text>

                {global.supervisorPW === undefined ?
                    <Pressable style={[styles.button1, styles.buttonRed50]}
                               onPress={() => {
                                   setUsername('supervisor');
                                   setUsernameModalVisible(true);
                               }}
                    >
                        <Text style={styles.textButton1}>
                            <Icon name="login" size={30}/>
                            Supervisor Login
                        </Text>
                    </Pressable>
                    :
                    <Text>Du bist als Supervisor eingeloggt.
                        <Pressable style={[styles.button1, styles.buttonRed50]}
                                   onPress={() => logout('supervisor')}
                        >
                            <Text style={styles.textButton1}>
                                <Icon name="login" size={15}/> Logout
                            </Text>
                        </Pressable>
                    </Text>
                }

                {global.adminPW === undefined ?
                    <Pressable style={[styles.button1, styles.buttonRed]}
                               onPress={() => {
                                   setUsername('admin');
                                   setUsernameModalVisible(true);
                               }}
                    >
                        <Text style={styles.textButton1}>
                            <Icon name="login-variant" size={30}/>
                            Admin Login
                        </Text>
                    </Pressable>
                    :
                    <Text>Du bist als Admin eingeloggt.
                        <Pressable style={[styles.button1, styles.buttonRed]}
                                   onPress={() => logout('admin')}
                        >
                            <Text style={styles.textButton1}>
                                <Icon name="login" size={15}/> Logout
                            </Text>
                        </Pressable>
                    </Text>
                }

                <UsernameLoginModal
                    setModalVisible={setUsernameModalVisible}
                    modalVisible={usernameModalVisible}
                    username={username}
                    navigation={navigation}
                />
            </View>
        </ScrollView>
    );
}

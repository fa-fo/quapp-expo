import * as React from 'react';
import {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, Text} from 'react-native';
import styles from '../../assets/styles.js';
import {Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../components/fetchApi';
import CellVariant from '../../components/cellVariant';
import WelcomeModal from "./modals/WelcomeModal";

export default function MyTeamSelectScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadScreenData();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            if (!global.myTeamId && global.myTeamId !== 0) {
                setTimeout(() => {
                    setModalVisible(true);
                }, 500);
            }
        }

        return () => {
            setModalVisible(false);
        };
    }, [isLoading]);

    const loadScreenData = () => {
        fetchApi('teamYears/all')
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <ScrollView>
            {isLoading ? <ActivityIndicator size="large" color="#00ff00" style={styles.actInd}/> :
                (data?.status === 'success' ? (
                    <TableView appearance="light">
                        <Section header={'Bitte wähle jetzt dein Team aus:'}>
                            {data.object.map(item => (
                                <CellVariant key={item.id}
                                             cellStyle="RightDetail"
                                             title={item.team.name}
                                             accessory="DetailDisclosure"
                                             detail={'auswählen'}
                                             onPress={() => navigation.navigate('ListMatchesByTeam', {
                                                 item: item,
                                                 setMyTeam: 1,
                                             })}
                                />
                            ))}
                            <CellVariant key={0}
                                         cellStyle="RightDetail"
                                         title="kein Team"
                                         accessory="DetailDisclosure"
                                         detail={'auswählen'}
                                         onPress={() => navigation.navigate(global.myTeamId ? 'ListMatchesByTeam' : 'GroupsAll', {
                                             item: null,
                                             setMyTeam: 1,
                                         })}
                            />
                        </Section>
                    </TableView>
                ) : <Text>Fehler!</Text>)}
            <WelcomeModal
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
            />
        </ScrollView>
    );
}

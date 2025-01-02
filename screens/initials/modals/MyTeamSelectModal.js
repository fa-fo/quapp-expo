import TextC from "../../../components/customText";
import {useEffect, useState} from 'react';
import {ActivityIndicator, Modal, ScrollView, View} from 'react-native';
import {style} from '../../../assets/styles.js';
import {Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../../components/fetchApi';
import CellVariant from '../../../components/cellVariant';
import WelcomeModal from "./WelcomeModal";
import * as ColorFunctions from "../../../components/functions/ColorFunctions";

export default function MyTeamSelectModal({
                                              navigation,
                                              setModalVisible,
                                              modalVisible
                                          }) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [welcomeModalVisible, setWelcomeModalVisible] = useState(false);

    useEffect(() => {
        if (modalVisible) {
            loadScreenData();
        }
    }, [modalVisible]);

    useEffect(() => {
        if (!isLoading) {
            if (!global.myTeamId && global.myTeamId !== 0) {
                setTimeout(() => {
                    setWelcomeModalVisible(true);
                }, 500);
            }
        }

        return () => {
            setWelcomeModalVisible(false);
        };
    }, [isLoading]);

    const loadScreenData = () => {
        fetchApi('teamYears/all')
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <ScrollView>
                <View style={{flex: 1, backgroundColor: ColorFunctions.getColor('primaryBg')}}>
                    <TextC style={style().big2a}>Team auswählen</TextC>
                    {isLoading ? <ActivityIndicator size="large" color="#00ff00" style={style().actInd}/> :
                        (data?.status === 'success' ? (
                            <TableView appearance={global.colorScheme}>
                                <Section header={'Bitte wähle jetzt dein Team aus:'}>
                                    {data.object.map(item => (
                                        <CellVariant key={item.id}
                                                     cellStyle="RightDetail"
                                                     title={item.team.name}
                                                     accessory="DetailDisclosure"
                                                     detail={'auswählen'}
                                                     onPress={() => {
                                                         setModalVisible(false);
                                                         navigation.popTo('MyMatchesCurrent', {
                                                             item: item,
                                                             setMyTeam: 1,
                                                         });
                                                     }}
                                        />
                                    ))}
                                    <CellVariant key={0}
                                                 cellStyle="RightDetail"
                                                 title="kein Team"
                                                 accessory="DetailDisclosure"
                                                 detail={'auswählen'}
                                                 onPress={() => {
                                                     setModalVisible(false);
                                                     navigation.popTo((global.myTeamId ? 'MyMatchesCurrent' : 'GroupsAll'), {
                                                         item: null,
                                                         setMyTeam: 1,
                                                     });
                                                 }}
                                    />
                                </Section>
                            </TableView>
                        ) : <TextC>Fehler!</TextC>)}
                    <WelcomeModal
                        setModalVisible={setWelcomeModalVisible}
                        modalVisible={welcomeModalVisible}
                    />
                </View>
            </ScrollView>
        </Modal>
    );
}

import TextC from "../components/customText";
import {useState} from 'react';
import {Pressable, View} from 'react-native';
import {Cell} from 'react-native-tableview-simple';
import {style} from '../assets/styles';
import fetchApi from './fetchApi';
import CancelTeamYearModal from "./modals/CancelTeamYearModal";

export default function CellVariantTeamsAdmin(props) {
    const [canceled, setCanceled] = useState(props.canceled);
    const [cancelTeamYearModalVisible, setCancelTeamYearModalVisible] =
        useState(false);

    const cancelTeamYear = (teamYearsId, undo) => {
        let postData = {password: global.adminPW};

        fetchApi('teamYears/cancel/' + teamYearsId + '/' + undo, 'POST', postData)
            .then(json => setCanceled(json.object ? json.object.canceled : undo))
            .catch(error => console.error(error));
    };

    return (
        <Cell
            {...props}
            cellContentView={
                <View
                    style={{
                        alignSelf: 'flex-start',
                        flexDirection: 'row',
                        flex: 1,
                        paddingVertical: 10,
                    }}>
                    <View style={{flex: 1, alignSelf: 'center'}}>
                        <TextC

                            numberOfLines={1}
                            style={{
                                fontWeight: props.isMyTeam ? 'bold' : 'normal',
                                fontSize: 16,
                            }}>
                            {props.title}
                            {canceled ?
                                <TextC style={{color: '#a33300', fontSize: 10}}>
                                    {' '}
                                    zurückgezogen
                                </TextC>
                                : null}
                        </TextC>
                    </View>
                    <View style={{flex: 0.6, alignSelf: 'center'}}>
                        <Pressable
                            style={[
                                style().button1,
                                style().buttonCancel,
                                canceled ? style().buttonGreen : style().buttonRed,
                            ]}
                            onPress={() => setCancelTeamYearModalVisible(true)}>
                            <TextC
                                numberOfLines={1}
                                style={style().textButton1}>
                                {canceled ? 'Rückzug rückgängig' : 'zurückziehen'}
                            </TextC>
                        </Pressable>
                    </View>
                    <CancelTeamYearModal
                        setModalVisible={setCancelTeamYearModalVisible}
                        modalVisible={cancelTeamYearModalVisible}
                        props={props}
                        canceled={canceled}
                        setCanceled={setCanceled}
                    />
                </View>
            }
        />
    );
}

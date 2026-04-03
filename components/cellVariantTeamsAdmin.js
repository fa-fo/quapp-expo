import TextC from "../components/customText";
import {useState} from 'react';
import {Pressable, View} from 'react-native';
import {Cell} from 'react-native-tableview-simple';
import {Checkbox} from 'expo-checkbox';
import {style} from '../assets/styles';
import CancelTeamYearModal from "./modals/CancelTeamYearModal";
import fetchApi from "./fetchApi";

export default function CellVariantTeamsAdmin(props) {
    let initialRefereePref = props.sports.map(sport => sport.id.toString()).join('');

    const [canceled, setCanceled] = useState(props.item.canceled);
    const [cancelTeamYearModalVisible, setCancelTeamYearModalVisible] =
        useState(false);
    const [refereePref, setRefereePref] = useState(props.item.refereePref?.toString() ?? initialRefereePref);

    function getRefereePref(sport_id) {
        return refereePref.includes(sport_id.toString());
    }

    function changeRefereePref(sport_id, itemValue) {
        let sid = sport_id.toString();
        let str = itemValue ? refereePref + sid : refereePref.replaceAll(sid, '');

        let newRefereePref = [...new Set(str)].join('');  // remove doublets
        setRefereePref(newRefereePref);
        saveRefereePref(newRefereePref);
    }

    function saveRefereePref(newRefereePref) {
        let postData = {password: global.adminPW, refereePref: newRefereePref};

        fetchApi('teamYears/saveRefereePref/' + props.item.id, 'POST', postData)
            .then(json => {
                if (json && json.status === 'success') {
                } else {
                }
            })
            .catch(error => console.error(error));

    }

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
                            style={{fontSize: 16}}>
                            {props.item.team.name}
                            {canceled ?
                                <TextC style={{color: '#a33300', fontSize: 10}}>
                                    {' '}zurückgezogen
                                </TextC>
                                : null}
                        </TextC>
                    </View>
                    {global.settings.useRefereePref && props.sports ?
                        <View style={{flex: 0.5, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
                            {props.sports.map(sport => (
                                <TextC key={sport.id}>
                                    {sport.code.substring(0, 1)}
                                    <Checkbox
                                        disabled={refereePref.length < 4 && getRefereePref(sport.id)}
                                        value={getRefereePref(sport.id)}
                                        onValueChange={(itemValue) => changeRefereePref(sport.id, itemValue)}
                                    />
                                    {' '}
                                </TextC>
                            ))}
                        </View> : null}

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

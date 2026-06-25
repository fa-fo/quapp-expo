import TextC from "../components/customText";
import {useState} from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {Cell} from 'react-native-tableview-simple';
import {Checkbox} from 'expo-checkbox';
import {style} from '../assets/styles';
import CancelTeamYearModal from "./modals/CancelTeamYearModal";
import fetchApi from "./fetchApi";

export default function CellVariantTeamsAdmin(props) {
    let initialRefereePref = props.sports?.map(sport => sport.id.toString()).join('') ?? '';

    const [canceled, setCanceled] = useState(props.item.canceled);
    const [cancelTeamYearModalVisible, setCancelTeamYearModalVisible] =
        useState(false);
    const [refereePref, setRefereePref] = useState(props.item.refereePref?.toString().replace(/0/g, '') ?? initialRefereePref);
    const [isTryingSave, setIsTryingSave] = useState(false);
    const [saved, setSaved] = useState(false);

    function getRefereePref(sport_id) {
        return refereePref.includes(sport_id.toString());
    }

    function changeRefereePref(sport_id, itemValue) {
        setIsTryingSave(true);
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
                    setIsTryingSave(false);
                    setSaved(true);
                    setTimeout(() => {
                        setSaved(false);
                    }, 3000);
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
                                    {' ' + sport.code.substring(0, 1) + ':'}
                                    <Checkbox
                                        disabled={refereePref.length < 4 && getRefereePref(sport.id)}
                                        value={getRefereePref(sport.id)}
                                        onFocus={() => setSaved(false)}
                                        onValueChange={(itemValue) => changeRefereePref(sport.id, itemValue)}
                                    />
                                    {' '}
                                </TextC>
                            ))}
                            {saved ?
                                <Icon name="checkbox-marked-circle" size={24}
                                      style={{position: 'absolute', right: 2, top: 2, color: 'green'}}/>
                                : null}
                            {isTryingSave ?
                                <ActivityIndicator size={24} color="green"
                                                   style={{
                                                       position: 'absolute',
                                                       right: 2,
                                                       top: 2,
                                                       color: 'green'
                                                   }}/> : null}
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

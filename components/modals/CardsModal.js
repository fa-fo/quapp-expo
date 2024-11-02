import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {Modal, Pressable, View} from 'react-native';
import {style} from '../../assets/styles.js';
import * as FoulFunctions from '../functions/FoulFunctions';

export default function CardsModal({
                                       setModalVisible,
                                       modalVisible,
                                       match,
                                   }) {
    const [fouls, setFouls] = useState(null);
    const [diff, setDiff] = useState(0);

    useEffect(() => {
        setDiff(0);

        const array = Object.keys(match.logsCalc);
        const fouls = array.filter(s => s.includes('FOUL_')).filter(s => s.includes('_V2'));
        setFouls(fouls);

    }, [match.logsCalc]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDiff(diff + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [match.logsCalc, diff]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
                setFouls(null);
            }}>
            <View style={style().centeredView}>
                <View style={style().modalView}>
                    <TextC>{match.sport.code} Feld {match.group_name}</TextC>
                    <TextC>{'\n'}</TextC>
                    <TextC style={style().big3}>{match.teams1.name} - {match.teams2.name}</TextC>
                    <TextC>{'\n'}</TextC>
                    {fouls ?
                        fouls.map(code => (
                            <View key={code} style={style().matchflexRowView}>
                                {FoulFunctions.getFoulCards(match.logsCalc, code.substring(0, code.length - 3), match.team1_id, diff)}
                                <View style={[style().viewCentered, {flex: 2}]}>
                                    <TextC>{'\n ' + match.logsCalc[code]['name'] + ' '}</TextC>
                                </View>
                                {FoulFunctions.getFoulCards(match.logsCalc, code.substring(0, code.length - 3), match.team2_id, diff)}
                            </View>
                        ))
                        : null}

                    <Pressable
                        style={[style().button1, style().buttonGrey]}
                        onPress={() => setModalVisible(false)}>
                        <TextC style={style().textButton1}>Schließen</TextC>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

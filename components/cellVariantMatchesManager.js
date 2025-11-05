import TextC from "../components/customText";
import {View} from 'react-native';
import {style} from '../assets/styles';
import * as SportFunctions from "./functions/SportFunctions";
import {Popable} from "react-native-popable";
import * as ColorFunctions from "./functions/ColorFunctions";
import * as DateFunctions from "./functions/DateFunctions";

export default function CellVariantMatchesManager(props) {
    let item = props.item;

    return (
        <Popable
            action="hover"
            strictPosition={true}
            position="left"
            backgroundColor={ColorFunctions.getColor('primaryBg')}
            style={{width: 800, top: 120 - props.groupIndex * 60 - props.matchIndex * 20}}
            content={
                <View style={[style().modalView, {margin: 0, padding: 5}]}>
                    {item.playOffName ? <TextC numberOfLines={1} style={style().centeredText100}>
                            {item.playOffName}</TextC>
                        : <TextC numberOfLines={1} style={style().centeredText100}>Runde {item.round.id},
                            Gruppe {item.group_name}</TextC>}
                    <TextC numberOfLines={2} style={[style().centeredText100, style().big2]}
                           adjustsFontSizeToFit>{(item.teams1?.name ?? '?') + (item.isTest ? '_test' : '')}</TextC>
                    <TextC numberOfLines={1} style={[style().centeredText100, style().small]}>vs</TextC>
                    <TextC numberOfLines={2} style={[style().centeredText100, style().big2]}
                           adjustsFontSizeToFit>{(item.teams2?.name ?? '?') + (item.isTest ? '_test' : '')}</TextC>
                    <TextC> </TextC>
                    {item.teams3 && !item.refereeName ?
                        <TextC numberOfLines={1}
                               style={style().centeredText100}>SR: {item.teams3.name + (item.isTest ? '_test' : '')}
                        </TextC> : null}
                    {item.teams4 ?
                        <TextC numberOfLines={1} style={[style().centeredText100, style().textGreen]}>
                            <TextC
                                style={style().textViolet}>Ersatz-SR:</TextC> {item.teams4.name + (item.isTest ? '_test' : '')}
                        </TextC> : null}
                    {item.refereeName ?
                        <TextC numberOfLines={1}
                               style={style().centeredText100}>SR: {item.refereeName}
                        </TextC> : null}
                    <TextC> </TextC>
                    <TextC numberOfLines={1} style={style().centeredText100}>
                        Spielbeginn: {DateFunctions.getDateTimeFormatted(item.matchStartTime) + ' Uhr: '}
                    </TextC>
                    <TextC numberOfLines={1} style={[style().centeredText100, style().big3]}>
                        {item.sport.name} Feld {item.group_name}
                    </TextC>

                    <TextC numberOfLines={1}
                           style={[style().centeredText100, style().big1, style().textRed]}>
                        {parseInt(item.logsCalc?.score?.[item.team1_id] ?? 0) || 0}
                        : {parseInt(item.logsCalc?.score?.[item.team2_id] ?? 0) || 0}
                    </TextC>

                </View>
            }>
            <View style={[style().viewCentered, (props.matchIndex === 0 ? {marginTop: 8} : null)]}>
                <View style={style().matchflexRowView}>
                    <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 8}}>
                        <TextC numberOfLines={1}>
                            {SportFunctions.getSportImage(item.sport.code)}
                            {item.sport.code + ' '}
                            <TextC style={style().textBlue}>{item.group_name}</TextC>
                        </TextC>
                    </View>
                    <View style={{flex: 1}}>
                        <TextC adjustsFontSizeToFit numberOfLines={1}
                               style={[style().big3, style().textRed]}>
                            {item.logsCalc.score !== undefined
                                ? parseInt(item.logsCalc.score[item.team1_id]) ||
                                0
                                : 0}
                            {' '}:{' '}
                            {item.logsCalc.score !== undefined
                                ? parseInt(item.logsCalc.score[item.team2_id]) ||
                                0
                                : 0}
                        </TextC>
                    </View>
                </View>
            </View>
        </Popable>
    );
}

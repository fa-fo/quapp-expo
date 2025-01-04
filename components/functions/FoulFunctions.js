import {Text, View} from 'react-native';
import TextC from "../../components/customText";
import {style} from "../../assets/styles";

export function getFoulCards(logsCalc, eventItemCode, teamId, diff) {
    eventItemCode += '_V2';

    return (
        <View style={style().matchflexRowView}>
            {logsCalc[eventItemCode] !== undefined && logsCalc[eventItemCode][teamId] !== undefined ?
                Object.entries(logsCalc[eventItemCode][teamId]).map(([key, val]) => (
                    <View key={key}>
                        <Text style={getStyles(eventItemCode, val.count)}>
                            <Text>{key}</Text>
                            <Text style={{fontSize: 10, marginTop: -16}}>
                                {'\n' + 'X'.repeat(Math.abs(Number(val.count)))}
                            </Text>
                        </Text>
                        {val.reEntryTime !== undefined ?
                            Object.entries(val.reEntryTime).map(([k, v]) => (
                                <TextC key={k}>{getSuspTime(v, diff)}</TextC>
                            )) : null}
                    </View>
                )) : <TextC> </TextC>}
        </View>
    )
}

export function getFoulColor(code) {
    // use substr because of '_V2'-extensions!
    return code.substring(0, 16) === 'FOUL_CARD_YELLOW' || code.substring(0, 13) === 'FOUL_PERSONAL' ? 'yellow' :
        code.substring(0, 9) === 'FOUL_SUSP' || code.substring(0, 15) === 'FOUL_TECH_FLAGR' ? 'orange' :
            code.substring(0, 13) === 'FOUL_CARD_RED' || code.substring(0, 9) === 'FOUL_DISQ' ? 'thistle' : '';
}

function getStyles(code, val) {
    return [style().foulCards, {borderColor: getBorderColor(val)}, {backgroundColor: getFoulColor(code)}];
}

function getBorderColor(val) {
    return val < 0 ? 'red' : '#ccc'; // red=FouledOut
}

function getSuspTime(val, diff) {
    let sec = val - diff;

    if (sec >= 0) {
        const zeroPad = (num) => String(num).padStart(2, "0");

        let minutes = Math.floor(sec / 60);
        let seconds = zeroPad(sec % 60);

        return minutes + ':' + seconds + ' ';
    }
    return null;
}




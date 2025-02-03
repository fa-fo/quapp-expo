import TextC from "../../components/customText";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import {View} from "react-native";
import * as DateFunctions from "./DateFunctions";
import * as ColorFunctions from "./ColorFunctions";
import fetchApi from "../fetchApi";

export function getSportImage(code) {
    switch (code) {
        case "BB":
            return require("../../assets/images/bb.png")
        case "FB":
            return require("../../assets/images/fb.png")
        case "HB":
            return require("../../assets/images/hb.png")
        case "VB":
            return require("../../assets/images/vb.png")
        default:
            return require("../../assets/images/hb.png")
    }
}

export function getChampionshipStars(countStars) {
    return [...Array(countStars)].map((e, i) =>
        <IconMat name="star"
                 key={i}
                 size={15}
                 style={{color: ColorFunctions.getColor('GoldBg')}}/>)
}

export function getRemarksAdmin(remarksMatches) {
    return remarksMatches.length ?
        (remarksMatches.map(match => (
            <View key={match.id}>
                <TextC
                    style={{fontWeight: 'bold'}}>{match.sport.code} {match.group_name}, {DateFunctions.getFormatted(match.matchStartTime)} Uhr:</TextC>
                <TextC>{match.teams1.name} vs {match.teams2.name}</TextC>
                <TextC style={{fontStyle: 'italic'}}>SR: {match.teams3.name}</TextC>
                <TextC style={{marginBottom: 20, fontSize: 20}}>"{match.remarks}"</TextC>
            </View>
        ))) : null;
}

export const saveRefereeName = (match, postData, setSaved) => {
    postData = {'password': global.adminPW, ...postData};

    return fetchApi('matches/saveRefereeName/' + match.id, 'POST', postData)
        .then(data => {
            if (data?.status === 'success') {
                setSaved(true)
            }
        })
        .catch(error => console.error(error));
};

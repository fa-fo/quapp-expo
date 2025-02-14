import TextC from "../../components/customText";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import {Image, View} from "react-native";
import * as DateFunctions from "./DateFunctions";
import * as ColorFunctions from "./ColorFunctions";
import fetchApi from "../fetchApi";
import {style} from "../../assets/styles";

export function getSportImage(code) {
    let img = {};
    switch (code) {
        case "BB":
            img[0] = require("../../assets/images/bb.png");
            break;
        case "FB":
            img[0] = require("../../assets/images/fb.png");
            break;
        case "HB":
            img[0] = require("../../assets/images/hb.png");
            break;
        case "VB":
            img[0] = require("../../assets/images/vb.png");
            break;
        case "": // Multi
            img[0] = require("../../assets/images/bb.png");
            img[1] = require("../../assets/images/fb.png");
            img[2] = require("../../assets/images/hb.png");
            img[3] = require("../../assets/images/vb.png");
            break;
        default:
            img[0] = require("../../assets/images/hb.png");
            break;
    }

    return Object.entries(img).map(([key, val]) =>
        <Image
            key={key}
            style={style().sportImage}
            source={val}
        />
    )
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
                <TextC>{match.teams1?.name ?? ''} vs {match.teams2?.name ?? ''}</TextC>
                <TextC style={{fontStyle: 'italic'}}>SR: {match.teams3?.name ?? ''}</TextC>
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


export const saveMatchTeamIds = (match, postData, setSaved) => {
    postData = {'password': global.adminPW, ...postData};

    return fetchApi('matches/saveMatchTeamIds/' + match.id, 'POST', postData)
        .then(data => {
            if (data?.status === 'success') {
                setSaved(true)
            }
        })
        .catch(error => console.error(error));
};

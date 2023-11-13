import * as React from 'react';
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";

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
                 size={15}
                 style={{color: 'rgba(224,196,13,0.37)'}}/>)
}

import {Appearance} from "react-native";

export function getColor(name) {
    let scheme = global.colorScheme ?? Appearance.getColorScheme();

    switch (name) {
        case 'primary':
            return scheme === 'dark' ? 'rgba(229, 229, 231, 0.68)' : 'rgb(0, 0, 0)'
        case 'primaryBg':
            return scheme === 'dark' ? 'rgb(18, 18, 18)' : 'rgb(255, 255, 255)'
        case 'primaryBgBlackWhite':
            return scheme === 'dark' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'
        case 'buttonTxt':
            return scheme === 'dark' ? 'rgba(229, 229, 231, 0.68)' : 'rgb(255, 255, 255)'
        case 'blue':
            return scheme === 'dark' ? 'rgb(72,72,130)' : 'rgb(1, 85, 253)'
        case 'GreenLightBg':
            return scheme === 'dark' ? 'rgba(51,82,45,0.37)' : 'rgba(151,245,135,0.37)'
        case 'RedLightBg':
            return scheme === 'dark' ? 'rgba(40,22,33,0.91)' : 'rgba(212,116,174,0.43)'
        case 'GoldBg':
            return scheme === 'dark' ? 'rgba(109,96,7,0.91)' : 'rgba(224,196,13,0.37)'
        case 'VioletLightBg':
            return scheme === 'dark' ? 'rgba(208,167,222,0.28)' : 'rgba(208,167,222,0.15)'
        case 'YellowBg':
            return scheme === 'dark' ? 'rgba(255,255,0,0.45)' : 'rgb(255,255,0)'
        case 'TestHintBg':
            return scheme === 'dark' ? 'rgb(73,62,1)' : 'rgb(255, 215, 0)'
        case 'OrangeBg':
            return scheme === 'dark' ? 'rgb(54,22,1)' : 'rgb(255, 165, 0)'

        default:
            return ''
    }
}

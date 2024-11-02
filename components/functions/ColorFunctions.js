export function getColor(name) {
    switch (name) {
        case 'primary':
            return global.colorScheme === 'dark' ? 'rgba(229, 229, 231, 0.68)' : 'rgb(0, 0, 0)'
        case 'primaryBg':
            return global.colorScheme === 'dark' ? 'rgb(18, 18, 18)' : 'rgb(255, 255, 255)'
        case 'buttonTxt':
            return global.colorScheme === 'dark' ? 'rgba(229, 229, 231, 0.68)' : 'rgb(255, 255, 255)'
        case 'blue':
            return global.colorScheme === 'dark' ? 'rgba(142,142,241,0.68)' : 'rgb(1, 85, 253)'
        case 'GreenLightBg':
            return global.colorScheme === 'dark' ? 'rgba(51,82,45,0.37)' : 'rgba(151,245,135,0.37)'
        case 'RedLightBg':
            return global.colorScheme === 'dark' ? 'rgba(40,22,33,0.91)' : 'rgba(212,116,174,0.43)'
        case 'GoldBg':
            return global.colorScheme === 'dark' ? 'rgba(109,96,7,0.91)' : 'rgba(224,196,13,0.37)'
        case 'VioletLightBg':
            return global.colorScheme === 'dark' ? 'rgba(68,55,73,0.15)' : 'rgba(208,167,222,0.15)'
        case 'YellowBg':
            return global.colorScheme === 'dark' ? 'rgb(85,85,2)' : 'rgb(255,255,0)'
        case 'TestHintBg':
            return global.colorScheme === 'dark' ? 'rgb(73,62,1)' : 'rgb(255, 215, 0)'
        case 'OrangeBg':
            return global.colorScheme === 'dark' ? 'rgb(54,22,1)' : 'rgb(255, 165, 0)'

        default:
            return ''
    }
}

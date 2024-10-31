import * as React from 'react';

export function getColor(name) {
    switch (name) {
        case 'GreenLightBg':
            return 'rgba(151,245,135,0.37)'
        case 'RedLightBg':
            return 'rgba(212,116,174,0.43)'
        case 'GoldBg':
            return 'rgba(224,196,13,0.37)'
        case 'VioletLightBg':
            return 'rgba(208,167,222,0.15)'
        default:
            return ''
    }
}

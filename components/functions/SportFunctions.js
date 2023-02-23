import * as React from 'react';

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

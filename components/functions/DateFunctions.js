import * as React from 'react';
import {format, parseISO} from "date-fns";
import {de} from "date-fns/locale";

export function getFormatted(date) {
    return format(parseISO(date), "H:mm", {locale: de})
}

export function getDateFormatted(date) {
    return format(parseISO(date), "eeee, d.MM.yyyy", {locale: de})
}

export function getDateTimeFormatted(dateTime) {
    return format(parseISO(dateTime), "eeee, d.MM.yyyy, H:mm", {locale: de})
}

export function getDateYearFormatted(dateTime) {
    return format(parseISO(dateTime), "d.MM.yy", {locale: de})
}
export function getLocalDatetime(){
    return format(new Date(), "yyyy-MM-dd HH:mm:ss", {locale: de})
}

import * as React from 'react';

export function isNumber(numberString) {
    return numberString !== null && !isNaN(Number(numberString.trim())) && Number.isInteger(parseInt(numberString.trim()))
}


export function isNumber(numberString) {
    return numberString !== null && !isNaN(Number(numberString.trim())) && Number.isInteger(parseInt(numberString.trim()))
}

// not used
export function isTest(yearId) {
    return global.settings?.isTest && yearId === global.settings?.currentYear_id
}

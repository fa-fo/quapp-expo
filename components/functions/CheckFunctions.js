export function isNumber(numberString) {
    return numberString !== null && !isNaN(Number(numberString.trim())) && Number.isInteger(parseInt(numberString.trim()))
}

export function showLive(item, isCurrentRound) {
    return isCurrentRound && global.settings?.useLiveScouting
        && (item.round.autoUpdateResults || ([item.team1_id, item.team2_id].includes(global.myTeamId) && !global.myTeamChangedLate))
}

// not used
export function isTest(yearId) {
    return global.settings?.isTest && yearId === global.settings?.currentYear_id
}

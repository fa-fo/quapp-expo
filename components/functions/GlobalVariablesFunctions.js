export function setGlobalVariables() {
    global.settings = {};
    global.currentDayName = '';
    global.currentYear = {};
    global.tournamentName = process.env.EXPO_PUBLIC_TOURNAMENT_NAME;

    global.isProductionWebview = window?.location?.hostname === process.env.EXPO_PUBLIC_HOSTNAME_BACKEND;
    global.isLocalhostWebview = window?.location?.hostname === 'localhost';
    global.isDevBuildWebview = window?.location?.hostname.substring(0, 8) === '192.168.' && __DEV__;

    if (global.isLocalhostWebview) {
        global.baseUrl = 'http://localhost' + process.env.EXPO_PUBLIC_LOCALHOST_FOLDER;
    } else if (global.isDevBuildWebview) {
        global.baseUrl = window?.location?.protocol + '//' + window?.location?.hostname + process.env.EXPO_PUBLIC_LOCALHOST_FOLDER;
    } else {
        global.baseUrl = 'https://' + process.env.EXPO_PUBLIC_HOSTNAME_BACKEND + '/';
    }

    global.hintAutoUpdateResults = 'In dieser Spielrunde werden die Ergebnisse erst nach Ende des Turniertages bekanntgegeben!';
    global.hintTestData = 'Testmodus! Gruppeneinteilung ist vorläufig, Spielpaarungen ändern sich noch bis zur Bekanntgabe des entgültigen Spielplans am Turniertag.\nFehlermeldungen, Fragen und Verbesserungsvorschläge bitte an info@quattfo.de';
    global.hintSchedule = 'Der Spielplan ist derzeit noch in Bearbeitung und wird in Kürze veröffentlicht!';
}

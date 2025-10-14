export function setGlobalVariables() {
    global.settings = {};
    global.currentDayName = '';
    global.currentYear = {};
    global.tournamentName = 'QuattFo';

    global.isProductionWebview = window?.location?.hostname === 'api.quattfo.de';
    global.isLocalhostWebview = window?.location?.hostname === 'localhost';
    global.isDevBuildWebview = window?.location?.hostname.substring(0, 8) === '192.168.' && __DEV__;

    if (global.isLocalhostWebview) {
        global.baseUrl = 'http://localhost/quapp-cakephp/';
    } else if (global.isDevBuildWebview) {
        global.baseUrl = window?.location?.protocol + '//' + window?.location?.hostname + '/quapp-cakephp/';
    } else {
        global.baseUrl = 'https://api.quattfo.de/';
    }

    global.hintAutoUpdateResults = 'In dieser Spielrunde werden die Ergebnisse erst nach Ende des Turniertages bekanntgegeben!';
    global.hintTestData = 'Testmodus! Gruppeneinteilung ist vorläufig, Spielpaarungen ändern sich noch bis zur Bekanntgabe des entgültigen Spielplans am Turniertag.\nFehlermeldungen, Fragen und Verbesserungsvorschläge bitte an info@quattfo.de';
    global.hintSchedule = 'Der Spielplan ist derzeit noch in Bearbeitung und wird in Kürze veröffentlicht!';
}

import Constants from "expo-constants";

export function setGlobalVariables() {
    let appConfig = Constants?.expoConfig?.extra?.config ?? false;

    if (appConfig) {
        global.settings = {};
        global.currentDayName = '';
        global.currentYear = {};
        global.tournamentName = appConfig.tournamentName;

        global.isProductionWebview = window?.location?.hostname === appConfig.hostnameBackend;
        global.isLocalhostWebview = window?.location?.hostname === 'localhost';
        global.isDevBuildWebview = window?.location?.hostname.substring(0, 8) === '192.168.' && __DEV__;

        if (global.isLocalhostWebview) {
            global.baseUrl = 'http://localhost' + appConfig.localhostFolder;
        } else if (global.isDevBuildWebview) {
            global.baseUrl = window?.location?.protocol + '//' + window?.location?.hostname + appConfig.localhostFolder;
        } else {
            global.baseUrl = 'https://' + appConfig.hostnameBackend + '/';
        }

        global.hintAutoUpdateResults = 'In dieser Spielrunde werden die Ergebnisse erst nach Ende des Turniertages bekanntgegeben!';
        global.hintTestData = 'Testmodus! Gruppeneinteilung ist vorläufig, Spielpaarungen ändern sich noch bis zur Bekanntgabe des entgültigen Spielplans am Turniertag.\nFehlermeldungen, Fragen und Verbesserungsvorschläge bitte an info@quattfo.de';
        global.hintSchedule = 'Der Spielplan ist derzeit noch in Bearbeitung und wird in Kürze veröffentlicht!';
    }
}

export function setGlobalVariables() {
    global.settings = {};
    global.currentDayName = '';
    global.currentYearName = '';
    global.currentYearId = 0;

    if (window?.location?.hostname === 'localhost') {
        global.baseUrl = 'http://localhost/quapp-cakephp/';
    } else {
        global.baseUrl = 'https://api.quattfo.de/';
    }

    global.hintAutoUpdateResults = 'In dieser Spielrunde werden die Ergebnisse erst nach Ende des Turniertages bekanntgegeben!';
    global.hintTestData = 'Testmodus! Gruppeneinteilung ist vorläufig, Spielpaarungen ändern sich noch bis zur Bekanntgabe des entgültigen Spielplans am Turniertag.\nFehlermeldungen, Fragen und Verbesserungsvorschläge bitte an info@quattfo.de';
    global.hintSchedule = 'Der Spielplan ist derzeit noch in Bearbeitung und wird in Kürze veröffentlicht!';
}

import * as React from 'react';

export function setGlobalVariables() {
    global.settings = {};
    global.currentDayName = '';
    global.currentYearName = '';
    global.currentYearId = 0;

    global.hintAutoUpdateResults = 'In dieser Spielrunde werden die Ergebnisse erst nach Ende des Turniertages bekanntgegeben!';
    global.hintTestData = 'Testmodus! Gruppeneinteilung ist vorläufig, Spielpaarungen ändern sich noch bis zur Bekanntgabe des entgültigen Spielplans am Turniertag!\nFehlermeldungen, Fragen und Verbesserungsvorschläge bitte an info@quattfo.de';
    global.hintSchedule = 'Der Spielplan ist derzeit noch in Bearbeitung und wird in Kürze veröffentlicht!';

    if (window?.location?.hostname === 'api.quattfo.de') {
        global.myTeamId = 0;  // reason: do not show TeamSelectScreen for this host!
    }
}

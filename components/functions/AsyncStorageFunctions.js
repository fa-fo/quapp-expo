import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import setAsyncStorage from "../setAsyncStorage";

let scoreName = 'score';

export async function loadStorageTeam() {
    await AsyncStorage.getItem('myTeamId')
        .then(response => response !== null ? response.toString() : null)
        .then((string) => global.myTeamId = (string !== null ? parseInt(JSON.parse(string)) : null))
        .catch((error) => console.error(error));

    await AsyncStorage.getItem('myTeamName')
        .then(response => response !== null ? response.toString() : null)
        .then((string) => global.myTeamName = (string !== null ? JSON.parse(string) : ''))
        .catch((error) => console.error(error));

    if (window?.location?.hostname === 'api.quattfo.de') {
        global.myTeamId = 0;  // reason: do not show TeamSelectScreen for this host!
    }
}

// redundant Storage for emergency case if server is down
export function setScore(code, matchId, teamId) {
    if (code.substring(0, 5) === 'GOAL_') {
        let plusGoals = parseInt(code.substring(5, 6));

        AsyncStorage.getItem(scoreName)
            .then(response => response !== null ? response.toString() : null)
            .then((string) => {
                let json = JSON.parse(string)
                let newJson = {
                    [matchId]:
                        {
                            [teamId]: (parseInt(json && json[matchId] ? json[matchId][teamId] : 0) || 0) + plusGoals,
                        },
                }

                setAsyncStorage(scoreName, newJson, 1);
            })
            .catch((error) => console.error(error));
    }
}

export function syncScore(match, score) {
    let newJson = {
        [match.id]:
            {
                [match.team1_id]: (parseInt(score ? (score[match.team1_id] ?? 0) : 0) || 0),
                [match.team2_id]: (parseInt(score ? (score[match.team2_id] ?? 0) : 0) || 0),
            },
    }

    setAsyncStorage(scoreName, newJson, 1);
}

export function clearScores() {
    let newJson = {};

    setAsyncStorage(scoreName, newJson);
}

export async function getScore() {
    return AsyncStorage.getItem(scoreName);
}

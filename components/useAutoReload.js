import {useCallback} from 'react';
import {useFocusEffect} from "@react-navigation/native";

export function useAutoReload(route, data, loadScreenData, noModalsVisible) {
    let sur; // seconds until reload

    useFocusEffect(
        useCallback(() => {
            if (data?.object) {
                let f = data.object.secondsUntilReload?.filter(Number) ?? [];
                let minSecondsUntilReload = f.length ? Math.min(...f) : 0;

                switch (route.name) {
                    case 'AdminMatchPhotos':
                        sur = data.object.toCheck?.length ? 0 : 5 * 60;
                        break;
                    case 'AutoPilotSupervisor':
                        sur = (data.object.secondsUntilReload?.[1] ?? 0) - 11 * 60;
                        break;
                    case 'ListMatchesByRefereeCanceledTeamsSupervisor':
                    case 'RankingRefereeSubstSupervisor':
                    case 'RoundsMatchesAutoAdmin':
                    case 'RoundsMatchesManager':
                    case 'RoundsMatchesAdmin':
                    case 'RoundsMatchesSupervisor':
                        sur = global.settings.useLiveScouting ? 3 : 0;
                        break;
                    case 'ListMatchesByGroup':
                    case 'ListMatchesByTeam':
                    case 'MyMatchesCurrent':
                        sur = global.settings.useAutoReload ? minSecondsUntilReload : 0;
                        break;
                    case 'RoundsMatches':
                        sur = global.settings.useAutoReload ? minSecondsUntilReload : 0;
                        sur = (data.object.currentRoundId ?? 0) === route.params.id ? sur : 0;
                        break;
                    case 'MatchDetails':
                    case 'MatchDetailsAdmin':
                    case 'MatchDetailsSupervisor':
                        sur = global.settings.useAutoReload
                        && data.object[0].isTime2login
                        && !data.object[0].logsCalc.isResultConfirmed
                        && !data.object[0].canceled
                        && noModalsVisible
                            ? 60 : 0;
                        break;
                    case 'RankingInGroups':
                    case 'RankingInGroupsAdmin':
                        sur = global.settings.useAutoReload ? (data.object.secondsUntilReload?.[0] ?? 0) : 0;
                        break;
                    case 'RoundsCurrent':
                    case 'RoundsCurrentAdmin':
                    case 'RoundsCurrentSupervisor':
                        sur = global.settings.useAutoReload ? (data.object.secondsUntilReload?.[1] ?? 0) : 0;
                        break;
                    default:
                        sur = 0;
                }

                if (sur > 0) {
                    let timer = setTimeout(() => {
                        loadScreenData();
                    }, sur * 1000);

                    return () => clearTimeout(timer);
                }
            }
        }, [data]),
    );
}
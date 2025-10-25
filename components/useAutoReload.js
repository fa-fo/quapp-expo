import {useCallback} from 'react';
import {useFocusEffect} from "@react-navigation/native";
import {parseISO} from "date-fns";

export function useAutoReload(route, data, loadScreenData, noModalsVisible) {
    let sur; // seconds until reload

    useFocusEffect(
        useCallback(() => {
            if (data?.object && data.year) {
                let f = data.year.secondsUntilReload?.filter(Number) ?? [];
                let minSecondsUntilReload = f.length ? Math.min(...f) : 0;

                switch (route.name) {
                    case 'AdminMatchPhotos':
                        sur = data.object.toCheck?.length ? 0 : 5 * 60;
                        break;
                    case 'ListMatchesByRefereeCanceledTeamsSupervisor':
                    case 'RankingRefereeSubstSupervisor':
                    case 'RoundsMatchesAutoAdmin':
                    case 'RoundsMatchesManager':
                        sur = 3;
                        break;
                    case 'ListMatchesByGroup':
                    case 'ListMatchesByTeam':
                    case 'MyMatchesCurrent':
                        sur = minSecondsUntilReload;
                        break;
                    case 'RoundsMatches':
                        sur = minSecondsUntilReload;
                        sur = (data.object.currentRoundId ?? 0) === route.params.id ? sur : 0;
                        break;
                    case 'MatchDetails':
                        sur = !data.object[0].logsCalc.isResultConfirmed
                        && !data.object[0].canceled
                        && (parseISO(data.object[0].matchStartTime) < new Date() || global.settings.isTest)
                        && noModalsVisible
                            ? 60 : 0;
                        break;
                    case 'RankingInGroups':
                        sur = data.year.secondsUntilReload?.[0] ?? 0;
                        break;
                    case 'RoundsCurrent':
                        sur = data.year.secondsUntilReload?.[1] ?? 0;
                        break;
                    case 'RoundsMatchesAdmin':
                    case 'RoundsMatchesSupervisor':
                        sur = global.settings.useLiveScouting ? 3 : 0;
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

    return true;
}
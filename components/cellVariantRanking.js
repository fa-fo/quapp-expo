import TextC from "../components/customText";
import {View} from 'react-native';
import {Cell} from 'react-native-tableview-simple';
import {style} from '../assets/styles';

export default function CellVariantRanking(props) {
    return (
        <Cell
            {...props}
            cellStyle="RightDetail"
            accessory="DisclosureIndicator"
            cellContentView={
                <View
                    style={{
                        alignSelf: 'flex-start',
                        flexDirection: 'row',
                        flex: 1,
                        paddingVertical: 4,
                        borderBottomColor: '#3d8d02',
                        borderBottomWidth:
                            props.dayId === 1 &&
                            props.item.calcRanking > 0 &&
                            props.item.calcRanking % 4 === 0
                                ? 2
                                : 0,
                    }}>
                    <View style={{alignSelf: 'center', flex: 2.5}}>
                        <TextC
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={{
                                fontWeight: props.isMyTeam ? 'bold' : 'normal',
                                fontSize: 22,
                                textAlign: 'right',
                            }}>
                            {props.item.calcRanking ?? 0}.{' '}
                        </TextC>
                    </View>
                    <View style={{alignSelf: 'center', flex: 16}}>
                        <TextC
                            numberOfLines={1}
                            style={[
                                {
                                    fontWeight: props.isMyTeam ? 'bold' : 'normal',
                                    fontSize: 16,
                                },
                                props.item.canceled ? style().textRed : null,
                            ]}>
                            {props.item.team.name}
                        </TextC>
                        <View
                            style={{
                                alignSelf: 'flex-start',
                                flexDirection: 'row',
                                width: '100%',
                            }}>
                            <TextC
                                numberOfLines={1}
                                style={style().textRankingStats}>
                                {parseInt(props.item.calcCountMatches) || 0}
                            </TextC>
                            <TextC
                                numberOfLines={1}
                                style={style().textRankingStats}>
                                {(parseInt(props.item.calcGoalsScored) || 0) +
                                ':' +
                                (parseInt(props.item.calcGoalsReceived) || 0)}
                            </TextC>
                            <TextC
                                numberOfLines={1}
                                style={style().textRankingStats}>
                                {(props.item.calcGoalsDiff > 0 ? '+' : '') +
                                (parseInt(props.item.calcGoalsDiff) || 0)}
                            </TextC>
                            <TextC
                                numberOfLines={1}
                                style={style().textRankingStats}>
                                {(parseInt(props.item.calcPointsPlus) || 0) +
                                ':' +
                                (parseInt(props.item.calcPointsMinus) || 0)}
                            </TextC>
                        </View>
                    </View>
                </View>
            }
        />
    );
}

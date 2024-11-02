import {StyleSheet} from "react-native";
import * as ColorFunctions from "../components/functions/ColorFunctions";

export const style = () => StyleSheet.create({
    yellowBg: {
        backgroundColor: ColorFunctions.getColor('YellowBg')
    },
    buttonTopRight: {
        alignItems: 'center',
        marginVertical: 4,
        marginHorizontal: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: ColorFunctions.getColor('blue'),
    },
    button1: {
        alignItems: 'center',
        marginVertical: 6,
        marginHorizontal: 4,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 4,
        maxWidth: '100%',
        shadowOffset: {width: 5, height: 5},
        shadowColor: ColorFunctions.getColor('primary'),
        shadowRadius: 4,
        shadowOpacity: 0.25,
        backgroundColor: ColorFunctions.getColor('primaryBg')
    },
    buttonEvent: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    buttonConfirm: {
        alignItems: 'flex-start',
        marginVertical: 2,
        marginHorizontal: 2,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    buttonCancel: {
        marginVertical: 0,
        marginHorizontal: 6,
        paddingVertical: 2,
        paddingHorizontal: 4,
    },
    pickerSelect: {
        width: 300,
        color: ColorFunctions.getColor('primary'),
        backgroundColor: ColorFunctions.getColor('primaryBg'),
    },
    pickerItem: {
        color: ColorFunctions.getColor('primary'),
        backgroundColor: ColorFunctions.getColor('primaryBg'),
    },
    viewStatus: {
        alignItems: 'center',
        marginVertical: 2,
        marginHorizontal: 4,
        paddingVertical: 2,
        paddingHorizontal: 4,
        maxWidth: '95%',
    },
    buttonBig1: {
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 18,
        width: '100%',
    },
    buttonBigBB1: {
        width: '75%',
    },
    buttonBigBB2: {
        width: '85%',
    },
    buttonBigBB3: {
        marginBottom: 26,
        width: '95%',
    },
    buttonGreen: {
        backgroundColor: '#3d8d02'
    },
    buttonGreenLight: {
        backgroundColor: ColorFunctions.getColor('GreenLightBg')
    },
    buttonOrange: {
        backgroundColor: ColorFunctions.getColor('OrangeBg')
    },
    buttonRed: {
        backgroundColor: '#a33300'
    },
    buttonRed50: {
        backgroundColor: '#ef7842'
    },
    buttonGreyDark: {
        backgroundColor: '#4e4e4e',
        borderColor: '#3d8d02'
    },
    buttonGrey: {
        alignItems: 'center',
        backgroundColor: '#8b8b8b'
    },
    buttonGreyBright: {
        backgroundColor: '#c9c9c9',
        shadowColor: '#aaaaaa',
    },
    textButtonTopRight: {
        color: ColorFunctions.getColor('buttonTxt'),
        width: '100%'
    },
    foulCards: {
        paddingVertical: 5,
        paddingHorizontal: 4,
        borderWidth: 2
    },
    textButton1: {
        color: '#fff',
        width: '100%'
    },
    textButtonFoul: {
        color: '#fff',
        textDecorationLine: 'underline'
    },
    textInput: {
        paddingVertical: 4,
        paddingHorizontal: 6,
        elevation: 3,
        color: ColorFunctions.getColor('primary'),
        borderColor: '#3d8d02',
        borderWidth: 2,
    },
    testMode: {
        paddingVertical: 4,
        paddingHorizontal: 6,
        backgroundColor: ColorFunctions.getColor('TestHintBg'),
    },
    failureText: {
        paddingVertical: 4,
        paddingHorizontal: 6,
        backgroundColor: '#a33300',
        color: '#fff'
    },
    centeredText100: {
        width: '100%',
        textAlign: 'center'
    },
    actInd: {
        marginTop: 200,
    },
    teamInfos: {
        paddingVertical: 12,
        paddingHorizontal: 32,
    },
    logoView: {
        paddingVertical: 4,
        paddingHorizontal: 16,
    },
    logoImage: {
        width: 150,
        height: 210,
    },
    sportImage: {
        width: 16,
        height: 16,
    },
    matchDetailsView: {
        paddingTop: 18,
        paddingHorizontal: 5,
        alignItems: 'center',
    },
    headerComponentView: {
        paddingHorizontal: 8
    },
    matchflexRowView: {
        flexDirection: 'row',
        flex: 1,
        alignSelf: 'flex-start',
        flexWrap: 'wrap',
        width: '100%'
    },
    matchflexColumnView: {
        flexDirection: 'column',
        flex: 1,
        alignSelf: 'flex-start',
        alignItems: 'center',
        width: '100%'
    },
    matchflexEventsView: {
        marginVertical: 2,
        alignItems: 'center',
        width: '100%'
    },
    matchPressableView: {
        alignItems: 'center',
        width: '100%'
    },
    big1: {
        fontSize: 48,
        textAlign: 'center',
    },
    big2: {
        fontSize: 36,
        textAlign: 'center',
    },
    big2a: {
        fontSize: 32,
        textAlign: 'center',
    },
    big22: {
        fontSize: 22,
    },
    big3: {
        fontSize: 24,
    },
    small: {
        fontSize: 12,
    },
    viewCentered: {
        alignItems: 'center',
    },
    viewLeft: {
        alignItems: 'flex-start',
    },
    viewRight: {
        alignItems: 'flex-end',
    },
    textBlue: {
        color: ColorFunctions.getColor('blue'),
    },
    textViolet: {
        color: 'violet',
    },
    textRed: {
        color: '#a33300',
    },
    textGreen: {
        color: '#3d8d02',
    },
    textRankingStats: {
        flex: 1,
        color: '#8E8E93',
        fontSize: 14,
        textAlign: 'center',
    },
    drawerSectionView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    separatorLine: {
        flex: 1,
        backgroundColor: ColorFunctions.getColor('primary'),
        height: 1.2,
        marginLeft: 12,
        marginRight: 24,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: ColorFunctions.getColor('primaryBg'),
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: ColorFunctions.getColor('primary'),
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    topleftButtonContainer: {
        position: 'absolute',
        width: 100,
        top: 10,
        left: 16,
        marginTop: 10,
        marginRight: 10,
        alignItems: 'flex-start',
    },
    toprightButtonContainer: {
        position: 'absolute',
        width: 100,
        top: 10,
        right: 16,
        marginTop: 10,
        marginRight: 10,
        alignItems: 'flex-end',
    },
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 28,
        right: 16,
        width: '50%',
        alignItems: 'flex-end',
    },
    bottomLeftButtonContainer: {
        position: 'absolute',
        bottom: 28,
        left: 16,
        width: '50%',
        alignItems: 'flex-start',
    },
    matchImg: {
        alignItems: 'center',
        marginVertical: 6,
        marginHorizontal: 4,
        borderRadius: 4,
        elevation: 4,
        shadowOffset: {width: 5, height: 5},
        shadowColor: ColorFunctions.getColor('primary'),
        shadowRadius: 4,
        shadowOpacity: 0.25,
        backgroundColor: ColorFunctions.getColor('primaryBg'),
    },
    borderRed: {
        borderColor: '#a33300',
        borderWidth: 4
    },
    borderBlue: {
        borderColor: '#0155fd',
        borderWidth: 4
    }
});

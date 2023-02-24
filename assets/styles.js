import {StyleSheet} from "react-native";

export default StyleSheet.create({
    buttonTopRight: {
        alignItems: 'center',
        marginVertical: 4,
        marginHorizontal: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#0155fd',
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
        shadowColor: 'black',
        shadowOpacity: 0.1,
        backgroundColor: "white"
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
        width: 300
    },
    viewStatus: {
        alignItems: 'center',
        marginVertical: 2,
        marginHorizontal: 4,
        paddingVertical: 2,
        paddingHorizontal: 4,
        maxWidth: '95%'
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
    buttonOrange: {
        backgroundColor: 'orange'
    },
    buttonRed: {
        backgroundColor: '#a33300'
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
        color: '#fff'
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
        color: '#000',
        textDecorationLine: 'underline'
    },
    textInput: {
        paddingVertical: 4,
        paddingHorizontal: 6,
        elevation: 3,
        borderColor: '#3d8d02',
        borderWidth: 2,
    },
    testMode: {
        paddingVertical: 4,
        paddingHorizontal: 6,
        backgroundColor: '#ffd700',
    },
    failureText: {
        paddingVertical: 4,
        paddingHorizontal: 6,
        backgroundColor: '#a33300',
        color: '#fff'
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
        color: 'blue',
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
        backgroundColor: 'black',
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
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

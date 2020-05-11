import { StyleSheet, Dimensions, Platform } from 'react-native';

import constants from '../../../helpers/constants';

export default StyleSheet.create({
    videoWrapper: {
        height: 300,
        margin: 30,
    },

    headerContainer: {
        borderBottomColor: constants.highlightColor,
        borderBottomWidth: 1,
        paddingBottom: 20,
        paddingHorizontal: 20,
        marginVertical: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        width: Dimensions.get('window').width,
    },

    yesButton: {
        backgroundColor: constants.highlightColor,
        marginBottom: 10,
    },

    noButton: {
        backgroundColor: '#6C757D',
        marginBottom: 10,
    },

    close: {
        marginLeft: 'auto',
    },

    closeBtn: {
        padding: 5,
        color: '#000',
    },

    btnText: {
        color: '#fff',
    },

    modalHeaderStyle: {
        color: constants.highlightColor,
        fontSize: 20,
    },

    modalTextStyle: {
        paddingHorizontal: 20,
        fontSize: 18,
        lineHeight: 25,
    },

    logo: {
        width: Dimensions.get('window').width - 40,
        height: 100,
    },

    buttonContainer: {
        padding: 20,
        borderTopColor: constants.highlightColor,
        borderTopWidth: 1,
        marginTop: 20,
    },

    WebViewContainer: {
        marginTop: Platform.OS === 'ios' ? 20 : 0,
        marginBottom: 30,
    },
});

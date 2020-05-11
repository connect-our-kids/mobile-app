import { StyleSheet, Dimensions } from 'react-native';

import constants from '../../../helpers/constants';

export default StyleSheet.create({
    headerContainer: {
        borderBottomColor: constants.highlightColor,
        borderBottomWidth: 1,
        paddingBottom: 20,
        paddingHorizontal: 20,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'baseline',
        flexDirection: 'row',
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

    buttonContainer: {
        padding: 20,
        borderTopColor: '#0279AC',
        borderTopWidth: 1,
        marginTop: 20,
    },
});

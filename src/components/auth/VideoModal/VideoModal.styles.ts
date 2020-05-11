import { StyleSheet, Platform } from 'react-native';
import constants from '../../../helpers/constants';

export default StyleSheet.create({
    videoWrapper: {
        height: 300,
        margin: 30,
    },

    noButton: {
        backgroundColor: constants.highlightColor,
        marginBottom: 10,
    },

    close: {
        backgroundColor: '#6C757D',
        width: '100%',
    },

    btnText: {
        color: '#fff',
    },

    WebViewContainer: {
        marginTop: Platform.OS === 'ios' ? 20 : 0,
        marginBottom: 30,
    },
});

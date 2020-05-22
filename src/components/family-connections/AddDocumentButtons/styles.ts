import { StyleSheet } from 'react-native';
import constants from '../../../helpers/constants';

export default StyleSheet.create({
    button: {
        height: 45,
        flexGrow: 0,
        // backgroundColor: constants.highlightColor,
        color: constants.highlightColor,
        borderRadius: 16,
        alignItems: 'center',
        // width: '30%',
    },

    buttonLabel: {
        fontSize: 12,
        color: constants.highlightColor,
        alignItems: 'center',
    },
});

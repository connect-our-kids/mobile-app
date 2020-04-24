import { StyleSheet } from 'react-native';
import constants from '../../../helpers/constants';

export default StyleSheet.create({
    button: {
        flexGrow: 0,
        // backgroundColor: constants.highlightColor,
        color: constants.highlightColor,
        borderRadius: 16,
        padding: 8,
        margin: 4,
        alignItems: 'center',
        // width: '30%',
    },

    buttonLabel: {
        fontSize: 12,
        color: constants.highlightColor,
        alignItems: 'center',
    },
});

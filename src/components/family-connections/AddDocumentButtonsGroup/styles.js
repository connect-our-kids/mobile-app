import { StyleSheet } from 'react-native';
import constants from '../../../helpers/constants';

export default StyleSheet.create({

    buttonsGroup: {
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        padding: 4,
        width: '100%',
    },

    button: {
        flexGrow: 0,
        // backgroundColor: constants.highlightColor,
        color: constants.iconColor,
        borderRadius: 16,
        padding: 8,
        margin: 4,
        alignItems: 'center',
        // width: '30%',
    },

    buttonLabel: {
        fontSize: 12,
        color: constants.textColor,
        alignItems: 'center',
    },

});

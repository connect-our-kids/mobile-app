import { StyleSheet } from 'react-native';

import constants from '../../../helpers/constants';

/**********************************************************/

export default StyleSheet.create({

    scrollView: {
        width: '100%',
        height: '100%',
        backgroundColor: constants.backgroundColor,
        padding: 0,
        margin: 0,
    },

    container: {
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
        padding: 8,
        margin: 0,
    },

    content: {
        // width: '100%',
        margin: 8,
    },

    displayText: {
        padding: 2,
    },

    inputText: {
        padding: 8,
        borderRadius: 4,
        fontSize: 16,
        backgroundColor: constants.inputBackgroundColor,
    },

    header: {
        fontSize: 30,
        fontWeight: 'bold',
    },

    attachmentInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '25%',
        borderWidth: 0,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: constants.borderColor,
    },

    attachmentPreview: {
        width: '40%',
        height: '100%',
    },

    attachmentInfo: {
        paddingLeft: 16,
    },

    saveButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: constants.highlightColor,
        backgroundColor: constants.highlightColor,
    },

    saveButtonText: {
        fontSize: 30,
        color: constants.iconColor,
    },

});

import { StyleSheet } from 'react-native';

import constants from '../../../helpers/constants';

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
        fontSize: 16,
        padding: 8,
        borderColor: constants.inputBorderColor,
        borderRadius: constants.inputBorderRadius,
        borderWidth: constants.inputBorderWidth,
        backgroundColor: constants.inputBackgroundColor,
    },
    modal: {
        margin: 20,
        marginTop: 180,
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        alignContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
        borderTopWidth: constants.borderWidth,
        borderBottomWidth: constants.borderWidth,
        borderColor: constants.borderColor,
    },

    attachmentPreview: {
        width: '40%',
        height: '100%',
        paddingVertical: 8,
    },

    attachmentInfo: {
        paddingLeft: 16,
    },

    saveButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderWidth: constants.buttonBorderWidth,
        borderRadius: constants.buttonBorderRadius,
        borderColor: constants.buttonBorderColor,
        backgroundColor: constants.primaryButtonBackgroundColor,
    },

    saveButtonText: {
        fontSize: 30,
        color: constants.primaryButtonTextColor,
    },
});

import { StyleSheet } from 'react-native';
import constants from '../helpers/constants';

export default StyleSheet.create({
    background: {
        backgroundColor: 'white',
    },
    containerStyle: {
        flex: 0,
        marginHorizontal: 15,
    },
    requiredText: {
        color: 'red',
    },
    headerStyles: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        padding: 0,
    },
    headerImgStyles: {
        width: 240,
        height: 85,
    },
    centerModal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
    },
    modal: {
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 0.5,
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
    centerLoader: {
        marginRight: 80,
    },
    attachmentPreview: {
        padding: 27,
        marginTop: 5,
        marginBottom: 5,
        height: 100,
        width: 100,
        borderRadius: 48,
        overflow: 'hidden',
    },
    headerBtnView: {
        padding: 5,
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 30,
        borderRadius: 20,
    },
    TakePhotoBtnGroup: {
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        padding: 4,
        width: '100%',
        paddingLeft: 75,
        paddingRight: 75,
    },
    headerBtnView2: {
        display: 'none',
    },
    addCaseText: {
        color: '#0279AC',
        fontSize: 17,
    },
    statusTextContainer: {
        paddingTop: 30,
    },
    sectionPadding: {
        paddingTop: 15,
    },
    textPadding: {
        paddingTop: 10,
        color: 'rgba(24,23,21,.5)',
    },
    sectionHeader: {
        fontSize: 20,
        borderBottomColor: 'rgba(24,23,21,.5)',
        borderBottomWidth: 0.5,
        color: '#0279AC',
    },
    dropdownContainer: {
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: 0.5,
        borderRadius: 5,
        width: '100%',
    },
    dropdownContainerRequired: {
        borderColor: 'red',
        borderWidth: 0.5,
        borderRadius: 5,
    },
    suffixDropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: 0.5,
        borderRadius: 5,
        marginTop: 5,
        width: '100%',
    },
    genderDropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: 0.5,
        borderRadius: 5,
        marginTop: 5,
        width: '100%',
    },
    nameInputContainer: {
        width: '100%',
        marginTop: 10,
    },
    formContainer: {
        width: '100%',
        marginTop: 10,
    },
    fosterCareDateContainer: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 10,
    },
    addressContainer: {
        marginTop: 10,
        justifyContent: 'space-between',
    },
    textInput: {
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: 0.5,
        height: 45,
        paddingLeft: 5,
        borderRadius: 5,
        flexGrow: 1,
    },
    textInputRequired: {
        borderColor: 'red',
        borderWidth: 0.5,
        width: '100%',
        height: 45,
        paddingLeft: 5,
        borderRadius: 5,
    },
    addressInput: {
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: 0.5,
        width: '100%',
        height: 45,
        paddingLeft: 5,
        borderRadius: 5,
    },
    telephoneInput: {
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: 0.5,
        height: 45,
        paddingLeft: 5,
        borderRadius: 5,
        flexGrow: 1,
    },
    salaryDropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: 0.5,
        borderRadius: 5,
        marginTop: 5,
        width: 225,
    },
    cityInput: {
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: 0.5,
        width: '100%',
        height: 45,
        marginTop: 10,
        paddingLeft: 5,
        marginRight: 5,
        borderRadius: 5,
    },
    zipInput: {
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: 0.5,
        width: '100%',
        height: 45,
        paddingLeft: 5,
        marginRight: 5,
        borderRadius: 5,
    },
    highlightContainer: {
        width: '100%',
    },
    highlightInput: {
        height: 100,
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: 0.5,
        borderRadius: 5,
        paddingLeft: 5,
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingTop: 10,
        paddingBottom: 10,
    },
    cancelButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 96,
        height: 36,
        borderRadius: 5,
        borderWidth: 0.5,
        marginTop: 20,
        borderColor: '#0279AC',
    },
    saveButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 96,
        height: 36,
        borderRadius: 5,
        borderWidth: 0.5,
        marginTop: 20,
        backgroundColor: '#0279AC',
        borderColor: '#0279AC',
    },
    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        padding: 35,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 96,
        height: 36,
        borderRadius: 50,
        borderWidth: 1,
        marginTop: 20,
        backgroundColor: constants.highlightColor,
        borderColor: constants.highlightColor,
    },

    modalButtonText: {
        fontSize: 14,
        textTransform: 'uppercase',
        color: '#fff',
    },
});

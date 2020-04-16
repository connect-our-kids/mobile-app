import { StyleSheet } from 'react-native';

/**********************************************************/

export default StyleSheet.create({
    logInBtns: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly',
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
    },
    mainText: {
        fontSize: 16,
        lineHeight: 26,
        marginBottom: 4,
    },
    linkText: {
        color: '#0279AC',
        marginTop: 20,
        textAlign: 'center',
        marginBottom: 20,
    },

    linkContainer: {
        justifyContent: 'space-between',
        flex: 1,
        marginTop: 40,
    },

    buttonStyle: {
        flex: 1,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#0279AC',
    },

    btnText: {
        color: '#fff',
    },
});

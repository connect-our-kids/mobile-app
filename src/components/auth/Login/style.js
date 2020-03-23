import { StyleSheet } from 'react-native';


export default StyleSheet.create({

    logInBtns: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly',
    },

    logOutText: {
        color: 'rgb(8,121,169)',
    },

    linkContainer: {
        justifyContent: 'space-between',
        flex: 1,
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

    button: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 10,
    },

    text: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 6,
        fontSize: 15,

    },

    view1: {
        width: '100%',
    },

    view2: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
    },

    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#E5E4E2',
        marginTop: 20,
        marginBottom: 6,
    },

    view3: {
        paddingLeft: 10,
    },

    view3Text: {
        fontWeight: 'bold',
        fontSize: 20,
    },

    view4: {
        flexDirection: 'row',
        padding: 10,
    },

    view5: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
        width: '30%',
    },

    view5Text: {
        marginTop: 6,
        marginBottom: 6,
        fontSize: 16,
    },

    view6: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '70%',
    },

    view7: {
        width: '100%',
        borderBottomColor: '#E5E4E2',
        borderBottomWidth: 1,
    },

    view8And9: {
        width: '100%',
        borderBottomColor: '#E5E4E2',
        borderBottomWidth: 1,
    },


    view10: {
        width: '50%',
        marginTop: 40,
    },

    view10Button: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgb(8,121,169)',
        borderWidth: 1,
    },
});

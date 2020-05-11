import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    VideoContainer: {
        justifyContent: 'center',
        width: '100%',
        height: 300,
        marginBottom: 10,
    },

    WebViewContainer: {
        marginTop: Platform.OS == 'ios' ? 20 : 0,
    },
});

import { StyleSheet } from 'react-native';
import constants from '../../../helpers/constants';

export default StyleSheet.create({
    gridContainer: {
        padding: 20,
        alignItems: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    rowLabelText: {
        textAlign: 'right',
    },
    imageContainer: {
        alignItems: 'flex-end',
    },
    rowImage: {
        width: 75,
        height: 75,
    },
    colList: {
        marginLeft: 20,
    },
    colListContainer: {
        marginBottom: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    colListText: {
        color: constants.highlightColor,
        width: '100%',
    },
    colListLabelText: {
        fontSize: 12,
        color: '#bbb',
        marginRight: 12,
    },
    cardNameText: {
        fontSize: 20,
        marginBottom: 5,
    },
    cardInformationText: {
        fontSize: 14,
    },
});

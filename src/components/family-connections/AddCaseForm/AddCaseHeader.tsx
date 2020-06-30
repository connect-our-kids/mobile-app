//Also contains Add Case button used in TopLevelNavigationOptions2 in the navigation index
import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import logoImg from '../../../../assets/logo.png';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import { RootState } from '../../../store/reducers';
import constants from '../../../helpers/constants';
import { Roles } from '../../../generated/globalTypes';

type StateProps = {
    hasPermission: boolean;
};

type Navigation = NavigationScreenProp<NavigationState>;

type OwnProps = {
    navigation: Navigation;
};

type DispatchProps = unknown;

type Props = StateProps & OwnProps;

function AddCaseHeader(props: Props) {
    return (
        <View
            style={{
                height: 71,
                backgroundColor: constants.backgroundColor,
                marginTop: 15,
                borderBottomColor: '#E5E4E2',
                borderBottomWidth: 1,
                elevation: 2,
            }}
        >
            <View style={styles.headerStyles}>
                <Image
                    style={styles.headerImgStyles}
                    source={logoImg}
                    resizeMode="contain"
                />
                <TouchableOpacity
                    style={
                        props.hasPermission
                            ? styles.headerBtnView
                            : styles.headerBtnView2
                    }
                    activeOpacity={0.6}
                    onPress={() => {
                        props.navigation.navigate('AddCaseScreen');
                    }}
                >
                    <Ionicons name="md-add" size={24} color="#0279AC" />
                    <Text style={styles.addCaseText}> Add Case </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const mapStateToProps = (state: RootState) => {
    const myRoles = state.me?.results?.userTeams?.map((team) => team.role) ?? [
        Roles.NONE,
    ];
    const hasPermission = myRoles.find(
        (role) =>
            role === Roles.CASE_CREATOR ||
            role === Roles.EDITOR ||
            role === Roles.MANAGER
    )
        ? true
        : false;

    return {
        hasPermission,
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(
    mapStateToProps,
    {}
)(AddCaseHeader);

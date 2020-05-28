//Also contains Add Case button used in TopLevelNavigationOptions2 in the navigation index
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from './styles';
import { RootState } from '../../../store/reducers';
import constants from '../../../helpers/constants';
import { StackNavigationOptions } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import { Roles } from '../../../generated/globalTypes';

type StateProps = {
    myRole?: Roles;
};

type Navigation = NavigationScreenProp<NavigationState>;

type OwnProps = {
    navigation: Navigation;
    options: StackNavigationOptions;
};

type DispatchProps = {};

type Props = StateProps & OwnProps;

function AddPersonHeader(props: Props) {
    const [hideHeader, setHideHeader] = useState(false);
    useEffect(() => {
        setHideHeader(false);
    }, []);

    return (
        <View
            style={
                hideHeader
                    ? { display: 'none' }
                    : {
                          height: 70,
                          backgroundColor: constants.backgroundColor,
                          marginTop: 6,
                          paddingBottom: 78,
                          borderBottomColor: '#E5E4E2',
                          borderBottomWidth: 1,
                          elevation: 2,
                          width: '100%',
                          marginLeft: 'auto',
                      }
            }
        >
            <View style={styles.headerStyles}>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.goBack();
                        setHideHeader(true);
                    }}
                    style={styles.goBackRelacement}
                >
                    <Ionicons
                        name="ios-arrow-back"
                        size={32}
                        color="#0279AC"
                        style={{
                            width: 15,
                            height: 30,
                            paddingRight: 0,
                            marginLeft: 10,
                            marginTop: 8,
                        }}
                    />
                    <Text
                        style={[
                            styles.backToCasesText,
                            { marginLeft: 0, paddingLeft: 3 },
                        ]}
                    >
                        {props.options.headerBackTitle}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.goBack();
                        setHideHeader(true);
                    }}
                    style={styles.goBackReplacementAndroid}
                >
                    <MaterialIcons
                        name="arrow-back"
                        size={26}
                        color="#0279AC"
                    />
                    <Text style={styles.addPersonTextAndroid}>
                        {props.options.headerTitle}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={
                        props.myRole === Roles.EDITOR ||
                        Roles.MANAGER ||
                        Roles.CASE_CREATOR
                            ? styles.headerBtnView
                            : styles.headerBtnView2
                    }
                    activeOpacity={0.6}
                    onPress={() => {
                        props.navigation.navigate('AddRelationshipScreen');
                    }}
                >
                    <Ionicons
                        name="md-add"
                        size={24}
                        color="#0279AC"
                        style={{ paddingTop: 6 }}
                    />
                    <Text style={styles.addCaseText}> Add Person </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const mapStateToProps = (state: RootState) => {
    const myRole = state.me?.results?.userTeam?.role;

    return {
        myRole,
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(
    mapStateToProps,
    {}
)(AddPersonHeader);

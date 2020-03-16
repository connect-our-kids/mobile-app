import React from 'react';
// import { Card, ListItem, Button, Icon } from 'react-native-elements'
// import { Avatar, Badge, withBadge } from 'react-native-elements'
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    StatusBar,
    TextInput,
    ActivityIndicator,
    ScrollView,
    Platform,
    TouchableHighlight,
    Alert,
} from 'react-native';
import { connect } from 'react-redux';
import {
    getCaseData,
    getUserCases,
} from '../store/actions';
import axios from 'axios';
import {
    ListItem,
    SearchBar,
    Button,
    CheckBox,
    Divider,
    Badge,
    SocialIcon,
} from 'react-native-elements';
import * as TelephoneHelpers from '../helpers/telephoneHelpers.js';

const placeholderImg = require('../../assets/profile_placeholder.png');

const getBackgroundColor = (person) => {
    if(person.status === null) {
        return 'white'
    }

    return person.status.color;
}

const getTextColor = (person) => {

    if(person.status === null) {
        return '#5A6064'
    }

    return 'white';

}

const CaseListComponent = (props) => {
    return (
        <View style={{ width: '100%', paddingLeft: 5, paddingRight: 10 }}>
                 <View>

                    <ListItem
                        title={props.connection.person.full_name}
                        titleStyle={{ color: getTextColor(props.connection.person) }}
                        subtitle={props.connection.person.title}
                        subtitleStyle={{ color: getTextColor(props.connection.person) }}
                        containerStyle={{backgroundColor: getBackgroundColor(props.connection.person), borderRadius: 5, marginTop: 5}}
                        leftAvatar={
                            <View
                                style={{ height: 50,
                                    width: 50,
                                    borderRadius: 25,
                                    overflow: 'hidden' }}
                            >
                           {props.connection.person.picture
                                ? <Image
                                    source={{ uri: props.connection.person.picture }}
                                    style={{ height: 50,
                                        width: 50,
                                        borderRadius: 25,
                                        overflow: 'hidden' }}
                                    defaultSource = {placeholderImg}
                                />
                                : <Image
                                    source={placeholderImg}
                                    style={{ height: 50,
                                        width: 50,
                                        borderRadius: 25,
                                        overflow: 'hidden' }}
                                />}
                            </View>
                        }
                        onPress={async () => {
                            props.pressed();

                        }}
                    />


                </View>

        </View>
    );


};

export default CaseListComponent;

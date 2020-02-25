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

const CaseListComponent = (props) => {
    return (
        <View style={{ paddingLeft: 2, paddingRight: 2 }}>
            {props.connection.person.status
                ? <View>

                    <ListItem
                        title={props.connection.person.full_name}
                        titleStyle={{ color: '#5A6064' }}
                        subtitle={TelephoneHelpers.format(TelephoneHelpers.selectPrimaryTelephone(props.connection.person))}
                        subtitleStyle={{ color: '#5A6064' }}
                        leftAvatar={
                            <View
                                style={{ height: 50,
                                    width: 50,
                                    borderRadius: 25,
                                    overflow: 'hidden' }}
                            >
                                <Image
                                    source={{ uri: props.connection.person.picture }}
                                    style={{ height: 50,
                                        width: 50,
                                        borderRadius: 25,
                                        overflow: 'hidden' }}
                                    defaultSource = {placeholderImg}
                                />
                            </View>
                        }
                        onPress={async () => {
                            props.pressed();

                        }}
                    />
                    {/* <Text style= {{position: "absolute", bottom: 15, left: 15, backgroundColor: props.connection.person.status.color}}> </Text> */}
                    <SocialIcon style={{ position: 'absolute', bottom: 5, left: 5, backgroundColor: props.connection.person.status.color, height: 18, width: 18 }}/>

                </View>
                : <ListItem
                    title={props.connection.person.full_name}
                    titleStyle={{ color: '#5A6064' }}
                    subtitle={TelephoneHelpers.format(TelephoneHelpers.selectPrimaryTelephone(props.connection.person))}
                    subtitleStyle={{ color: '#5A6064' }}
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
            }
        </View>
    );


};

export default CaseListComponent;



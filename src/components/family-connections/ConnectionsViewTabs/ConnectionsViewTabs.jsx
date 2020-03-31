import React from 'react';

import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Modal,
    StatusBar,
    TextInput,
    ActivityIndicator,
    ScrollView,
    Platform,
    TouchableHighlight,
    Alert,
    Image,
    Linking,
} from 'react-native';
import { ListItem, Button, Avatar } from 'react-native-elements';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AttachmentIcon from '../Attachment/AttachmentIcon';
import moment from 'moment';

const placeholderImg = require('../../../../assets/profile_placeholder.png');

export const Engagement = (props) => {

    const getDataIcon = () => {
        if (props.engagement.data_type === 'N') {
            return <MaterialIcons name='note-add' size={16} color='#0F6580' />;
        }
        else if (props.engagement.data_type === 'E') {
            return <MaterialCommunityIcons name='email-plus' size={16} color='#0F6580' />;
        }
        else if (props.engagement.data_type === 'C') {
            return <MaterialCommunityIcons name='phone-plus' size={16} color='#0F6580' />;
        }
        else if (props.engagement.data_type === 'R') {
            return <MaterialCommunityIcons name='reminder' size={16} color='#0F6580' />;
        }
        else if (props.engagement.data_type === 'D') {
            return 'Document';
        }
        else {
            return props.engagement.data_type;
        }
    };

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginBottom: 20,
            }}
            key={props.engagement.pk}
        >
            {props.engagement.created_by.picture
                ? <Image
                    style={{ height: 50, width: 50, borderRadius: 25, overflow: 'hidden', marginLeft: 5, marginRight: 15, marginTop: 5 }}
                    source={{ uri: props.engagement.created_by.picture }}
                    defaultSource = {placeholderImg}
                />
                : <Image
                    style={{ height: 50, width: 50, borderRadius: 25, overflow: 'hidden', marginLeft: 5, marginRight: 15, marginTop: 5 }}
                    source={placeholderImg}
                />}
            <View>
                <Text style={{ fontSize: 16 }}>{props.engagement.created_by.full_name} {getDataIcon()} {props.engagement.data_type === 'R' && props.engagement.due_date ? `Due: ${props.engagement.due_date.substring(0, 10)}` : null}</Text>
                {props.engagement.subject ? <Text>Subject: {props.engagement.subject}</Text> : null}
                {props.engagement.document && props.engagement.document.title ? <Text>Title: {props.engagement.document.title}</Text> : null}
                <Text numberOfLines={1}>{props.engagement.data_type === 'D' ? props.engagement.document.notes : props.engagement.notes}</Text>
                <Text style={{ color: 'gray' }}>{moment(props.engagement.created_at).format('MMM Do YYYY, h:mm a')}</Text>
            </View>
            {/* <View>
    <Text style={{fontSize: 16}}>{props.engagement.created_by.full_name} {getDataIcon()} {props.engagement.data_type === 'R' && props.engagement.due_date ? `Due: ${props.engagement.due_date.substring(0, 10)}` : null}</Text>
        {props.engagement.subject ? <Text>Subject: {props.engagement.subject}</Text> : null}
        <Text>{props.engagement.note}</Text>
        <Text style={{color: 'gray'}}>{moment(props.engagement.created_at).format('MMM Do YYYY, h:mm a')}</Text>
      </View> */}
        </View>
    );
};

export const Documents = (props) => {

    return (
        <View>
            <ListItem
                title={props.document.title}
                titleStyle={{ color: '#5A6064' }}
                leftIcon={(<AttachmentIcon attachment={props.document}/>)}
                topDivider={true}
                onPress={() => Linking.openURL(props.document.attachment)}
                subtitle={
                    <View>
                        <Text>{props.document.created_by.full_name}</Text>
                        <Text>{moment(props.document.created_at).format('MMM Do YYYY, h:mm a')}</Text>
                    </View>
                }
                chevron
            />
        </View>
    );
};

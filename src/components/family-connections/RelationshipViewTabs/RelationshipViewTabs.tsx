import React, { useEffect, useRef } from 'react';

import { Text, View, Image, Linking, Animated } from 'react-native';
import { ListItem, colors } from 'react-native-elements';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AttachmentIcon from '../Attachment/AttachmentIcon';
import moment from 'moment';
import {
    engagements_engagements,
    engagements_engagements_EngagementDocument,
} from '../../../generated/engagements';

import placeholderImg from '../../../../assets/profile_placeholder.png';

const getNotes = (engagement: engagements_engagements): string => {
    switch (engagement.__typename) {
        case 'EngagementCall':
        case 'EngagementDocument':
        case 'EngagementEmail':
        case 'EngagementNote':
        case 'EngagementReminder':
            return engagement.notes;
        default:
            return '';
    }
};

const getDataIcon = (engagement: engagements_engagements): JSX.Element => {
    if (engagement.__typename === 'EngagementNote') {
        return <MaterialIcons name="note-add" size={16} color="#0F6580" />;
    } else if (engagement.__typename === 'EngagementEmail') {
        return (
            <MaterialCommunityIcons
                name="email-plus"
                size={16}
                color="#0F6580"
            />
        );
    } else if (engagement.__typename === 'EngagementCall') {
        return (
            <MaterialCommunityIcons
                name="phone-plus"
                size={16}
                color="#0F6580"
            />
        );
    } else if (engagement.__typename === 'EngagementReminder') {
        return (
            <MaterialCommunityIcons name="reminder" size={16} color="#0F6580" />
        );
    } else if (engagement.__typename === 'EngagementDocument') {
        return <Text>Doc</Text>;
    } else {
        return <Text>Unknown</Text>;
    }
};

interface EngagementsProps {
    engagement: engagements_engagements;
    newEngagement?: boolean;
    newEngagementID?: number;
}

export const Engagement = (props: EngagementsProps): JSX.Element => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1600,
            useNativeDriver: false,
        }).start();
    };

    useEffect(() => {
        if (
            props.engagement.id === props.newEngagementID &&
            props.newEngagement
        ) {
            fadeIn();
        }
    }, [props.newEngagement]);

    return (
        <Animated.View
            style={
                props.engagement.id === props.newEngagementID &&
                props.newEngagement
                    ? {
                          opacity: fadeAnim, // Bind opacity to animated value
                      }
                    : {}
            }
        >
            <View
                style={[
                    {
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        marginBottom: 20,
                        width: 390,
                    },
                    props.engagement.id === props.newEngagementID &&
                    props.newEngagement
                        ? {
                              backgroundColor: colors.primary,
                          }
                        : {},
                ]}
                key={props.engagement.id}
            >
                {props.engagement.createdBy?.picture ? (
                    <Image
                        style={{
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                            overflow: 'hidden',
                            marginLeft: 5,
                            marginRight: 15,
                            marginTop: 5,
                        }}
                        source={{ uri: props.engagement.createdBy?.picture }}
                        defaultSource={placeholderImg}
                    />
                ) : (
                    <Image
                        style={{
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                            overflow: 'hidden',
                            marginLeft: 5,
                            marginRight: 15,
                            marginTop: 5,
                        }}
                        source={placeholderImg}
                    />
                )}
                <View>
                    <Text style={{ fontSize: 16 }}>
                        {props.engagement.createdBy?.name}{' '}
                        {getDataIcon(props.engagement)}
                    </Text>
                    {props.engagement.__typename === 'EngagementEmail' &&
                    props.engagement.subject ? (
                        <Text>Subject: {props.engagement.subject}</Text>
                    ) : null}
                    {props.engagement.__typename === 'EngagementDocument' &&
                    props.engagement.title ? (
                        <Text>Title: {props.engagement.title}</Text>
                    ) : null}
                    <Text numberOfLines={1}>{getNotes(props.engagement)}</Text>
                    <Text style={{ color: 'gray' }}>
                        {moment(props.engagement.createdAt).format(
                            'MMM Do YYYY, h:mm a'
                        )}
                    </Text>
                </View>
                {/* <View>
    <Text style={{fontSize: 16}}>{props.engagement.createdBy.full_name} {getDataIcon()} {props.engagement.data_type === 'R' && props.engagement.due_date ? `Due: ${props.engagement.due_date.substring(0, 10)}` : null}</Text>
        {props.engagement.subject ? <Text>Subject: {props.engagement.subject}</Text> : null}
        <Text>{props.engagement.note}</Text>
        <Text style={{color: 'gray'}}>{moment(props.engagement.created_at).format('MMM Do YYYY, h:mm a')}</Text>
      </View> */}
            </View>
        </Animated.View>
    );
};

interface DocumentsProps {
    document: engagements_engagements_EngagementDocument;
    documentError?: string;
    newDocument?: boolean;
    newDocumentID?: number;
}

export const Documents = (props: DocumentsProps): JSX.Element => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1600,
            useNativeDriver: false,
        }).start();
    };

    useEffect(() => {
        if (props.document.id === props.newDocumentID && props.newDocument) {
            fadeIn();
        }
    }, [props.newDocument]);

    return (
        <Animated.View
            style={
                props.document.id === props.newDocumentID && props.newDocument
                    ? {
                          opacity: fadeAnim, // Bind opacity to animated value
                      }
                    : {}
            }
        >
            <ListItem
                containerStyle={
                    props.documentError
                        ? { backgroundColor: 'rgba(0,0,0,0.0)' }
                        : props.document.id === props.newDocumentID &&
                          props.newDocument
                        ? {
                              backgroundColor: colors.primary,
                          }
                        : {}
                }
                title={props.document.title}
                titleStyle={{ color: '#5A6064' }}
                leftIcon={
                    <AttachmentIcon
                        attachment={
                            props.document.originalFileName ?? undefined
                        }
                    />
                }
                topDivider={true}
                onPress={(): Promise<unknown> =>
                    Linking.openURL(props.document.attachment)
                }
                subtitle={
                    <View>
                        {props.document.createdBy ? (
                            <Text>{props.document.createdBy.name}</Text>
                        ) : null}
                        <Text>
                            {moment(props.document.createdAt).format(
                                'MMM Do YYYY, h:mm a'
                            )}
                        </Text>
                    </View>
                }
                chevron
            />
        </Animated.View>
    );
};

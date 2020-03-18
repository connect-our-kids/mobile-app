import React from 'react';

import {
    View,
    Image,
} from 'react-native';

import { ListItem } from 'react-native-elements';

const placeholderImg = require('../../../assets/profile_placeholder.png');

/**********************************************************/

function getBackgroundColor(person) {

    return (
        (person.status === null)
            ? 'white'
            : person.status.color
    );

}

function getTextColor(person) {

    return (
        (person.status === null)
            ? '#5A6064'
            : 'white'
    );

}

/**********************************************************/

export default function CaseList(props) {

    return (
        <View style={{
            width: '100%',
            paddingLeft: 5,
            paddingRight: 10,
        }}>
            <View>
                <ListItem
                    onPress={async () => {
                        props.pressed();
                    }}
                    title={props.connection.person.full_name}
                    titleStyle={{
                        color: getTextColor(props.connection.person),
                    }}
                    subtitle={props.connection.person.title}
                    subtitleStyle={{
                        color: getTextColor(props.connection.person),
                    }}
                    containerStyle={{
                        backgroundColor: getBackgroundColor(props.connection.person),
                        borderRadius: 5,
                        marginTop: 5,
                    }}
                    leftAvatar={
                        <View
                            style={{
                                height: 50,
                                width: 50,
                                borderRadius: 25,
                                overflow: 'hidden',
                            }}
                        >
                            {(props.connection.person.picture)
                                ? (
                                    <Image
                                        source={{ uri: props.connection.person.picture }}
                                        defaultSource={placeholderImg}
                                        style={{
                                            height: 50,
                                            width: 50,
                                            borderRadius: 25,
                                            overflow: 'hidden',
                                        }}
                                    />
                                )
                                : (
                                    <Image
                                        source={placeholderImg}
                                        style={{
                                            height: 50,
                                            width: 50,
                                            borderRadius: 25,
                                            overflow: 'hidden',
                                        }}
                                    />
                                )
                            }
                        </View>
                    }
                />
            </View>
        </View>
    );

}

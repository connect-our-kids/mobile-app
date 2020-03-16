import React from 'react';

import {
    View,
    Image,
} from 'react-native';

import {
    ListItem,
} from 'react-native-elements';

const placeholderImg = require('../../../assets/profile_placeholder.png');

/**********************************************************/

function getBackgroundColor(person) {

    if (person.status === null) {
        return 'white';
    }

    return person.status.color;

}

function getTextColor(person) {

    if (person.status === null) {
        return '#5A6064';
    }

    return 'white';

}

/**********************************************************/

export default function CaseList(props) {
    return (
        <View style={{ width: '100%', paddingLeft: 5, paddingRight: 10 }}>
            <View>
                <ListItem
                    title={props.connection.person.full_name}
                    titleStyle={{ color: getTextColor(props.connection.person) }}
                    subtitle={props.connection.person.title}
                    subtitleStyle={{ color: getTextColor(props.connection.person) }}
                    containerStyle={{ backgroundColor: getBackgroundColor(props.connection.person), borderRadius: 5, marginTop: 5 }}
                    leftAvatar={
                        <View
                            style={{
                                height: 50,
                                width: 50,
                                borderRadius: 25,
                                overflow: 'hidden',
                            }}
                        >
                            {props.connection.person.picture
                                ? <Image
                                    source={{ uri: props.connection.person.picture }}
                                    style={{
                                        height: 50,
                                        width: 50,
                                        borderRadius: 25,
                                        overflow: 'hidden',
                                    }}
                                    defaultSource = {placeholderImg}
                                />
                                : <Image
                                    source={placeholderImg}
                                    style={{
                                        height: 50,
                                        width: 50,
                                        borderRadius: 25,
                                        overflow: 'hidden',
                                    }}
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
}

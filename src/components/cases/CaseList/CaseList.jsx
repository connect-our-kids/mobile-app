import React from 'react';
import styles from './CaseList.styles';

import {
    View,
    Image,
} from 'react-native';

import { ListItem } from 'react-native-elements';

import sage from 's-age';

import * as GenderUtil from '../../../helpers/genderUtil';

const placeholderImg = require('../../../../assets/profile_placeholder.png');

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

function generateSubTitle(person) {


    var value = person.title;

    if(!value)
        value = "";

    if(person.gender) {
        if(value.length > 0)
            value += "\r\n";
         value += GenderUtil.genderEnumToString(person.gender);
    }


    if(person.birthday
        && person.birthday?.day
        && person.birthday?.month
        && person.birthday?.year) {

        if(value.length > 0) {
            value +=", ";
        }

        value += sage(new Date(person.birthday.year, person.birthday.month - 1, person.birthday.day)) + " Years Old";
    }

    return value;
}

/**********************************************************/

export default function CaseList(props) {

    return (
        <View style={styles.caseListWrapper}>
            <View>
                <ListItem
                    onPress={async () => {
                        props.pressed();
                    }}
                    title={props.connection.person.full_name}
                    titleStyle={{
                        color: getTextColor(props.connection.person),
                    }}
                    subtitle={generateSubTitle(props.connection.person)}
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
                            style={styles.avatarStyle}
                        >
                            {(props.connection.person.picture)
                                ? (
                                    <Image
                                        source={{ uri: props.connection.person.picture }}
                                        defaultSource={placeholderImg}
                                        style={styles.pictureStyle}
                                    />
                                )
                                : (
                                    <Image
                                        source={placeholderImg}
                                        style={styles.placeholderImgStyle}
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

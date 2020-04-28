import React from 'react';
import styles from './CaseList.styles';
import { View, Image } from 'react-native';
import { ListItem } from 'react-native-elements';
import placeholderImg from '../../../../assets/profile_placeholder.png';
import {
    RelationshipDetailSlim,
    RelationshipDetailSlim_person,
} from '../../../generated/RelationshipDetailSlim';
import { createPersonSubtitle } from '../../../helpers/personSubtitle';

/**********************************************************/

function getBackgroundColor(relationship: RelationshipDetailSlim) {
    return relationship.status === null ? 'white' : relationship.status.color;
}

function getTextColor(relationship: RelationshipDetailSlim) {
    return relationship.status === null ? '#5A6064' : 'white';
}

function generateSubTitle(person: RelationshipDetailSlim_person) {
    if (person.title) {
        return `${person.title}\r\n${createPersonSubtitle(person)}`;
    } else {
        return `${createPersonSubtitle(person)}`;
    }
}

export default function RelationshipListItem(props: {
    relationship: RelationshipDetailSlim;
    pressed?: () => void;
}) {
    return (
        <View style={styles.caseListWrapper}>
            <View>
                <ListItem
                    onPress={async () => {
                        props.pressed?.();
                    }}
                    title={props.relationship.person.fullName}
                    titleStyle={{
                        color: getTextColor(props.relationship),
                    }}
                    subtitle={generateSubTitle(props.relationship.person)}
                    subtitleStyle={{
                        color: getTextColor(props.relationship),
                    }}
                    containerStyle={{
                        backgroundColor: getBackgroundColor(props.relationship),
                        borderRadius: 5,
                        marginTop: 5,
                    }}
                    leftAvatar={
                        <View style={styles.avatarStyle}>
                            {props.relationship.person.picture ? (
                                <Image
                                    source={{
                                        uri: props.relationship.person.picture,
                                    }}
                                    defaultSource={placeholderImg}
                                    style={styles.pictureStyle}
                                />
                            ) : (
                                <Image
                                    source={placeholderImg}
                                    style={styles.placeholderImgStyle}
                                />
                            )}
                        </View>
                    }
                />
            </View>
        </View>
    );
}

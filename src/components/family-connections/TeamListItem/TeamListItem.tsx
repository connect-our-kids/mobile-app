import React from 'react';
import styles from './TeamListItem.styles';
import { View, Image, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import placeholderImg from '../../../../assets/profile_placeholder.png';
import { meQuery_me_userTeams } from '../../../generated/meQuery';
import { Roles } from '../../../generated/globalTypes';

const generateSubTitle = (
    team: meQuery_me_userTeams,
    hasPermission: boolean
) => (
    <>
        {!hasPermission && (
            <Text
                style={{
                    color: '#5A6064',
                }}
            >
                {'No permission to create case'}
            </Text>
        )}
    </>
);

export default function TeamListItem(props: {
    team: meQuery_me_userTeams;
    pressed?: (id: number) => void;
}) {
    const hasPermission =
        props.team.role === Roles.CASE_CREATOR ||
        props.team.role === Roles.EDITOR ||
        props.team.role === Roles.MANAGER;
    return (
        <ListItem
            style={styles.listItem}
            onPress={async () => {
                if (hasPermission) {
                    props.pressed?.(props.team.team.id);
                }
            }}
            title={props.team.team.name}
            titleStyle={{
                color: '#5A6064',
            }}
            subtitle={generateSubTitle(props.team, hasPermission)}
            subtitleStyle={{
                color: '#5A6064',
            }}
            containerStyle={{
                backgroundColor: 'white',
                borderRadius: 5,
                borderWidth: 1,
                opacity: hasPermission ? 1 : 0.5,
                marginBottom: 10,
            }}
            leftAvatar={
                <View style={styles.avatarStyle}>
                    {props.team.team.picture ? (
                        <Image
                            source={{
                                uri: props.team.team.picture,
                            }}
                            defaultSource={placeholderImg}
                            style={[styles.pictureStyle]}
                        />
                    ) : (
                        <Image
                            source={placeholderImg}
                            style={[styles.placeholderImgStyle]}
                        />
                    )}
                </View>
            }
        />
    );
}

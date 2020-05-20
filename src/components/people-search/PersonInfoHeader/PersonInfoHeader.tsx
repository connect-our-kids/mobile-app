import React from 'react';
import { Image } from 'react-native';
import { Col, Row, Text } from 'native-base';
import constants from '../../../helpers/constants';
import styles from './PersonInfoHeader.styles';

export default function PersonInfoHeader({
    item,
    listItem = false,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: any;
    listItem?: boolean;
}) {
    let allAddresses = '';
    let secondLine = '';
    const uri = item.images
        ? `https://dev.search.connectourkids.org/api/thumbnail?tokens=${item.images[0].thumbnail_token}`
        : constants.defaultImageUri;

    if (item.dob && item.gender) {
        secondLine += `${item.dob.display}, ${item.gender.content}`;
    } else if (item.gender) {
        secondLine += `${item.gender.content}`;
    } else if (item.dob) {
        secondLine += `${item.dob.display}`;
    }

    if (item.addresses && listItem) {
        item.addresses.forEach((address: { city: string; state: string }) => {
            allAddresses += `${address.city}, ${address.state} `;
        });
    }

    return (
        <Row style={[styles.rowContainer, { marginBottom: listItem ? 0 : 20 }]}>
            <Col size={30} style={styles.imageContainer}>
                <Image
                    style={styles.rowImage}
                    source={{
                        uri: uri,
                    }}
                />
            </Col>
            <Col size={70} style={styles.colList}>
                <Text style={styles.cardNameText}>
                    {item.names && item.names[0].display}
                </Text>
                {!!secondLine.length && (
                    <Text
                        style={[
                            styles.cardInformationText,
                            { marginBottom: 5 },
                        ]}
                    >
                        {secondLine}
                    </Text>
                )}
                {allAddresses.length ? (
                    <Text style={styles.cardInformationText}>
                        {allAddresses.length > 25
                            ? allAddresses.slice(0, 25) + '...'
                            : allAddresses}
                    </Text>
                ) : null}
            </Col>
        </Row>
    );
}

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Col, Row, Text } from 'native-base';
import styles from './PersonInfoRow.styles';
import renderMaskedOrResult from '../../../helpers/renderMaskedOrResult';
import { connect } from 'react-redux';
import { resetState, showModal } from '../../../store/actions';
import { RootState } from '../../../store/reducers';

function PersonInfoRow({
    isLoggedIn,
    item,
    itemKey,
    itemValue,
    startRegister,
    title,
    showConModal,
    navigation,
    setData,
    resetState,
}) {
    if (item[itemKey]) {
        const handlePressDirections = (data, postalCode, city) => {
            if (postalCode === undefined) {
                const address = `${city}, ${data}`;
                const type = 'address';
                showConModal(address, type);
            } else {
                const address = `${city}, ${data} ${postalCode}`;
                const type = 'address404';
                showConModal(address, type);
            }
        };

        const handleShowConModal = (key, index) => {
            if (!isLoggedIn) {
                startRegister();
            }

            if (isLoggedIn && itemKey === 'emails') {
                const type = 'email';
                showConModal(key, type, index);
            }

            if (isLoggedIn && itemKey === 'phones') {
                const type = 'phone';
                showConModal(key, type, index);
            }

            if (isLoggedIn && itemKey === 'addresses') {
                if (key.zip_code === undefined) {
                    const address = `${key.display}`;
                    console.log('NO ZIP_CODE FOUND');
                    const type = 'address';
                    console.log('ADDRESS', `${key.display}`);
                    showConModal(address, type, index);
                } else if (key.house === undefined) {
                    if (key.street === undefined) {
                        const data = `${key.state}`;
                        handlePressDirections(
                            data,
                            key['zip_code'],
                            key['city']
                        );
                    } else {
                        const data = `${key.street} ${key.state}`;
                        handlePressDirections(
                            data,
                            key['zip_code'],
                            key['city']
                        );
                    }
                } else {
                    const address = `${key.display}, ${key.zip_code}`;
                    const type = 'address';
                    console.log('ADDRESS', `${key.display}`);
                    showConModal(address, type, index);
                }
            }

            if (isLoggedIn && itemKey === 'urls') {
                const type = 'url';
                showConModal(key, type, index);
            }

            if (isLoggedIn && itemKey === 'relationships') {
                const type = 'name';
                navigation.goBack();
                resetState();
                setData(key, type);
            }
        };

        return (
            <Row style={styles.rowContainer}>
                <Col size={30}>
                    <Text style={styles.rowLabelText}>{title}</Text>
                </Col>
                <Col size={70} style={styles.colList}>
                    {item[itemKey].map((key, index) => {
                        if (itemKey === 'addresses') {
                            return (
                                <TouchableOpacity
                                    style={styles.colListContainer}
                                    key={index}
                                    onPress={() =>
                                        handleShowConModal(key, index)
                                    }
                                >
                                    <Text style={styles.colListText}>
                                        {key.house &&
                                            renderMaskedOrResult(
                                                key.house,
                                                'house'
                                            )}{' '}
                                        {key.street &&
                                            renderMaskedOrResult(
                                                key.street,
                                                'street'
                                            ) + '\n'}
                                        {key['city'] +
                                            ', ' +
                                            key['state'] +
                                            ' '}
                                        {renderMaskedOrResult(
                                            key.zip_code,
                                            'zip_code'
                                        )}
                                        {key['@last_seen'] && (
                                            <Text
                                                style={styles.colListLabelText}
                                            >
                                                {'\n' +
                                                    key['@last_seen'].split(
                                                        '-'
                                                    )[0]}
                                            </Text>
                                        )}
                                    </Text>
                                </TouchableOpacity>
                            );
                        } else if (itemKey === 'relationships') {
                            return (
                                <TouchableOpacity
                                    style={styles.colListContainer}
                                    key={index}
                                    onPress={() =>
                                        handleShowConModal(
                                            key[itemValue][0].display,
                                            index
                                        )
                                    }
                                >
                                    <Text style={styles.colListText}>
                                        {isLoggedIn
                                            ? renderMaskedOrResult(
                                                  key[itemValue][0].display,
                                                  itemKey
                                              )
                                            : '**** ********* **'}
                                    </Text>
                                </TouchableOpacity>
                            );
                        } else {
                            return (
                                <TouchableOpacity
                                    style={styles.colListContainer}
                                    key={index}
                                >
                                    <Text
                                        style={styles.colListText}
                                        onPress={() =>
                                            handleShowConModal(key, index)
                                        }
                                    >
                                        {renderMaskedOrResult(
                                            key[itemValue],
                                            itemKey
                                        )}
                                    </Text>

                                    {key['@type'] && (
                                        <Text style={styles.colListLabelText}>
                                            {key['@type']}
                                        </Text>
                                    )}

                                    {key['@last_seen'] ? (
                                        <Text style={styles.colListLabelText}>
                                            {key['@last_seen'].split('-')[0]}
                                        </Text>
                                    ) : (
                                        key['@valid_since'] && (
                                            <Text
                                                style={styles.colListLabelText}
                                            >
                                                {
                                                    key['@valid_since'].split(
                                                        '-'
                                                    )[0]
                                                }
                                            </Text>
                                        )
                                    )}
                                </TouchableOpacity>
                            );
                        }
                    })}
                </Col>
            </Row>
        );
    } else {
        return null;
    }
}

const mapStateToProps = (state: RootState) => {
    const { isLoggedIn } = state.auth;
    const { modalVisible } = state.confirmationModal;
    return { isLoggedIn, modalVisible };
};

export default connect(mapStateToProps, { resetState, showModal })(
    PersonInfoRow
);

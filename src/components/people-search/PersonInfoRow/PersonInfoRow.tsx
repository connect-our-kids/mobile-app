/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Col, Row, Text } from 'native-base';
import styles from './PersonInfoRow.styles';
import renderMaskedOrResult from '../../../helpers/renderMaskedOrResult';
import { connect } from 'react-redux';
import { resetState } from '../../../store/actions';
import { RootState } from '../../../store/reducers';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { SearchValues } from '../SearchForm/SearchForm';

interface StateProps {
    isLoggedIn: boolean;
}

interface DispatchProps {
    resetState: typeof resetState;
}

type Navigation = NavigationScreenProp<NavigationState>;

interface OwnProps {
    navigation: Navigation;
    item: Record<string, any>;
    itemKey: string;
    itemValue: string;
    startRegister: any;
    title: string;
    showConModal: any;
    setData: any;
}

type Props = StateProps & DispatchProps & OwnProps;

function PersonInfoRow(props: Props) {
    if (props.item[props.itemKey]) {
        const handlePressDirections = (
            data: string,
            postalCode: any,
            city: any
        ) => {
            if (postalCode === undefined) {
                const address = `${city}, ${data}`;
                const type = 'address';
                props.showConModal(address, type);
            } else {
                const address = `${city}, ${data} ${postalCode}`;
                const type = 'address404';
                props.showConModal(address, type);
            }
        };

        const handleShowConModal = (
            key: {
                [x: string]: any;
                zip_code: undefined;
                display: any;
                house: undefined;
                street: undefined;
                state: any;
            },
            index: any
        ) => {
            if (!props.isLoggedIn) {
                props.startRegister();
            }

            if (props.isLoggedIn && props.itemKey === 'emails') {
                const type = 'email';
                props.showConModal(key, type, index);
            }

            if (props.isLoggedIn && props.itemKey === 'phones') {
                const type = 'phone';
                props.showConModal(key, type, index);
            }

            if (props.isLoggedIn && props.itemKey === 'addresses') {
                if (key.zip_code === undefined) {
                    const address = `${key.display}`;
                    console.log('NO ZIP_CODE FOUND');
                    const type = 'address';
                    console.log('ADDRESS', `${key.display}`);
                    props.showConModal(address, type, index);
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
                    props.showConModal(address, type, index);
                }
            }

            if (props.isLoggedIn && props.itemKey === 'urls') {
                const type = 'url';
                props.showConModal(key, type, index);
            }

            if (props.isLoggedIn && props.itemKey === 'relationships') {
                const type = 'name';

                const name =
                    props.item[props.itemKey][index]?.names[0]?.display ?? '';
                props.navigation.navigate<{
                    searchValues: SearchValues;
                }>('PeopleSearch', {
                    searchValues: {
                        type: 'name',
                        name: name,
                        location: '',
                    },
                });
                resetState();
                props.setData(key, type);
            }
        };

        return (
            <Row style={styles.rowContainer}>
                <Col size={30}>
                    <Text style={styles.rowLabelText}>{props.title}</Text>
                </Col>
                <Col size={70} style={styles.colList}>
                    {props.item[props.itemKey].map((key: any, index: any) => {
                        if (props.itemKey === 'addresses') {
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
                        } else if (props.itemKey === 'relationships') {
                            return (
                                <TouchableOpacity
                                    style={styles.colListContainer}
                                    key={index}
                                    onPress={() =>
                                        handleShowConModal(
                                            key[props.itemValue][0].display,
                                            index
                                        )
                                    }
                                >
                                    <Text style={styles.colListText}>
                                        {props.isLoggedIn
                                            ? renderMaskedOrResult(
                                                  key[props.itemValue][0]
                                                      .display,
                                                  props.itemKey
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
                                            key[props.itemValue],
                                            props.itemKey
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

const mapStateToProps = (state: RootState, own: OwnProps) => {
    return { isLoggedIn: state.auth.isLoggedIn, ...own };
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    resetState,
})(PersonInfoRow);

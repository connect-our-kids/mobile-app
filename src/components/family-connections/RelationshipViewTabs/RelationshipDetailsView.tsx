import React, { useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Platform,
} from 'react-native';
import {
    RelationshipDetailFullFragment,
    RelationshipDetailFullFragment_teamAttributes,
} from '../../../generated/RelationshipDetailFullFragment';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { CheckBox } from 'react-native-elements';
import constants from '../../../helpers/constants';

const dateOfDeathToDisplay = (
    dateOfDeath: string | null | undefined
): string | undefined => {
    // should be in the following format 2019-09-25T00:00:00.000Z
    if (dateOfDeath) {
        const matches = dateOfDeath.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (matches && matches.length === 4) {
            return `${matches[2]}/${matches[3]}/${matches[1]}`;
        }
    }
    return undefined;
};

const cityStateZipToString = (
    city: string,
    state: string | null,
    zip: string | null
): string => {
    if (city && state && zip) {
        return `${city.trim()}, ${state.trim()} ${zip.trim()}`;
    } else if (city && zip) {
        return `${city.trim()}, ${zip.trim()}`;
    } else if (city && state) {
        return `${city.trim()}, ${state.trim()}`;
    }
    return `${state?.trim()} ${zip?.trim()}`.trim();
};

export default function ConnectionsDetailsView(props: {
    details: RelationshipDetailFullFragment;
    navigation: NavigationScreenProp<NavigationState>;
}): JSX.Element {
    const styles = StyleSheet.create({
        rootView: {
            display: 'flex',
            justifyContent: 'flex-start',
            width: '100%',
        },
        header: {
            marginTop: 1,
            marginBottom: 10,
            borderBottomWidth: 0.5,
            borderBottomColor: 'rgba(24, 23, 21, 0.3)',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        headerText: {
            color: '#a1a1a1',
            fontWeight: 'bold',
        },
        textView: {
            // container that wraps every text row, ex) First Name John
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'flex-start',
            alignItems: 'flex-start',
        },
        tripleTextView: {
            // container that wraps every text row, ex) First Name John
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignContent: 'flex-start',
            alignItems: 'flex-start',
            fontWeight: 'bold',
        },
        tripleLabelText: {
            width: '50%',
            marginBottom: 10,
            color: '#444444',
            fontWeight: 'bold',
        },
        tripleContent: {
            width: '90%',
            // display: 'flex',
            flexDirection: 'column',
            alignSelf: 'flex-end',
            color: '#444444',
            marginBottom: 10,
        },
        tripleRow: {
            flexDirection: 'row',
            alignContent: 'space-between',
            justifyContent: 'space-between',
            width: '100%',
            color: '#444444',
            marginBottom: 10,
        },
        tripleText1: {
            width: '30%',
            color: '#444444',
            fontWeight: 'bold',
        },
        tripleText2: {
            width: '65%',
            color: '#444444',
            fontWeight: 'bold',
        },
        tripleLinkText: {
            width: '65%',
            color: '#0279AC',
        },
        tripleText3: {
            width: '5%',
            color: '#444444',
        },
        labelText: {
            width: '25%',
            marginBottom: 25,
            color: '#444444',
            fontWeight: 'bold',
        },
        contactedLabel: {
            width: '25%',
            marginBottom: 15,
            color: '#444444',
            fontWeight: 'bold',
        },
        contentText: {
            // marginHorizontal: 20
            width: '75%',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left',
            marginLeft: 35,
            color: '#444444',
            // textAlign: 'left',
        },
        highlightsText: {
            textAlign: 'left',
            color: '#444444',
        },
        linkText: {
            width: '75%',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left',
            marginLeft: 35,
            color: '#0279AC',
        },
        addCheckboxContainer: {
            backgroundColor: 'white',
            borderWidth: 0,
            margin: 0,
            marginLeft: 0,
            marginBottom: 10,
            padding: 0,
        },
        iconLabelContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
        },
        iconContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        iconStyles: {
            fontSize: 28,
            color: constants.highlightColor,
        },
        iconLabel: {
            color: '#0F6580',
            fontSize: 12,
            textAlign: 'center',
        },
    });

    const [showHidden, setShowHidden] = useState(false);

    const anyHiddenElements =
        props.details.person.addresses.filter((address) => address.isHidden)
            .length > 0 ||
        props.details.person.emails.filter((email) => email.isHidden).length >
            0 ||
        props.details.person.telephones.filter(
            (telephone) => telephone.isHidden
        ).length > 0 ||
        props.details.person.alternateNames.filter((name) => name.isHidden)
            .length > 0;

    const teleFormat = (phoneNumber: string): string => {
        const phoneNumberArr = phoneNumber.split('');
        if (phoneNumberArr.length === 10) {
            return `(${phoneNumberArr
                .slice(0, 3)
                .join('')}) ${phoneNumberArr
                .slice(3, 6)
                .join('')}-${phoneNumberArr.slice(6, 10).join('')}`;
        } else if (phoneNumberArr.length === 11) {
            return `${phoneNumberArr[0]}(${phoneNumberArr
                .slice(1, 4)
                .join('')}) ${phoneNumberArr
                .slice(4, 7)
                .join('')}-${phoneNumberArr.slice(7, 11).join('')}`;
        } else {
            return phoneNumber;
        }
    };

    return (
        <View style={styles.rootView}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                }}
            >
                <View style={styles.iconLabelContainer}>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.navigate(
                                    'AddRelationshipScreen',
                                    {
                                        caseId: props.details.case.id,
                                        teamId: props.details.case.teamId,
                                        relationshipId: props.details.id,
                                    }
                                );
                            }}
                        >
                            <MaterialCommunityIcons
                                name="square-edit-outline"
                                style={styles.iconStyles}
                            />
                            <Text style={styles.iconLabel}>EDIT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {anyHiddenElements && (
                <CheckBox
                    title={
                        showHidden
                            ? 'Hide hidden details'
                            : 'Show hidden details'
                    }
                    textStyle={{ fontWeight: 'normal' }}
                    containerStyle={styles.addCheckboxContainer}
                    iconType="material"
                    checkedIcon="remove"
                    uncheckedIcon="add"
                    checkedColor="#0279AC"
                    uncheckedColor="#0279AC"
                    checked={showHidden}
                    onPress={() => {
                        setShowHidden(!showHidden);
                    }}
                />
            )}
            <View style={styles.textView}>
                <Text style={styles.contactedLabel}>Contacted</Text>
                <Text style={styles.contentText}>
                    {props.details.isContacted ? 'Yes' : 'No'}
                </Text>
            </View>
            <View style={styles.header}>
                <Text style={styles.headerText}>INFORMATION</Text>
            </View>
            <View>
                {props.details.person.firstName ? (
                    <View style={styles.textView}>
                        <Text style={styles.labelText}>First Name</Text>
                        <Text style={styles.contentText}>
                            {props.details.person.firstName}
                        </Text>
                    </View>
                ) : null}
                {props.details.person.middleName ? (
                    <View style={styles.textView}>
                        <Text style={styles.labelText}>Middle Name</Text>
                        <Text style={styles.contentText}>
                            {props.details.person.middleName}
                        </Text>
                    </View>
                ) : null}
                {props.details.person.lastName ? (
                    <View style={styles.textView}>
                        <Text style={styles.labelText}>Last Name</Text>
                        <Text style={styles.contentText}>
                            {props.details.person.lastName}
                        </Text>
                    </View>
                ) : null}
                {props.details.person.suffix ? (
                    <View style={styles.textView}>
                        <Text style={styles.labelText}>Suffix</Text>
                        <Text style={styles.contentText}>
                            {props.details.person.suffix}
                        </Text>
                    </View>
                ) : null}

                {props.details.person.alternateNames.filter((alternateName) => {
                    if (showHidden) return true;
                    else return !alternateName.isHidden;
                }).length > 0 ? (
                    <View style={styles.tripleTextView}>
                        <Text style={styles.tripleLabelText}>
                            Alternate Names:
                        </Text>
                        <View style={styles.tripleContent}>
                            {props.details.person.alternateNames
                                .filter((alternateName) => {
                                    if (showHidden) return true;
                                    else return !alternateName.isHidden;
                                })
                                .map((alternateName, index) => (
                                    <View key={index} style={styles.tripleRow}>
                                        <Text style={styles.tripleText1}>
                                            {alternateName.label
                                                ? alternateName.label
                                                : 'No label'}
                                            {': '}
                                        </Text>
                                        <Text style={styles.tripleText2}>
                                            {alternateName.name}
                                        </Text>
                                        <Text style={styles.tripleText3}>
                                            {alternateName.isVerified && (
                                                <AntDesign
                                                    name="checkcircle"
                                                    size={16}
                                                    color="black"
                                                />
                                            )}
                                        </Text>
                                    </View>
                                ))}
                        </View>
                    </View>
                ) : null}
                {props.details.person.birthdayRaw ? (
                    <View style={styles.textView}>
                        <Text style={styles.labelText}>Date of Birth</Text>
                        <Text style={styles.contentText}>
                            {props.details.person.birthdayRaw}
                        </Text>
                    </View>
                ) : null}
                {props.details.person.gender &&
                props.details.person.gender !== 'Unspecified' ? (
                    <View style={styles.textView}>
                        <Text style={styles.labelText}>Gender</Text>
                        <Text style={styles.contentText}>
                            {props.details.person.gender}
                        </Text>
                    </View>
                ) : null}
                {props.details.person.isDeceased && (
                    <>
                        <View style={styles.textView}>
                            <Text style={styles.labelText}>Deceased</Text>
                            <Text style={styles.contentText}>
                                {props.details.person.isDeceased ? 'Yes' : 'No'}
                            </Text>
                        </View>
                        <View style={styles.textView}>
                            <Text style={styles.labelText}>Date of Death</Text>
                            <Text style={styles.contentText}>
                                {dateOfDeathToDisplay(
                                    props.details.person.dateOfDeath
                                )}
                            </Text>
                        </View>
                    </>
                )}
            </View>
            {props.details.teamAttributes?.length ? (
                <>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>CUSTOMIZED FIELDS</Text>
                    </View>
                    {props.details.teamAttributes
                        .sort((a,b) => a.teamAttribute.order - b.teamAttribute.order)
                        .filter((attribute: RelationshipDetailFullFragment_teamAttributes) => attribute.value !== null && attribute.value !== "")
                        .map((attribute: RelationshipDetailFullFragment_teamAttributes) => {
                            return (
                                <View key={attribute.id} style={styles.textView}>
                                    <Text style={styles.labelText}>{attribute.teamAttribute.name}</Text>
                                    <Text style={styles.contentText}>
                                        {attribute.value}
                                    </Text>
                                </View>
                            )
                        })
                    }
                </>
            ) : null}
            {props.details.person.addresses.length ||
            props.details.person.telephones.length ||
            props.details.person.emails.length ||
            props.details.jobTitle ||
            props.details.salaryRange ||
            props.details.employer ? (
                <>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>CONTACT DETAILS</Text>
                    </View>
                    <View>
                        {props.details.person.addresses.filter((address) => {
                            if (showHidden) return true;
                            else return !address.isHidden;
                        }).length > 0 ? (
                            <View style={styles.tripleTextView}>
                                <Text style={styles.tripleLabelText}>
                                    Residences:
                                </Text>

                                <View style={styles.tripleContent}>
                                    {props.details.person.addresses
                                        .filter((address) => {
                                            if (showHidden) return true;
                                            else return !address.isHidden;
                                        })
                                        .map((address, index) => (
                                            <View
                                                key={index}
                                                style={styles.tripleRow}
                                            >
                                                <Text
                                                    style={styles.tripleText1}
                                                >
                                                    {address.label
                                                        ? address.label
                                                        : 'No label'}
                                                    {': '}
                                                </Text>
                                                <TouchableOpacity
                                                    style={styles.tripleText2}
                                                    onPress={() =>
                                                        Linking.openURL(
                                                            `https://www.google.com/maps/search/?api=1&query=${encodeURI(
                                                                address.raw ??
                                                                    ''
                                                            )}`
                                                        )
                                                    }
                                                >
                                                    {address.route ||
                                                    address.streetNumber ? (
                                                        <Text
                                                            style={{
                                                                color:
                                                                    '#0279AC',
                                                            }}
                                                        >
                                                            {`${address.streetNumber} ${address.route}`.trim()}
                                                        </Text>
                                                    ) : null}
                                                    {address.routeTwo ? (
                                                        <Text
                                                            style={{
                                                                color:
                                                                    '#0279AC',
                                                            }}
                                                        >
                                                            {address.routeTwo}
                                                        </Text>
                                                    ) : null}

                                                    {address.locality ||
                                                    address.state ||
                                                    address.postalCode ? (
                                                        <Text
                                                            style={{
                                                                color:
                                                                    '#0279AC',
                                                            }}
                                                        >
                                                            {cityStateZipToString(
                                                                address.locality,
                                                                address.state,
                                                                address.postalCode
                                                            )}
                                                        </Text>
                                                    ) : null}
                                                    {address.country ? (
                                                        <Text
                                                            style={{
                                                                color:
                                                                    '#0279AC',
                                                            }}
                                                        >
                                                            {address.country}
                                                        </Text>
                                                    ) : null}
                                                </TouchableOpacity>
                                                <Text
                                                    style={styles.tripleText3}
                                                >
                                                    {address.isVerified && (
                                                        <AntDesign
                                                            name="checkcircle"
                                                            size={16}
                                                            color="black"
                                                        />
                                                    )}
                                                </Text>
                                            </View>
                                        ))}
                                </View>
                            </View>
                        ) : null}
                        {props.details.person.telephones.filter((telephone) => {
                            if (showHidden) return true;
                            else return !telephone.isHidden;
                        }).length > 0 ? (
                            <View style={styles.tripleTextView}>
                                <Text style={styles.tripleLabelText}>
                                    Telephones:
                                </Text>
                                <View style={styles.tripleContent}>
                                    {props.details.person.telephones
                                        .filter((telephone) => {
                                            if (showHidden) return true;
                                            else return !telephone.isHidden;
                                        })
                                        .map((telephoneObj, index) => (
                                            <View
                                                key={index}
                                                style={styles.tripleRow}
                                            >
                                                <Text
                                                    style={styles.tripleText1}
                                                >
                                                    {telephoneObj.label
                                                        ? telephoneObj.label
                                                        : 'No label'}
                                                    {': '}
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.tripleLinkText
                                                    }
                                                    onPress={
                                                        () =>
                                                            Platform.OS ===
                                                            'android'
                                                                ? Linking.openURL(
                                                                      `tel: ${telephoneObj.telephone}`
                                                                  )
                                                                : Linking.openURL(
                                                                      `tel:// ${telephoneObj.telephone}`
                                                                  ) // might need a promise then catch
                                                    }
                                                >
                                                    {teleFormat(
                                                        telephoneObj.telephone
                                                    )}
                                                </Text>
                                                <Text
                                                    style={styles.tripleText3}
                                                >
                                                    {telephoneObj.isVerified && (
                                                        <AntDesign
                                                            name="checkcircle"
                                                            size={16}
                                                            color="black"
                                                        />
                                                    )}
                                                </Text>
                                            </View>
                                        ))}
                                </View>
                            </View>
                        ) : null}
                        {props.details.person.emails.filter((email) => {
                            if (showHidden) return true;
                            else return !email.isHidden;
                        }).length > 0 ? (
                            <View style={styles.tripleTextView}>
                                <Text style={styles.tripleLabelText}>
                                    Emails:
                                </Text>
                                <View style={styles.tripleContent}>
                                    {props.details.person.emails.length
                                        ? props.details.person.emails
                                              .filter((email) => {
                                                  if (showHidden) return true;
                                                  else return !email.isHidden;
                                              })
                                              .map((emailObj, index) => (
                                                  <View
                                                      key={index}
                                                      style={styles.tripleRow}
                                                  >
                                                      <Text
                                                          style={
                                                              styles.tripleText1
                                                          }
                                                      >
                                                          {emailObj.label
                                                              ? emailObj.label
                                                              : 'No label'}
                                                          {': '}
                                                      </Text>
                                                      <Text
                                                          style={
                                                              styles.tripleLinkText
                                                          }
                                                          onPress={() =>
                                                              Linking.openURL(
                                                                  `mailto:${emailObj.email}`
                                                              )
                                                          }
                                                      >
                                                          {emailObj.email}
                                                      </Text>
                                                      <Text
                                                          style={
                                                              styles.tripleText3
                                                          }
                                                      >
                                                          {emailObj.isVerified && (
                                                              <AntDesign
                                                                  name="checkcircle"
                                                                  size={16}
                                                                  color="black"
                                                              />
                                                          )}
                                                      </Text>
                                                  </View>
                                              ))
                                        : null}
                                </View>
                            </View>
                        ) : null}
                        {props.details.jobTitle ? (
                            <View style={styles.textView}>
                                <Text style={styles.labelText}>Job Title</Text>
                                <Text style={styles.contentText}>
                                    {props.details.jobTitle}
                                </Text>
                            </View>
                        ) : null}
                        {props.details.employer ? (
                            <View style={styles.textView}>
                                <Text style={styles.labelText}>Employer</Text>
                                <Text style={styles.contentText}>
                                    {props.details.employer}
                                </Text>
                            </View>
                        ) : null}
                        {props.details.salaryRange ? (
                            <View style={styles.textView}>
                                <Text style={styles.labelText}>
                                    Salary Range
                                </Text>
                                <Text style={styles.contentText}>
                                    {' '}
                                    {props.details.salaryRange.label}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </>
            ) : null}

            {props.details.facebook ||
            props.details.linkedin ||
            props.details.twitter ? (
                <>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>SOCIAL MEDIA</Text>
                    </View>
                    <View>
                        {props.details.facebook &&
                        props.details.facebook.trim().length > 0 ? (
                            <View style={styles.textView}>
                                <Text style={styles.labelText}>Facebook</Text>
                                <Text
                                    style={styles.linkText}
                                    onPress={(): Promise<unknown> =>
                                        Linking.openURL(
                                            `${props.details.facebook}`
                                        )
                                    }
                                >
                                    {props.details.facebook}
                                </Text>
                            </View>
                        ) : null}
                        {props.details.linkedin &&
                        props.details.linkedin.trim().length > 0 ? (
                            <View style={styles.textView}>
                                <Text style={styles.labelText}>LinkedIn</Text>
                                <Text
                                    style={styles.linkText}
                                    onPress={(): Promise<unknown> =>
                                        Linking.openURL(
                                            `${props.details.linkedin}`
                                        )
                                    }
                                >
                                    {props.details.linkedin}
                                </Text>
                            </View>
                        ) : null}
                        {props.details.twitter &&
                        props.details.twitter.trim().length > 0 ? (
                            <View style={styles.textView}>
                                <Text style={styles.labelText}>Twitter</Text>
                                <Text
                                    style={styles.linkText}
                                    onPress={(): Promise<unknown> =>
                                        Linking.openURL(
                                            `${props.details.twitter}`
                                        )
                                    }
                                >
                                    {props.details.twitter}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </>
            ) : null}
            {props.details.person.notes && (
                <>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>HIGHLIGHTS</Text>
                    </View>
                    <View>
                        <View style={styles.textView}>
                            <Text style={styles.highlightsText}>
                                {props.details.person.notes}
                            </Text>
                        </View>
                    </View>
                </>
            )}
            <View style={{ height: 50 }}></View>
        </View>
    );
}

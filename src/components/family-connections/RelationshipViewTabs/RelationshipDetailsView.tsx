import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Platform,
} from 'react-native';
import { RelationshipDetailFullFragment } from '../../../generated/RelationshipDetailFullFragment';
import { AntDesign } from '@expo/vector-icons';

export default function ConnectionsDetailsView({
    details,
}: {
    details: RelationshipDetailFullFragment;
}): JSX.Element {
    const styles = StyleSheet.create({
        rootView: {
            display: 'flex',
            justifyContent: 'flex-start',
            width: '100%',
        },
        header: {
            marginTop: 1,
            marginBottom: 20,
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
        labelText: {
            width: '25%',
            marginBottom: 25,
            color: '#444444',
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
        linkText: {
            width: '75%',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left',
            marginLeft: 35,
            color: '#0279AC',
        },
        addressDiv: {
            width: '100%',
            // display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            marginLeft: 17,
            color: '#444444',
        },
        phoneDiv: {
            width: '100%',
            // display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            color: '#444444',
            marginBottom: 10,
        },
        addPad: {
            padding: '5%',
            paddingTop: 2,
            color: '#444444',
        },
    });

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
            {/* TODO. Commented out editing until it is updated for GraphQL backend
             <Text
                style={styles.edit}
                onPress={(): void => {
                    setEdit(!edit);
                }}
            >
                Edit
            </Text> */}
            <View style={styles.header}>
                <Text style={styles.headerText}>INFORMATION</Text>
            </View>
            <View>
                {details.person.firstName ? (
                    <View style={styles.textView}>
                        <Text style={styles.labelText}>First Name</Text>
                        <Text style={styles.contentText}>
                            {details.person.firstName}
                        </Text>
                    </View>
                ) : null}
                {details.person.middleName ? (
                    <View style={styles.textView}>
                        <Text style={styles.labelText}>Middle Name</Text>
                        <Text style={styles.contentText}>
                            {details.person.middleName}
                        </Text>
                    </View>
                ) : null}
                {details.person.lastName ? (
                    <View style={styles.textView}>
                        <Text style={styles.labelText}>Last Name</Text>
                        <Text style={styles.contentText}>
                            {details.person.lastName}
                        </Text>
                    </View>
                ) : null}
                {details.person.suffix ? (
                    <View style={styles.textView}>
                        <Text style={styles.labelText}>Suffix</Text>
                        <Text style={styles.contentText}>
                            {details.person.suffix}
                        </Text>
                    </View>
                ) : null}
                {details.person.birthdayRaw ? (
                    <View style={styles.textView}>
                        <Text style={styles.labelText}>Date of Birth</Text>
                        <Text style={styles.contentText}>
                            {details.person.birthdayRaw}
                        </Text>
                    </View>
                ) : null}
                {details.person.gender ? (
                    <View style={styles.textView}>
                        <Text style={styles.labelText}>Gender</Text>
                        <Text style={styles.contentText}>
                            {details.person.gender === 'Unspecified'
                                ? null
                                : details.person.gender}
                        </Text>
                    </View>
                ) : null}
                {details.person.isDeceased ? (
                    <View style={styles.textView}>
                        <Text style={styles.labelText}>Deceased</Text>
                        <Text style={styles.contentText}>
                            {details.person.isDeceased ? 'Yes' : 'No'}
                        </Text>
                    </View>
                ) : null}
            </View>
            {details.person.addresses.length ||
            details.person.telephones.length ||
            details.person.emails.length ||
            details.jobTitle ||
            details.salaryRange ? (
                <>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>CONTACT DETAILS</Text>
                    </View>
                    <View>
                        {details.person.addresses.length ? (
                            <View style={styles.textView}>
                                <Text style={styles.labelText}>Residence</Text>
                                <View style={styles.addressDiv}>
                                    {details.person.addresses.length
                                        ? details.person.addresses.map(
                                              (address, ind) => (
                                                  <TouchableOpacity
                                                      key={ind}
                                                      style={styles.addPad}
                                                      onPress={(): Promise<
                                                          unknown
                                                      > =>
                                                          Linking.openURL(
                                                              `https://www.google.com/maps/search/?api=1&query=${encodeURI(
                                                                  address.raw ??
                                                                      ''
                                                              )}`
                                                          )
                                                      }
                                                  >
                                                      <Text
                                                          style={{
                                                              color: '#0279AC',
                                                          }}
                                                      >
                                                          {address.streetNumber}{' '}
                                                          {address.route}{' '}
                                                          {address.isVerified ? (
                                                              <AntDesign
                                                                  name="checkcircle"
                                                                  size={16}
                                                                  color="black"
                                                              />
                                                          ) : (
                                                              ''
                                                          )}
                                                      </Text>
                                                      <Text
                                                          style={{
                                                              color: '#0279AC',
                                                          }}
                                                      >
                                                          {address.locality}
                                                          {','}{' '}
                                                          {address.stateCode}
                                                      </Text>
                                                      <Text
                                                          style={{
                                                              color: '#0279AC',
                                                          }}
                                                      >
                                                          {address.postalCode}
                                                          {','}{' '}
                                                          {address.country}
                                                      </Text>
                                                  </TouchableOpacity>
                                              )
                                          )
                                        : null}
                                </View>
                            </View>
                        ) : null}
                        {details.person.telephones.length ? (
                            <View style={styles.textView}>
                                <Text style={styles.labelText}>Telephone</Text>
                                <View style={styles.phoneDiv}>
                                    {details.person.telephones.length
                                        ? details.person.telephones.map(
                                              (telephoneObj, index) => (
                                                  <Text
                                                      key={index}
                                                      style={styles.linkText}
                                                      onPress={
                                                          (): Promise<
                                                              unknown
                                                          > =>
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
                                                      )}{' '}
                                                      {telephoneObj.isVerified ? (
                                                          <AntDesign
                                                              name="checkcircle"
                                                              size={16}
                                                              color="black"
                                                          />
                                                      ) : (
                                                          ''
                                                      )}
                                                  </Text>
                                              )
                                          )
                                        : null}
                                </View>
                            </View>
                        ) : null}
                        {details.person.emails.length ? (
                            <View style={styles.textView}>
                                <Text style={styles.labelText}>Email</Text>
                                {details.person.emails.length
                                    ? details.person.emails.map(
                                          (emailObj, ind) => (
                                              <Text
                                                  key={ind}
                                                  style={styles.linkText}
                                                  onPress={(): Promise<
                                                      unknown
                                                  > =>
                                                      Linking.openURL(
                                                          `mailto:${emailObj.email}`
                                                      )
                                                  }
                                              >
                                                  {emailObj.email}{' '}
                                                  {emailObj.isVerified ? (
                                                      <AntDesign
                                                          name="checkcircle"
                                                          size={16}
                                                          color="black"
                                                      />
                                                  ) : (
                                                      ''
                                                  )}
                                              </Text>
                                          )
                                      )
                                    : null}
                            </View>
                        ) : null}
                        {details.jobTitle ? (
                            <View style={styles.textView}>
                                <Text style={styles.labelText}>Job Title</Text>
                                <Text style={styles.contentText}>
                                    {details.jobTitle}
                                </Text>
                            </View>
                        ) : null}
                        {details.employer ? (
                            <View style={styles.textView}>
                                <Text style={styles.labelText}>Employer</Text>
                                <Text style={styles.contentText}>
                                    {details.employer}
                                </Text>
                            </View>
                        ) : null}
                        {details.salaryRange ? (
                            <View style={styles.textView}>
                                <Text style={styles.labelText}>
                                    Salary Range
                                </Text>
                                <Text style={styles.contentText}>
                                    {' '}
                                    {details.salaryRange.label}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </>
            ) : null}

            {details.facebook || details.linkedin || details.twitter ? (
                <>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>SOCIAL MEDIA</Text>
                    </View>
                    <View>
                        {details.facebook &&
                        details.facebook.trim().length > 0 ? (
                            <View style={styles.textView}>
                                <Text style={styles.labelText}>Facebook</Text>
                                <Text
                                    style={styles.linkText}
                                    onPress={(): Promise<unknown> =>
                                        Linking.openURL(`${details.facebook}`)
                                    }
                                >
                                    {details.facebook}
                                </Text>
                            </View>
                        ) : null}
                        {details.linkedin &&
                        details.linkedin.trim().length > 0 ? (
                            <View style={styles.textView}>
                                <Text style={styles.labelText}>LinkedIn</Text>
                                <Text
                                    style={styles.linkText}
                                    onPress={(): Promise<unknown> =>
                                        Linking.openURL(`${details.linkedin}`)
                                    }
                                >
                                    {details.linkedin}
                                </Text>
                            </View>
                        ) : null}
                        {details.twitter &&
                        details.twitter.trim().length > 0 ? (
                            <View style={styles.textView}>
                                <Text style={styles.labelText}>Twitter</Text>
                                <Text
                                    style={styles.linkText}
                                    onPress={(): Promise<unknown> =>
                                        Linking.openURL(`${details.twitter}`)
                                    }
                                >
                                    {details.twitter}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </>
            ) : null}
        </View>
    );
}

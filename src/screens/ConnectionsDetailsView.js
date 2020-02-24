import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Button,
    Linking,
    Platform,
    Modal,
    Image,
} from 'react-native';
import EditConnectionForm from '../components/ConnectionsViewTabs/EditConnectionForm';

export default function ConnectionsDetailsView({ details, id }) {

    const [ edit, setEdit ] = useState(false);


    const styles = StyleSheet.create({
        rootView: {
            display: 'flex',
            justifyContent: 'flex-start',
            width: '90%',
            margin: 0,
        },
        header: {
            marginTop: 1,
            marginBottom: 20,
            borderBottomWidth: .5,
            borderBottomColor: 'rgba(24, 23, 21, 0.3)',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        headerText: {
            color: '#a1a1a1',
            fontWeight: 'bold',

        },
        textView: { // container that wraps every text row, ex) First Name John
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
        edit: {
            color: '#0279AC',
            paddingTop: 20,
            paddingRight: 5,
            textAlign: 'right',
        },
    });


    const salaryRange = (num) => {
        switch (num) {
        case 2:
            return '<$40,000';
        case 3:
            return '$40,001-$80,000';
        case 4:
            return '$81,001-$120,000';
        case 5:
            return '$120,001-$160,000';
        case 6:
            return '$160,001-$200,000';
        case 7:
            return '$200,000+';
        default:
            return '';
        }
    };

    const teleFormat = (phoneNumber) => {
        let phoneNumberArr = phoneNumber.split('');
        if (phoneNumberArr.length === 10) {
            return `(${phoneNumberArr.slice(0, 3).join('')}) ${phoneNumberArr.slice(3, 6).join('')}-${phoneNumberArr.slice(6, 10).join('')}`;
        }
        else if (phoneNumberArr.length === 11) {
            return `${phoneNumberArr[0]}(${phoneNumberArr.slice(1, 4).join('')}) ${phoneNumberArr.slice(4, 7).join('')}-${phoneNumberArr.slice(7, 11).join('')}`;
        }
        else {return phoneNumber}
    };
    return (
        edit === false
            ? <View style={styles.rootView}>
                <Text style={styles.edit} onPress={() => {
                    setEdit(!edit);
                }}>Edit</Text>
                <View style={styles.header}>
                    <Text style={styles.headerText}>INFORMATION</Text>
                </View>
                <View>
                    {details.first_name
                        ? <View style={styles.textView}>
                            <Text style={styles.labelText}>First Name</Text>
                            <Text style={styles.contentText}>{details.first_name}</Text>
                        </View> : null}
                    {details.middle_name
                        ? <View style={styles.textView}>
                            <Text style={styles.labelText}>Middle Name</Text>
                            <Text style={styles.contentText}>{details.middle_name}</Text>
                        </View> : null}
                    {details.last_name
                        ? <View style={styles.textView}>
                            <Text style={styles.labelText}>Last Name</Text>
                            <Text style={styles.contentText}>{details.last_name}</Text>
                        </View> : null}
                    {details.suffix
                        ? <View style={styles.textView}>
                            <Text style={styles.labelText}>Suffix</Text>
                            <Text style={styles.contentText}>{details.suffix}</Text>
                        </View> : null}
                    {details.birthday
                        ? <View style={styles.textView}>
                            <Text style={styles.labelText}>Date of Birth</Text>
                            <Text style={styles.contentText}>{details.birthday.month}/{details.birthday.day}/{details.birthday.year}</Text></View> : null}
                    {details.gender
                        ? <View style={styles.textView}>
                            <Text style={styles.labelText}>Gender</Text>
                            <Text style={styles.contentText}>{details.gender}</Text>
                        </View> : null}
                    {details.deceased
                        ? <View style={styles.textView}>
                            <Text style={styles.labelText}>Deceased</Text>
                            <Text style={styles.contentText}>{details.deceased ? 'Yes' : 'No'}</Text>
                        </View> : null}
                </View>
                {(details.addresses.length || details.telephones.length || details.emails.length || details.job_title || details.salary_range)
                    ? <>
                        <View style={styles.header}><Text style={styles.headerText}>CONTACT DETAILS</Text></View>
                        <View>
                            {details.addresses.length
                                ? <View style={styles.textView}>
                                    <Text style={styles.labelText}>Residence</Text>
                                    <View style={styles.addressDiv}>
                                        {details.addresses.length ? details.addresses.map((address, ind) =>
                                            <TouchableOpacity key={ind}
                                                style={styles.addPad}
                                                onPress={() => { Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURI(address.raw)}`) }}>
                                                <Text style={{ color: '#0279AC' }}>{address.street_number} {address.route}</Text>
                                                <Text style={{ color: '#0279AC' }}>{address.locality}{','} {address.state_code}</Text>
                                                <Text style={{ color: '#0279AC' }}>{address.postal_code}{','} {address.country}</Text>
                                            </TouchableOpacity>) : null}
                                    </View>
                                </View> : null}
                            {details.telephones.length
                                ? <View style={styles.textView}>
                                    <Text style={styles.labelText}>Telephone</Text>
                                    <View style={styles.phoneDiv}>
                                        {details.telephones.length ? details.telephones.map((telephoneObj, index) =>
                                            <Text key={index}
                                                style={styles.linkText}
                                                onPress={() => {
                                                    Platform.OS === 'android' ? Linking.openURL(`tel: ${telephoneObj.telephone}`) : Linking.openURL(`tel:// ${telephoneObj.telephone}`); // might need a promise then catch
                                                }}
                                            >
                                                {teleFormat(telephoneObj.telephone)}
                                            </Text>) : null}
                                    </View>
                                </View> : null}
                            {details.emails.length
                                ? <View style={styles.textView}>
                                    <Text style={styles.labelText}>Email</Text>
                                    {details.emails.length ? details.emails.map((emailObj, ind) => <Text
                                        key={ind}
                                        style={styles.linkText}
                                        onPress={() => { Linking.openURL(`mailto: ${emailObj.email}`) }}
                                    >{emailObj.email}</Text>) : null}
                                </View> : null}
                            {details.job_title
                                ? <View style={styles.textView}>
                                    <Text style={styles.labelText}>Job Title</Text>
                                    <Text style={styles.contentText}>{details.job_title}</Text>
                                </View> : null}
                            {details.employer
                                ? <View style={styles.textView}>
                                    <Text style={styles.labelText}>Employer</Text>
                                    <Text style={styles.contentText}>{details.employer}</Text>
                                </View> : null}
                            {details.salary_range
                                ? <View style={styles.textView}>
                                    <Text style={styles.labelText}>Salary Range</Text>
                                    <Text style={styles.contentText}> {salaryRange(details.salary_range)}</Text>
                                </View> : null}
                        </View>
                    </> : null}

                {(details.facebook || details.linkedin || details.twitter) ? <>
                    <View style={styles.header}><Text style={styles.headerText}>SOCIAL MEDIA</Text></View>
                    <View>
                        {details.facebook
                            ? <View style={styles.textView}>
                                <Text style={styles.labelText}>Facebook</Text>
                                <Text style={styles.linkText} onPress={() => Linking.openURL(`${details.facebook}`)}>{details.facebook}</Text>
                            </View> : null}
                        {details.linkedin
                            ? <View style={styles.textView}>
                                <Text style={styles.labelText}>LinkedIn</Text>
                                <Text style={styles.linkText} onPress={() => Linking.openURL(`${details.linkedin}`)}>{details.linkedin}</Text>
                            </View> : null}
                        {details.linkedin
                            ? <View style={styles.textView}>
                                <Text style={styles.labelText}>Twitter</Text>
                                <Text style={styles.linkText} onPress={() => Linking.openURL(`${c}`)}>{details.twitter}</Text>
                            </View> : null}
                    </View>
                </> : null}
                <View style={{ height: 60 }} />
            </View>
            : <EditConnectionForm details={details} id={id} setEdit={setEdit} />
    );

}

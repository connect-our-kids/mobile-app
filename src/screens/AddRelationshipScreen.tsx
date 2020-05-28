import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
} from 'react-native';
// eslint-disable-next-line
//@ts-ignore
import { Picker } from 'react-native-picker-dropdown';
import { CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import * as yup from 'yup';
import styles from './styles';
import mime from 'mime';
import {
    createRelationship,
    clearCreateRelationship,
    getCase,
} from '../store/actions';
import { RootState } from '../store/reducers';
import Loader from '../components/Loader/Loader';
import PickPhotoButton from '../components/family-connections/AddDocumentButtons/PickPhotoButton';
import TakePhotoButton from '../components/family-connections/AddDocumentButtons/TakePhotoButton';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { ReactNativeFile } from 'apollo-upload-client';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
    AddressInput,
    EmailInput,
    TelephoneInput,
} from '../generated/globalTypes';

type DispatchProps = {
    createRelationship: typeof createRelationship;
    clearCreateRelationship: typeof clearCreateRelationship;
    getCase: typeof getCase;
};

type StateProps = {
    image?: ImageInfo;
    fileName?: string;
    fileType?: string | null;
    input?: ImageInfo;
    attachment?: ReactNativeFile;
    lastAddedRelationshipId: number;
    isAddingRelationship: boolean;
    caseId: number;
    error: string | undefined;
    gender?: string[];
};

type Navigation = NavigationScreenProp<NavigationState>;

type OwnProps = {
    navigation: Navigation;
};

type Props = DispatchProps & StateProps & OwnProps;

interface InitialForm {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    suffix?: string;
    title?: string;
    notes?: string;
    picture?: ReactNativeFile;
    gender?: string;
    dateOfDeath?: string;
    isDeceased?: boolean;
    birthMonth?: number;
    birthYear?: number;
    dayOfBirth?: number;
    birthdayRaw?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    jobTitle?: string;
    employer?: string;
    salaryRangeId?: number;
    statusId?: number;
    isSeen?: boolean;
    ppSearchImported?: boolean;
    addresses?: AddressInput[];
    emails?: EmailInput[];
    telephones?: TelephoneInput[];
}

type FormKeys = keyof InitialForm;

type AddressFormKeys = keyof AddressInput;

type EmailFormKeys = keyof EmailInput;

type TelephonesFormKeys = keyof TelephoneInput;

type PossibleKeyTypes =
    | FormKeys
    | AddressFormKeys
    | EmailFormKeys
    | TelephonesFormKeys;

const initialForm: InitialForm = {};
const schema = yup.object<InitialForm>().shape(
    {
        firstName: yup.string().when(['middleName', 'lastName'], {
            is: (middleName, lastName) => !middleName && !lastName,
            then: yup.string().required(),
        }),
        middleName: yup.string().when(['firstName', 'lastName'], {
            is: (firstName, lastName) => !firstName && !lastName,
            then: yup.string().required(),
        }),
        lastName: yup.string().when(['firstName', 'middleName'], {
            is: (firstName, middleName) => !firstName && !middleName,
            then: yup.string().required(),
        }),
        suffix: yup.string(),
        title: yup.string(),
        notes: yup.string(),
        // picture: yup.nullable(), //add later
        gender: yup.string(),
        isDeceased: yup.boolean(),
        birthMonth: yup.number(),
        birthYear: yup.number(),
        dayOfBirth: yup.number(),
        birthdayRaw: yup.string(),
        facebook: yup.string(),
        linkedin: yup.string(),
        twitter: yup.string(),
        jobTitle: yup.string(),
        employer: yup.string(),
        salaryRangeId: yup.number(),
        statusId: yup.number().max(6),
        isSeen: yup.boolean(),
        ppSearchImported: yup.boolean(),
        addresses: yup.array().of(
            yup.object({
                isVerified: yup.boolean(),
                isHidden: yup.boolean(),
                country: yup.string(),
                countryCode: yup.string(),
                formatted: yup.string(),
                latitude: yup.number(),
                locality: yup.string(),
                longitude: yup.number(),
                postalCode: yup.string(),
                raw: yup.string(),
                route: yup.string(),
                state: yup.string(),
                stateCode: yup.string(),
                streetNumber: yup.string(),
            })
        ),
        emails: yup.array().of(
            yup.object({
                isVerified: yup.boolean(),
                isHidden: yup.boolean(),
                emailAddress: yup.string(),
            })
        ),
        telephones: yup.array().of(
            yup.object({
                isVerified: yup.boolean(),
                isHidden: yup.boolean(),
                phoneNumber: yup.string(),
            })
        ),
    },
    [
        ['firstName', 'middleName'],
        ['firstName', 'lastName'],
        ['middleName', 'lastName'],
    ]
);
function AddRelationshipScreen(props: Props) {
    const [suffixValue, setSuffixValue] = useState('');
    const [genderValue, setGenderValue] = useState('');
    const [deceasedValue, setDeceasedValue] = useState(false);
    const [salaryValue, setSalaryValue] = useState(0);
    const [isHiddenPhone, setIsHiddenPhone] = useState(false);
    const [isHiddenEmail, setIsHiddenEmail] = useState(false);
    const [rawAddress, setRawAddress] = useState(['', '', '', '', '']);
    const [isVerifiedPhone, setIsVerifiedPhone] = useState(false);
    const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
    const [requiredTextName, setRequiredTextName] = useState(false);
    const [formData, setFormData] = useState(initialForm);
    const [showBirthCal, setShowBirthCal] = useState(false);
    const [birthdayDisplay, setBirthdayDisplay] = useState('');
    function handleBirthDatePicker(date: string) {
        const birthDate = new Date(date);
        setShowBirthCal(false);
        const dayRaw = birthDate.getDate();
        const dayString =
            dayRaw.toString().length === 1 ? `0${dayRaw}` : dayRaw;
        const monthRaw = birthDate.getMonth() + 1;
        const monthString =
            monthRaw.toString().length === 1 ? `0${monthRaw}` : monthRaw;
        const year = birthDate.getFullYear();
        const birthdayDisplayValue = monthString + '/' + dayString + '/' + year;
        setBirthdayDisplay(birthdayDisplayValue);
        const utcRaw = `${year}-${monthString}-${dayString}`;
        const iso = new Date(utcRaw).toISOString();
        setFormData({
            ...formData,
            birthMonth: monthRaw,
            birthYear: year,
            dayOfBirth: dayRaw,
            birthdayRaw: iso,
        });
    }
    function showBirthDatePicker() {
        setShowBirthCal(true);
    }

    function hideBirthDatePicker() {
        setShowBirthCal(false);
    }

    function handleChange(
        nameKey: PossibleKeyTypes,
        value: string | number | boolean | ReactNativeFile,
        phoneOrEmail?: string
    ) {
        const copy = { ...formData };
        //country is not used only raw
        if (nameKey === 'raw' || nameKey === 'locality') {
            if (copy.addresses !== undefined) {
                copy.addresses = [
                    {
                        ...copy.addresses[0],
                        [nameKey]: value,
                    },
                ];
            } else {
                copy.addresses = [
                    {
                        isVerified: false,
                        isHidden: false,
                        locality: '',
                        route: '',
                        streetNumber: '',
                        [nameKey]: value,
                    },
                ];
            }
        } else if (
            (nameKey === 'isVerified' ||
                nameKey === 'isHidden' ||
                nameKey === 'phoneNumber') &&
            phoneOrEmail === 'phone'
        ) {
            if (typeof value === 'boolean') {
                if (copy.telephones !== undefined) {
                    copy.telephones = [
                        {
                            ...copy.telephones[0],
                            [nameKey]: value,
                        },
                    ];
                } else {
                    copy.telephones = [
                        {
                            isVerified: false,
                            isHidden: false,
                            phoneNumber: '',
                            [nameKey]: value,
                        },
                    ];
                }
            } else if (typeof value === 'string' && nameKey === 'phoneNumber') {
                if (copy.telephones !== undefined) {
                    copy.telephones = [
                        {
                            ...copy.telephones[0],
                            phoneNumber: value,
                        },
                    ];
                } else {
                    copy.telephones = [
                        {
                            isVerified: false,
                            isHidden: false,
                            phoneNumber: value,
                        },
                    ];
                }
            }
        } else if (
            (nameKey === 'isVerified' ||
                nameKey === 'isHidden' ||
                nameKey === 'emailAddress') &&
            phoneOrEmail === 'email'
        ) {
            if (typeof value === 'boolean') {
                if (copy.emails !== undefined) {
                    copy.emails = [
                        {
                            ...copy.emails[0],
                            [nameKey]: value,
                        },
                    ];
                } else {
                    copy.emails = [
                        {
                            isVerified: false,
                            isHidden: false,
                            emailAddress: '',
                            [nameKey]: value,
                        },
                    ];
                }
            } else if (
                typeof value === 'string' &&
                nameKey === 'emailAddress'
            ) {
                if (copy.emails !== undefined) {
                    copy.emails = [
                        {
                            ...copy.emails[0],
                            emailAddress: value,
                        },
                    ];
                } else {
                    copy.emails = [
                        {
                            isVerified: false,
                            isHidden: false,
                            emailAddress: value,
                        },
                    ];
                }
            }
        } else {
            switch (nameKey) {
                case 'firstName':
                case 'middleName':
                case 'lastName':
                case 'suffix':
                case 'title':
                case 'notes':
                case 'gender':
                case 'dateOfDeath':
                case 'birthdayRaw':
                case 'facebook':
                case 'linkedin':
                case 'twitter':
                case 'jobTitle':
                case 'employer': {
                    if (typeof value === 'string') {
                        copy[nameKey] = value;
                    }
                    break;
                }
                case 'isDeceased':
                case 'isSeen':
                case 'ppSearchImported': {
                    if (typeof value === 'boolean') {
                        copy[nameKey] = value;
                    }
                    break;
                }
                case 'birthMonth':
                case 'birthYear':
                case 'dayOfBirth':
                case 'salaryRangeId':
                case 'statusId': {
                    if (typeof value === 'number') {
                        copy[nameKey] = value;
                    }
                    break;
                }
                case 'picture': {
                    if (typeof value === 'object') {
                        copy[nameKey] = value;
                    }
                    break;
                }
            }
        }
        setFormData(copy);
    }

    function handleRawAddress(placement: number, value: string) {
        const newAddress = [...rawAddress];
        newAddress[placement] = value;
        const rawString = [...newAddress].filter((v) => v != '').join(', ');
        handleChange('raw', rawString);
        setRawAddress(newAddress);
    }

    useEffect(() => {
        props.attachment && handleChange('picture', props.attachment);
    }, [props.attachment]);
    useEffect(() => {
        if (props.lastAddedRelationshipId !== undefined) {
            setFormData(initialForm);
            setSuffixValue('');
            setGenderValue('');
            setSalaryValue(0);
            setDeceasedValue(false);
            props.navigation.goBack();
            props.navigation.navigate('RelationshipScreen', {
                relationshipId: props.lastAddedRelationshipId,
            });
            props.clearCreateRelationship();
            props.getCase(props.caseId);
        }
    }, [props.lastAddedRelationshipId]);
    const saveNewPerson = () => {
        schema
            .validate(formData, { abortEarly: false })
            .then(() => {
                props.createRelationship(props.caseId, formData);
            })
            .catch((error) => {
                error.inner.forEach((e: { path: string }) => {
                    e.path == 'firstName' && setRequiredTextName(true);
                });
                error.inner.forEach((e: { path: string }) => {
                    e.path == 'middleName' && setRequiredTextName(true);
                });
                error.inner.forEach((e: { path: string }) => {
                    e.path == 'lastName' && setRequiredTextName(true);
                });
            });
    };

    return (
        <View style={styles.background}>
            <ScrollView contentContainerStyle={styles.containerStyle}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={props.error ? true : false}
                >
                    <View
                        style={{
                            height: '100%',
                            width: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        <View style={styles.centerView}>
                            <View style={styles.modalView}>
                                <Text>
                                    Error adding relationship. Please try again
                                    later.
                                </Text>
                                <TouchableOpacity style={styles.modalButton}>
                                    <Text
                                        style={styles.modalButtonText}
                                        onPress={() => {
                                            props.clearCreateRelationship();
                                        }}
                                    >
                                        close
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 20,
                    }}
                >
                    <View>
                        {props.image ? (
                            <Image
                                source={{ uri: props.image.uri }}
                                resizeMode={'cover'}
                                style={styles.attachmentPreview}
                            />
                        ) : (
                            <Image
                                source={require('../../assets/profile_placeholder.png')}
                            />
                        )}
                    </View>

                    <View style={styles.TakePhotoBtnGroup}>
                        <PickPhotoButton
                            afterAccept={(media) => {
                                props.navigation.navigate(
                                    'AddRelationshipScreen',
                                    {
                                        media,
                                    }
                                );
                            }}
                        />
                        <TakePhotoButton
                            afterAccept={(media) => {
                                props.navigation.navigate(
                                    'AddRelationshipScreen',
                                    {
                                        media,
                                    }
                                );
                            }}
                        />
                    </View>
                </View>
                {/* Information Section */}
                <View>
                    <View style={styles.sectionPadding}>
                        <View>
                            <Text style={styles.sectionHeader}>
                                Information
                            </Text>
                        </View>
                        <View style={styles.textPadding}>
                            <Text style={{ color: 'rgba(24,23,21,.5)' }}>
                                First Name *
                            </Text>
                        </View>
                        <View style={styles.nameInputContainer}>
                            <TextInput
                                style={
                                    requiredTextName
                                        ? styles.textInputRequired
                                        : styles.textInput
                                }
                                placeholder={'First Name'}
                                value={formData.firstName}
                                onChangeText={(text) => {
                                    handleChange('firstName', text);
                                    setRequiredTextName(false);
                                }}
                            />
                        </View>
                        <View style={styles.textPadding}>
                            <Text style={{ color: 'rgba(24,23,21,.5)' }}>
                                Middle Name *
                            </Text>
                        </View>
                        <View style={styles.nameInputContainer}>
                            <TextInput
                                style={
                                    requiredTextName
                                        ? styles.textInputRequired
                                        : styles.textInput
                                }
                                placeholder={'Middle Name'}
                                value={formData.middleName}
                                onChangeText={(text) => {
                                    handleChange('middleName', text);
                                    setRequiredTextName(false);
                                }}
                            />
                        </View>
                        <View style={styles.textPadding}>
                            <Text style={{ color: 'rgba(24,23,21,.5)' }}>
                                Last Name *
                            </Text>
                        </View>
                        <View style={styles.nameInputContainer}>
                            <TextInput
                                style={
                                    requiredTextName
                                        ? styles.textInputRequired
                                        : styles.textInput
                                }
                                placeholder={'Last Name'}
                                value={formData.lastName}
                                onChangeText={(text) => {
                                    handleChange('lastName', text);
                                    setRequiredTextName(false);
                                }}
                            />
                        </View>
                        <View>
                            {requiredTextName ? (
                                <Text style={styles.requiredText}>
                                    One of First, Middle, or Last name required!
                                </Text>
                            ) : (
                                <View></View>
                            )}
                        </View>
                        <Text style={styles.textPadding}>Suffix</Text>
                        <View style={styles.suffixDropdownContainer}>
                            <Picker
                                selectedValue={suffixValue}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue: string) => {
                                    setSuffixValue(itemValue);
                                    handleChange('suffix', itemValue);
                                }}
                            >
                                <Picker.Item label="None" value="" />
                                <Picker.Item label="Sr." value="Sr." />
                                <Picker.Item label="Jr." value="Jr." />
                                <Picker.Item label="II" value="II" />
                                <Picker.Item label="III" value="III" />
                                <Picker.Item label="IV" value="IV" />
                                <Picker.Item label="V" value="V" />
                            </Picker>
                        </View>
                        <Text style={styles.textPadding}>Title</Text>
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'Title'}
                                value={formData.title}
                                onChangeText={(text) =>
                                    handleChange('title', text)
                                }
                            />
                        </View>
                        <Text style={styles.textPadding}>Date of Birth</Text>
                        <View style={styles.fosterCareDateContainer}>
                            <TextInput
                                editable={false}
                                style={styles.textInput}
                                placeholder={'MM/DD/YYYY'}
                                value={birthdayDisplay}
                                onChangeText={(text) => {
                                    handleChange('birthdayRaw', text);
                                }}
                            />
                            <TouchableOpacity
                                style={{ padding: 10 }}
                                onPress={showBirthDatePicker}
                            >
                                <FontAwesome5
                                    name="calendar-alt"
                                    size={24}
                                    color="#0279AC"
                                />
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={showBirthCal}
                                onCancel={hideBirthDatePicker}
                                onConfirm={(date) =>
                                    handleBirthDatePicker(date.toString())
                                }
                            />
                        </View>
                        <Text style={styles.textPadding}>Gender Identity</Text>
                        <View style={styles.genderDropdownContainer}>
                            <Picker
                                selectedValue={genderValue}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue: string) => {
                                    setGenderValue(itemValue);
                                    handleChange('gender', itemValue);
                                }}
                            >
                                {props.gender?.map((value, index) => (
                                    <Picker.Item
                                        key={index}
                                        label={value}
                                        value={value}
                                    />
                                ))}
                            </Picker>
                        </View>
                        <View>
                            <Text style={styles.textPadding}>Deceased</Text>
                            <CheckBox
                                checked={deceasedValue}
                                size={36}
                                checkedColor={'#0279AC'}
                                uncheckedColor={'lightgray'}
                                containerStyle={{
                                    backgroundColor: 'white',
                                    borderColor: 'lightgray',
                                }}
                                onPress={() => {
                                    const newVal = !deceasedValue;
                                    handleChange('isDeceased', newVal);
                                    setDeceasedValue(newVal);
                                }}
                            />
                        </View>
                        <Text style={styles.textPadding}>Job Title</Text>
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'Job Title'}
                                value={formData.jobTitle}
                                onChangeText={(text) =>
                                    handleChange('jobTitle', text)
                                }
                            />
                        </View>
                        <Text style={styles.textPadding}>Employer</Text>
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'Employer'}
                                value={formData.employer}
                                onChangeText={(text) =>
                                    handleChange('employer', text)
                                }
                            />
                        </View>
                        <Text style={styles.textPadding}>Salary Range</Text>
                        <View style={styles.salaryDropdownContainer}>
                            <Picker
                                selectedValue={salaryValue}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue: number) => {
                                    setSalaryValue(itemValue);
                                    handleChange('salaryRangeId', itemValue);
                                }}
                            >
                                <Picker.Item label="Unknown" value={0} />
                                <Picker.Item label="<$40,000" value={1} />
                                <Picker.Item
                                    label="$40,001 - $80,000"
                                    value={2}
                                />
                                <Picker.Item
                                    label="$80,001 - $120,000"
                                    value={3}
                                />
                                <Picker.Item
                                    label="$120,001 - $160,000"
                                    value={4}
                                />
                                <Picker.Item
                                    label="$160,001 - $200,000"
                                    value={5}
                                />
                                <Picker.Item label="$200,000+" value={6} />
                            </Picker>
                        </View>
                        <Text style={styles.textPadding}>Residence</Text>
                        <View style={styles.addressContainer}>
                            <TextInput
                                style={styles.addressInput}
                                placeholder={'Street'}
                                value={rawAddress[0]}
                                onChangeText={(text) => {
                                    handleRawAddress(0, text);
                                }}
                            />
                        </View>
                        <View style={styles.cityZipContainer}>
                            <TextInput
                                style={styles.cityInput}
                                placeholder={'City'}
                                value={rawAddress[1]}
                                onChangeText={(text) => {
                                    handleRawAddress(1, text);
                                }}
                            />
                            <TextInput
                                maxLength={12}
                                keyboardType="numeric"
                                style={styles.zipInput}
                                placeholder={'Postal'}
                                value={rawAddress[2]}
                                onChangeText={(text) => {
                                    handleRawAddress(2, text);
                                }}
                            />
                        </View>
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.addressInput}
                                placeholder={'State'}
                                value={rawAddress[3]}
                                onChangeText={(text) => {
                                    handleRawAddress(3, text);
                                }}
                            />
                        </View>
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.addressInput}
                                placeholder={'Country'}
                                value={rawAddress[4]}
                                onChangeText={(text) => {
                                    handleRawAddress(4, text);
                                }}
                            />
                        </View>
                        <View>
                            <Text style={styles.textPadding}>Telephone #</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.formContainer}>
                                    <TextInput
                                        keyboardType="numeric"
                                        style={styles.addressInput}
                                        placeholder={'Telephone #'}
                                        value={
                                            formData.telephones
                                                ? formData.telephones[0]
                                                      .phoneNumber
                                                : ''
                                        }
                                        onChangeText={(text) => {
                                            handleChange(
                                                'phoneNumber',
                                                text,
                                                'phone'
                                            );
                                        }}
                                    />
                                </View>
                                {isHiddenPhone === false ? (
                                    <Entypo
                                        style={{
                                            paddingTop: 10,
                                            paddingLeft: 10,
                                        }}
                                        name="eye"
                                        size={36}
                                        color="#0279AC"
                                        onPress={() => {
                                            const newVal = !isHiddenPhone;
                                            handleChange(
                                                'isHidden',
                                                newVal,
                                                'phone'
                                            );
                                            setIsHiddenPhone(newVal);
                                        }}
                                    />
                                ) : (
                                    <Entypo
                                        style={{
                                            paddingTop: 10,
                                            paddingLeft: 10,
                                        }}
                                        name="eye-with-line"
                                        size={36}
                                        color="lightgray"
                                        onPress={() => {
                                            const newVal = !isHiddenPhone;
                                            handleChange(
                                                'isHidden',
                                                newVal,
                                                'phone'
                                            );
                                            setIsHiddenPhone(newVal);
                                        }}
                                    />
                                )}
                                <CheckBox
                                    checked={isVerifiedPhone}
                                    size={36}
                                    checkedColor={'#0279AC'}
                                    uncheckedColor={'lightgray'}
                                    containerStyle={{
                                        backgroundColor: 'white',
                                        borderColor: 'lightgray',
                                    }}
                                    onPress={() => {
                                        const newVal = !isVerifiedPhone;
                                        handleChange(
                                            'isVerified',
                                            newVal,
                                            'phone'
                                        );
                                        setIsVerifiedPhone(newVal);
                                    }}
                                />
                            </View>
                        </View>
                        <View>
                            <Text style={styles.textPadding}>Email</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.formContainer}>
                                    <TextInput
                                        style={styles.addressInput}
                                        placeholder={'Email'}
                                        value={
                                            formData.emails
                                                ? formData.emails[0]
                                                      .emailAddress
                                                : ''
                                        }
                                        onChangeText={(text) => {
                                            handleChange(
                                                'emailAddress',
                                                text,
                                                'email'
                                            );
                                        }}
                                    />
                                </View>
                                {!isHiddenEmail ? (
                                    <Entypo
                                        style={{
                                            paddingTop: 10,
                                            paddingLeft: 10,
                                        }}
                                        name="eye"
                                        size={36}
                                        color="#0279AC"
                                        onPress={() => {
                                            const newVal = !isHiddenEmail;
                                            handleChange(
                                                'isHidden',
                                                newVal,
                                                'email'
                                            );
                                            setIsHiddenEmail(newVal);
                                        }}
                                    />
                                ) : (
                                    <Entypo
                                        style={{
                                            paddingTop: 10,
                                            paddingLeft: 10,
                                        }}
                                        name="eye-with-line"
                                        size={36}
                                        color="lightgray"
                                        onPress={() => {
                                            const newVal = !isHiddenEmail;
                                            handleChange(
                                                'isHidden',
                                                newVal,
                                                'email'
                                            );
                                            setIsHiddenEmail(newVal);
                                        }}
                                    />
                                )}
                                <CheckBox
                                    checked={isVerifiedEmail}
                                    size={36}
                                    checkedColor={'#0279AC'}
                                    uncheckedColor={'lightgray'}
                                    containerStyle={{
                                        backgroundColor: 'white',
                                        borderColor: 'lightgray',
                                    }}
                                    onPress={() => {
                                        const newVal = !isVerifiedEmail;
                                        handleChange(
                                            'isVerified',
                                            newVal,
                                            'email'
                                        );
                                        setIsVerifiedEmail(newVal);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                {/* Social Media Section */}
                <View style={styles.sectionPadding}>
                    <View style={styles.highlightContainer}>
                        <Text style={styles.sectionHeader}>Social Media</Text>

                        <Text style={styles.textPadding}>Facebook</Text>
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'Facebook'}
                                value={formData.facebook}
                                onChangeText={(text) =>
                                    handleChange('facebook', text)
                                }
                            />
                        </View>
                        <Text style={styles.textPadding}>LinkedIn</Text>
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'Linkedin'}
                                value={formData.linkedin}
                                onChangeText={(text) =>
                                    handleChange('linkedin', text)
                                }
                            />
                        </View>
                        <Text style={styles.textPadding}>Twitter</Text>
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder={'Twitter'}
                                value={formData.twitter}
                                onChangeText={(text) =>
                                    handleChange('twitter', text)
                                }
                            />
                        </View>
                    </View>
                </View>
                {/* Highlight Section */}
                <View style={styles.sectionPadding}>
                    <View style={styles.highlightContainer}>
                        <Text style={styles.sectionHeader}>Highlights</Text>
                        <TextInput
                            multiline
                            numberOfLines={5}
                            style={styles.highlightInput}
                            value={formData.notes}
                            onChangeText={(text) => handleChange('notes', text)}
                        />
                    </View>
                    {/* Add/Cancel button Section */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => props.navigation.goBack()}
                        >
                            <Text style={{ color: '#0279AC' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => {
                                saveNewPerson();
                            }}
                        >
                            <Text style={{ color: 'white' }}>Add Person</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: 200 }}></View>
                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={props.isAddingRelationship}
                >
                    <View style={styles.centerModal}>
                        <View style={styles.modal}>
                            <Text>Adding Person...</Text>
                            <View style={styles.centerLoader}>
                                <Loader />
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
    const lastAddedRelationshipId = state.case.lastCreatedRelationship
        ?.id as number;
    const isAddingRelationship = state.case.isCreatingRelationship;
    const error = state.case.error;

    const input = ownProps.navigation.getParam('media') as ImageInfo;

    const image = input;

    const fileName = input && input.uri.split('/').pop();

    const gender = state.schema?.results?.schema.gender;

    const fileType = input && mime.getType(input.uri);

    const attachment =
        input && fileName && fileType
            ? new ReactNativeFile({
                  uri: input.uri,
                  type: fileType,
                  name: fileName,
              })
            : undefined;
    const caseId = state.case.results?.details?.id;
    if (caseId === undefined) {
        throw new Error(`No case id specified`);
    }
    return {
        isAddingRelationship,
        image,
        input,
        fileName,
        fileType,
        attachment,
        lastAddedRelationshipId,
        caseId,
        error,
        gender,
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    createRelationship,
    clearCreateRelationship,
    getCase,
})(AddRelationshipScreen);

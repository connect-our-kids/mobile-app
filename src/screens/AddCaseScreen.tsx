//Also contains Add Case button used in TopLevelNavigationOptions2 in the navigation index
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
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import * as yup from 'yup';
import styles from './styles';
import mime from 'mime';
import {
    createCase,
    clearAddCaseSuccess,
    addCaseClearError,
    getCases,
} from '../store/actions';
import { RootState } from '../store/reducers';
import Loader from '../components/Loader/Loader';
import PickPhotoButton from '../components/family-connections/AddDocumentButtons/PickPhotoButton';
import TakePhotoButton from '../components/family-connections/AddDocumentButtons/TakePhotoButton';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { ReactNativeFile } from 'apollo-upload-client';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { casesDetailSlim_cases } from '../generated/casesDetailSlim';

interface DispatchProps {
    createCase: typeof createCase;
    clearAddCaseSuccess: typeof clearAddCaseSuccess;
    addCaseClearError: typeof addCaseClearError;
    getCases: typeof getCases;
}

type StateProps = {
    image?: ImageInfo;
    fileName?: string;
    fileType?: string | null;
    input?: ImageInfo;
    attachment?: ReactNativeFile;
    lastAddedCaseId: number;
    result: casesDetailSlim_cases | undefined;
    isAddingCase: boolean;
    addCaseFailure: boolean;
    gender?: string[];
};

type Navigation = NavigationScreenProp<NavigationState>;

type OwnProps = {
    navigation: Navigation;
};

type Props = DispatchProps & StateProps & OwnProps;

interface AddressInput {
    isVerified: boolean;
    isHidden: boolean;
    country?: string;
    countryCode?: string;
    formatted?: string;
    latitude?: number;
    locality: string;
    longitude?: number;
    postalCode?: string;
    raw?: string;
    route: string;
    state?: string;
    stateCode?: string;
    streetNumber: string;
}
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
    fosterCare?: string;
    childStatusId?: number;
    caseStatusId: number;
    addresses?: AddressInput[];
}
type FormKeys = keyof InitialForm;

type NestedFormKeys = keyof AddressInput;

type PossibleKeyType = FormKeys | NestedFormKeys;

const initialForm: InitialForm = {
    caseStatusId: 1,
};

const schema = yup.object().shape(
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
        gender: yup.string(),
        isDeceased: yup.boolean(),
        birthMonth: yup.number(),
        birthYear: yup.number(),
        dayOfBirth: yup.number(),
        birthdayRaw: yup.string(),
        fosterCare: yup.string().required(),
        childStatusId: yup.number(),
        caseStatusId: yup.number().required().max(6),

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
    },
    [
        ['firstName', 'middleName'],
        ['firstName', 'lastName'],
        ['middleName', 'lastName'],
    ]
);
function AddCaseScreen(props: Props) {
    const [caseStatusValue, setCaseStatusValue] = useState(1);
    const [suffixValue, setSuffixValue] = useState('');
    const [genderValue, setGenderValue] = useState('');
    const [childStatusValue, setChildStatusValue] = useState(0);
    const [toggleChildStatus, setToggleChildStatus] = useState(false);
    const [requiredTextCaseStatus, setRequiredTextCaseStatus] = useState(false);
    const [requiredTextName, setRequiredTextName] = useState(false);
    const [rawAddress, setRawAddress] = useState(['', '', '', '', '']);
    const [
        requiredTextFosterDateAdded,
        setRequiredTextFosterDateAdded,
    ] = useState(false);
    const [fosterCareDisplay, setFosterCareDisplay] = useState('');
    const [birthdayDisplay, setBirthdayDisplay] = useState('');
    const [showCal, setShowCal] = useState(false);
    const [showBirthCal, setShowBirthCal] = useState(false);
    const [formData, setFormData] = useState(initialForm);

    function handleFosterDate(date: string) {
        const fosterDate = new Date(date);
        setShowCal(false);
        const dayRaw = fosterDate.getDate().toString();
        const day = dayRaw.length === 1 ? `0${dayRaw}` : dayRaw;
        const monthRaw = (fosterDate.getMonth() + 1).toString();
        const month = monthRaw.length === 1 ? `0${monthRaw}` : monthRaw;
        const year = fosterDate.getFullYear();
        const fosterCareDisplayValue = month + '/' + day + '/' + year;
        setFosterCareDisplay(fosterCareDisplayValue);
        const utcRaw = `${year}-${month}-${day}`;
        const iso = new Date(utcRaw).toISOString();
        setFormData({
            ...formData,
            fosterCare: iso,
        });
        setRequiredTextFosterDateAdded(false);
    }

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
        setRequiredTextFosterDateAdded(false);
    }

    function showDatePicker() {
        setShowCal(true);
    }

    function showBirthDatePicker() {
        setShowBirthCal(true);
    }

    function hideDatePicker() {
        setShowCal(false);
    }

    function hideBirthDatePicker() {
        setShowBirthCal(false);
    }

    function handleChange(
        nameKey: PossibleKeyType,
        value: string | number | boolean | ReactNativeFile
    ) {
        const copy = { ...formData };

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
                case 'fosterCare': {
                    if (typeof value === 'string') {
                        copy[nameKey] = value;
                    }
                    break;
                }
                case 'isDeceased': {
                    if (typeof value === 'boolean') {
                        copy[nameKey] = value;
                    }
                    break;
                }
                case 'birthMonth':
                case 'birthYear':
                case 'dayOfBirth':
                case 'childStatusId':
                case 'caseStatusId': {
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
        if (props.lastAddedCaseId !== undefined) {
            setFormData(initialForm);
            setSuffixValue('');
            setGenderValue('');
            setCaseStatusValue(1);
            setChildStatusValue(0);
            props.navigation.goBack();
            props.navigation.navigate('CaseView', {
                pk: props.lastAddedCaseId,
                caseData: props.result,
            });
            props.clearAddCaseSuccess();
            props.getCases();
        }
    }, [props.lastAddedCaseId]);
    const saveNewCase = () => {
        schema
            .validate(formData, { abortEarly: false })
            .then(() => {
                props.createCase(formData);
            })
            .catch((error) => {
                error.inner.forEach((e: { path: string }) => {
                    e.path == 'caseStatusId' && setRequiredTextCaseStatus(true);
                });
                error.inner.forEach((e: { path: string }) => {
                    e.path == 'firstName' && setRequiredTextName(true);
                });
                error.inner.forEach((e: { path: string }) => {
                    e.path == 'middleName' && setRequiredTextName(true);
                });
                error.inner.forEach((e: { path: string }) => {
                    e.path == 'lastName' && setRequiredTextName(true);
                });
                error.inner.forEach((e: { path: string }) => {
                    e.path == 'fosterCare' &&
                        setRequiredTextFosterDateAdded(true);
                });
            });
    };

    return (
        <View style={styles.background}>
            <ScrollView contentContainerStyle={styles.containerStyle}>
                {/* Add Photo Section */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={props.addCaseFailure}
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
                                    Error adding case. Please try again later.
                                </Text>
                                <TouchableOpacity style={styles.modalButton}>
                                    <Text
                                        style={styles.modalButtonText}
                                        onPress={() => {
                                            props.addCaseClearError();
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
                                props.navigation.navigate('AddCaseScreen', {
                                    media,
                                });
                            }}
                        />
                        <TakePhotoButton
                            afterAccept={(media) => {
                                props.navigation.navigate('AddCaseScreen', {
                                    media,
                                });
                            }}
                        />
                    </View>
                </View>
                {/* Status Section */}
                <View>
                    <View style={{ paddingLeft: 15, width: '95%' }}>
                        <View style={styles.statusTextContainer}>
                            <Text style={styles.sectionHeader}>Status</Text>
                        </View>
                        <Text
                            style={{
                                paddingTop: 10,
                                paddingBottom: 10,
                                color: 'rgba(24,23,21,.5)',
                            }}
                        >
                            Case Status *
                        </Text>
                        <View
                            style={
                                requiredTextCaseStatus
                                    ? styles.dropdownContainerRequired
                                    : styles.dropdownContainer
                            }
                        >
                            <Picker
                                selectedValue={caseStatusValue}
                                value={formData.caseStatusId}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue: number) => {
                                    setCaseStatusValue(itemValue);
                                    if (itemValue === 6) {
                                        setToggleChildStatus(true);
                                    } else {
                                        setToggleChildStatus(false);
                                    }
                                    handleChange('caseStatusId', itemValue);
                                    setRequiredTextCaseStatus(false);
                                }}
                            >
                                {/* <Picker.Item label="" value={7} /> */}
                                <Picker.Item label="New" value={1} />
                                <Picker.Item label="Discovery" value={2} />
                                <Picker.Item label="Engagement" value={3} />
                                <Picker.Item
                                    label="Promising Placement"
                                    value={4}
                                />
                                <Picker.Item label="Finalization" value={5} />
                                <Picker.Item label="Closed" value={6} />
                            </Picker>
                        </View>
                        <View>
                            {requiredTextCaseStatus ? (
                                <Text style={styles.requiredText}>
                                    Case Status is required!
                                </Text>
                            ) : (
                                <View></View>
                            )}
                        </View>
                        {toggleChildStatus ? (
                            <View>
                                <Text
                                    style={{
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                    }}
                                >
                                    Child Status
                                </Text>
                                <View style={styles.dropdownContainer}>
                                    <Picker
                                        selectedValue={childStatusValue}
                                        value={formData.childStatusId}
                                        style={{
                                            height: 50,
                                            width: '100%',
                                        }}
                                        onValueChange={(itemValue: number) => {
                                            setChildStatusValue(itemValue);
                                            handleChange(
                                                'childStatusId',
                                                itemValue
                                            );
                                        }}
                                    >
                                        <Picker.Item
                                            label="Achieved Permanency"
                                            value={1}
                                        />
                                        <Picker.Item
                                            label="Group Home"
                                            value={2}
                                        />
                                        <Picker.Item
                                            label="Foster Home"
                                            value={3}
                                        />
                                        <Picker.Item
                                            label="Kinship"
                                            value={4}
                                        />
                                    </Picker>
                                </View>
                            </View>
                        ) : (
                            <View></View>
                        )}
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
                        <Text style={styles.textPadding}>Residence</Text>
                        <View style={styles.addressContainer}>
                            <TextInput
                                style={styles.addressInput}
                                placeholder={'Street'}
                                value={rawAddress[0]}
                                onChangeText={(text) =>
                                    handleRawAddress(0, text)
                                }
                            />
                        </View>
                        <View style={styles.cityZipContainer}>
                            <TextInput
                                style={styles.cityInput}
                                placeholder={'City'}
                                value={rawAddress[1]}
                                onChangeText={(text) =>
                                    handleRawAddress(1, text)
                                }
                            />
                            <TextInput
                                maxLength={12}
                                keyboardType="numeric"
                                style={styles.zipInput}
                                placeholder={'Postal'}
                                value={rawAddress[2]}
                                onChangeText={(text) =>
                                    handleRawAddress(2, text)
                                }
                            />
                        </View>
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.addressInput}
                                placeholder={'State'}
                                value={rawAddress[3]}
                                onChangeText={(text) =>
                                    handleRawAddress(3, text)
                                }
                            />
                        </View>
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.addressInput}
                                placeholder={'Country'}
                                value={rawAddress[4]}
                                onChangeText={(text) =>
                                    handleRawAddress(4, text)
                                }
                            />
                        </View>
                        <Text style={styles.textPadding}>
                            Date added to case load *
                        </Text>
                        <View style={styles.fosterCareDateContainer}>
                            <TextInput
                                editable={false}
                                style={
                                    requiredTextFosterDateAdded
                                        ? styles.textInputRequired
                                        : styles.textInput
                                }
                                placeholder={'MM/DD/YYYY'}
                                value={fosterCareDisplay}
                                onChangeText={(text) => {
                                    handleChange('fosterCare', text);
                                }}
                            />
                            <TouchableOpacity
                                style={{ padding: 10 }}
                                onPress={showDatePicker}
                            >
                                <FontAwesome5
                                    name="calendar-alt"
                                    size={24}
                                    color="#0279AC"
                                />
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={showCal}
                                onCancel={hideDatePicker}
                                onConfirm={(date) =>
                                    handleFosterDate(date.toString())
                                }
                            />
                        </View>
                        <View>
                            {requiredTextFosterDateAdded ? (
                                <Text style={styles.requiredText}>
                                    Date added to case load is required!
                                </Text>
                            ) : (
                                <View></View>
                            )}
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
                                saveNewCase();
                            }}
                        >
                            <Text style={{ color: 'white' }}>Add Case</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: 200 }}></View>
                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={props.isAddingCase}
                >
                    <View style={styles.centerModal}>
                        <View style={styles.modal}>
                            <Text>Adding Case...</Text>
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
    const lastAddedCaseId = state.cases.lastAddedCase?.id as number;
    const isAddingCase = state.cases.isAddingCase;
    const result = state.cases.lastAddedCase;
    const addCaseFailure = state.cases.addCaseFailure;

    const input = ownProps.navigation.getParam('media') as ImageInfo;

    const image = input;

    const fileName = input && input.uri.split('/').pop();

    const fileType = input && mime.getType(input.uri);

    const attachment =
        input && fileName && fileType
            ? new ReactNativeFile({
                  uri: input.uri,
                  type: fileType,
                  name: fileName,
              })
            : undefined;

    const gender = state.schema?.results?.schema.gender;

    return {
        image,
        fileName,
        fileType,
        input,
        attachment,
        lastAddedCaseId,
        result,
        isAddingCase,
        addCaseFailure,
        gender,
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    createCase,
    clearAddCaseSuccess,
    addCaseClearError,
    getCases,
})(AddCaseScreen);

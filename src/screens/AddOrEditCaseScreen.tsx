//Also contains Add Case button used in TopLevelNavigationOptions2 in the navigation index
import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
// eslint-disable-next-line
//@ts-ignore
import { Picker } from 'react-native-picker-dropdown';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import * as yup from 'yup';
import styles from './styles';
import mime from 'mime';
import PickPhotoButton from '../components/family-connections/AddDocumentButtons/PickPhotoButton';
import TakePhotoButton from '../components/family-connections/AddDocumentButtons/TakePhotoButton';
import { ReactNativeFile } from 'apollo-upload-client';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BusyModal } from '../components/modals/BusyModal';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { GenericModal } from '../components/modals/GenericModal';
import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';
import {
    CREATE_CASE_MUTATION,
    addCaseCache,
    CASE_DETAIL_FULL_QUERY,
    EDIT_CASE_MUTATION,
} from '../store/actions/fragments/cases';
import {
    createCaseMutation,
    createCaseMutationVariables,
} from '../generated/createCaseMutation';
import {
    CreateCaseInput,
    AddressInput,
    UpdateCaseInput,
    StringWrapper,
    IntWrapper,
    DateWrapper,
    UploadWrapper,
} from '../generated/globalTypes';
import { STATIC_DATA_QUERY } from '../store/actions/fragments/schema';
import {
    staticDataQuery,
    staticDataQueryVariables,
} from '../generated/staticDataQuery';
import { ME_QUERY } from '../store/actions/fragments/me';
import { meQuery } from '../generated/meQuery';
import {
    caseDetailFull,
    caseDetailFullVariables,
} from '../generated/caseDetailFull';
import {
    editCaseMutation,
    editCaseMutationVariables,
} from '../generated/editCaseMutation';

const schema = yup.object().shape<CreateCaseInput>(
    {
        firstName: yup
            .string()
            .nullable()
            .when(['middleName', 'lastName', 'caseFileNumber'], {
                is: (middleName, lastName, caseFileNumber) =>
                    !middleName && !lastName && !caseFileNumber,
                then: yup.string().required().defined(),
                otherwise: yup.string().nullable(),
            }),
        middleName: yup
            .string()
            .nullable()
            .when(['firstName', 'lastName', 'caseFileNumber'], {
                is: (firstName, lastName, caseFileNumber) =>
                    !firstName && !lastName && !caseFileNumber,
                then: yup.string().required().defined(),
                otherwise: yup.string().nullable(),
            }),
        lastName: yup
            .string()
            .nullable()
            .when(['firstName', 'middleName', 'caseFileNumber'], {
                is: (firstName, middleName, caseFileNumber) =>
                    !firstName && !middleName && !caseFileNumber,
                then: yup.string().required().defined(),
                otherwise: yup.string().nullable(),
            }),

        // FYI: this field is not in the person object
        caseFileNumber: yup
            .string()
            .nullable()
            .when(['firstName', 'middleName', 'lastName'], {
                is: (firstName, middleName, lastName) =>
                    !firstName && !middleName && !lastName,
                then: yup.string().required().defined(),
                otherwise: yup.string().nullable(),
            }),

        suffix: yup.string().nullable(),
        title: yup.string().nullable(),
        notes: yup.string().nullable(),
        gender: yup.string().nullable(),
        isDeceased: yup.boolean().nullable(),
        birthMonth: yup.number().nullable(),
        birthYear: yup.number().nullable(),
        dayOfBirth: yup.number().nullable(),
        birthdayRaw: yup.string().nullable(),

        addresses: yup
            .array<AddressInput>(
                yup
                    .object<AddressInput>({
                        isVerified: yup.boolean().defined(),
                        isHidden: yup.boolean().defined(),
                        country: yup.string().nullable(),
                        countryCode: yup.string().nullable(),
                        formatted: yup.string().nullable(),
                        latitude: yup.number().nullable(),
                        locality: yup.string().defined(),
                        longitude: yup.number().nullable(),
                        postalCode: yup.string().nullable(),
                        raw: yup.string().nullable(),
                        route: yup.string().defined(),
                        routeTwo: yup.string().nullable(),
                        state: yup.string().nullable(),
                        stateCode: yup.string().nullable(),
                        streetNumber: yup.string().defined(),
                        label: yup.string().nullable(),
                    })
                    .defined()
            )
            .nullable(),

        // FYI: these fields are not in the person object
        fosterCare: yup.string().nullable().required(),
        childStatusId: yup.number().nullable(),
        caseStatusId: yup.number().required().max(6),
    },
    [
        ['firstName', 'lastName'],
        ['middleName', 'lastName'],
        ['firstName', 'middleName'],
        ['caseFileNumber', 'firstName'],
        ['caseFileNumber', 'middleName'],
        ['caseFileNumber', 'lastName'],
    ]
);

const toStringWrapper = (input: string | null | undefined): StringWrapper => {
    return { val: input };
};

const toNumberWrapper = (input: number | null | undefined): IntWrapper => {
    return { val: input };
};
const toDateWrapper = (input: Date | null | undefined): DateWrapper => {
    return { val: input };
};

const toUploadWrapper = (
    input: ReactNativeFile | string | null | undefined
): UploadWrapper | undefined => {
    if (input instanceof ReactNativeFile) {
        return { val: input };
    }
    return undefined;
};

const convertToUpdateCaseInput = (input: CreateCaseInput): UpdateCaseInput => {
    let sanitizedAddresses: AddressInput[] | undefined = undefined;
    if (input.addresses) {
        sanitizedAddresses = input.addresses.map((address) => {
            return { ...address, id: undefined, __typename: undefined };
        });
    }
    const output: UpdateCaseInput = {
        firstName: toStringWrapper(input.firstName),
        middleName: toStringWrapper(input.middleName),
        lastName: toStringWrapper(input.lastName),
        suffix: toStringWrapper(input.suffix),
        title: toStringWrapper(input.title),
        notes: toStringWrapper(input.notes),
        picture: toUploadWrapper(input.picture),
        gender: input.gender,
        dateOfDeath: undefined,
        isDeceased: undefined,
        birthMonth: toNumberWrapper(input.birthMonth),
        birthYear: toNumberWrapper(input.birthYear),
        dayOfBirth: toNumberWrapper(input.dayOfBirth),
        birthdayRaw: toStringWrapper(input.birthdayRaw),
        addresses: sanitizedAddresses,
        caseFileNumber: toStringWrapper(input.caseFileNumber),
        fosterCare: toDateWrapper(input.fosterCare), // TODO date format
        childStatusId: toNumberWrapper(input.childStatusId),
        caseStatusId: input.caseStatusId,
    };

    return output;
};

const addressToStreetNumberAndRoute = (caseInput: CreateCaseInput): string => {
    if (caseInput.addresses && caseInput.addresses.length > 0) {
        const address = caseInput.addresses[0];
        if (address.streetNumber && address.route) {
            return `${address.streetNumber} ${address.route}`;
        } else if (address.streetNumber) {
            return address.streetNumber;
        } else if (address.route) {
            return address.route;
        }
    }
    return '';
};

const fosterCareToDisplay = (
    fosterCare: string | null | undefined
): string | undefined => {
    // should be in the following format 2019-09-25T00:00:00.000Z
    if (fosterCare) {
        const matches = fosterCare.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (matches && matches.length === 4) {
            return `${matches[2]}/${matches[3]}/${matches[1]}`;
        }
    }
    return undefined;
};

export function AddOrEditCaseScreen(props: {
    navigation: NavigationScreenProp<NavigationState>;
}): JSX.Element {
    const [requiredTextCaseStatus, setRequiredTextCaseStatus] = useState(false);
    const [requiredTextName, setRequiredTextName] = useState(false);
    const [
        requiredTextFosterDateAdded,
        setRequiredTextFosterDateAdded,
    ] = useState(false);
    const [showFosterCareDatePicker, setShowFosterCareDatePicker] = useState(
        false
    );
    const [showBirthdayDatePicker, setShowBirthdayDatePicker] = useState(false);
    // TODO caseStatusId needs to come from API
    const [formData, setFormData] = useState<CreateCaseInput>({
        caseStatusId: 1,
        addresses: [
            {
                isHidden: false,
                isVerified: false,
                locality: '',
                route: '',
                streetNumber: '',
            },
        ],
    });
    const [image, setImage] = useState<ReactNativeFile | undefined>(undefined);

    const [createOrEditCaseError, setCreateOrEditCaseError] = useState<
        string | undefined
    >(undefined);
    const meResult = useQuery<meQuery>(ME_QUERY, {
        errorPolicy: 'all',
    });

    const [getCase, getCaseResult] = useLazyQuery<
        caseDetailFull,
        caseDetailFullVariables
    >(CASE_DETAIL_FULL_QUERY, {
        errorPolicy: 'all',
    });

    const [getSchema, schemaResult] = useLazyQuery<
        staticDataQuery,
        staticDataQueryVariables
    >(STATIC_DATA_QUERY, {
        errorPolicy: 'all',
    });

    // once we have the users team get schema data
    useEffect(() => {
        if (meResult.data?.me.userTeam) {
            console.log(
                `Getting schema data for team ${meResult.data?.me.userTeam.team.name}`
            );
            getSchema({
                variables: { teamId: meResult.data?.me.userTeam.team.id },
            });
        }
    }, [meResult]);

    // remove empty string from list of genders if present
    // in the future this should be done on the backend
    const genders = (schemaResult.data?.schema?.gender ?? []).filter(
        (value) => value
    );

    const sortBySortOrder = (
        a: { sortOrder: number | null },
        b: { sortOrder: number | null }
    ) => {
        if (a.sortOrder === b.sortOrder)
            // identical? return 0
            return 0;
        else if (a.sortOrder === null)
            // a is null? last
            return 1;
        else if (b.sortOrder === null)
            // b is null? last
            return -1;
        // compare, negate if descending
        else return a.sortOrder > b.sortOrder ? 1 : -1;
    };

    const caseStatuses = (schemaResult.data?.schema?.caseStatus ?? []).sort(
        sortBySortOrder
    );

    const childStatuses = (schemaResult.data?.schema?.childStatus ?? []).sort(
        sortBySortOrder
    );

    const caseEditId = props.navigation.getParam('pk', undefined) as
        | number
        | undefined;

    // load case if editing a case
    // once on startup
    useEffect(() => {
        if (caseEditId) {
            console.log(`Loading case ${caseEditId}`);
            getCase({ variables: { caseId: caseEditId } });
        }
    }, []);

    // load case data into form when we are editing case
    useEffect(() => {
        if (
            getCaseResult.called &&
            getCaseResult.data &&
            !getCaseResult.loading &&
            !getCaseResult.error
        ) {
            const defaultCaseStatusId =
                caseStatuses.length > 0 ? caseStatuses[0].id : 0;

            if (getCaseResult.data.details?.caseStatus?.id === undefined) {
                console.log(
                    `Editing case that does not have case status set. Defaulting to ${defaultCaseStatusId}`
                );
            }

            const formDataFromCase: CreateCaseInput = {
                ...formData,
                ...getCaseResult.data.details?.person,
                caseFileNumber: getCaseResult.data.details?.caseFileNumber,
                childStatusId: getCaseResult.data.details?.childStatus?.id,
                caseStatusId:
                    getCaseResult.data.details?.caseStatus?.id ??
                    defaultCaseStatusId,
                fosterCare: getCaseResult.data.details?.fosterCare,
            };
            // ensure there is at least one address set
            if (
                !formDataFromCase.addresses ||
                formDataFromCase.addresses.length === 0
            ) {
                formDataFromCase.addresses = [
                    {
                        isHidden: false,
                        isVerified: false,
                        locality: '',
                        route: '',
                        streetNumber: '',
                    },
                ];
            }

            setFormData(formDataFromCase);
        }
    }, [
        getCaseResult.called,
        getCaseResult.loading,
        getCaseResult.data,
        getCaseResult.error,
    ]);

    const [createCaseGraphQL, createCaseResult] = useMutation<
        createCaseMutation,
        createCaseMutationVariables
    >(CREATE_CASE_MUTATION, {
        errorPolicy: 'all',
        onCompleted: (data) => {
            //setDeleteCaseState(undefined);
            props.navigation.goBack();
            props.navigation.navigate('CaseView', {
                pk: data.createCase.id,
            });
        },
        onError: (error) => {
            setCreateOrEditCaseError(error.message ?? 'Unknown error');
        },
    });

    const [editCaseGraphQL, editCaseResult] = useMutation<
        editCaseMutation,
        editCaseMutationVariables
    >(EDIT_CASE_MUTATION, {
        errorPolicy: 'all',
        onCompleted: (data) => {
            //setDeleteCaseState(undefined);
            props.navigation.goBack();
            props.navigation.navigate('CaseView', {
                pk: data.updateCase.id,
            });
        },
        onError: (error) => {
            setCreateOrEditCaseError(error.message ?? 'Unknown error');
        },
    });

    const isAddingOrEditingCase =
        createCaseResult.loading || editCaseResult.loading;

    const createCase = (value: CreateCaseInput) => {
        createCaseGraphQL({
            variables: {
                value,
            },
            update: (cache, result) => {
                if (result.data) {
                    addCaseCache(result.data.createCase, cache);
                }
            },
        });
    };

    function handleFosterDate(date: Date) {
        setShowFosterCareDatePicker(false);
        const dayRaw = date.getDate().toString();
        const day = dayRaw.length === 1 ? `0${dayRaw}` : dayRaw;
        const monthRaw = (date.getMonth() + 1).toString();
        const month = monthRaw.length === 1 ? `0${monthRaw}` : monthRaw;
        const year = date.getFullYear();
        const utcRaw = `${year}-${month}-${day}`;
        const iso = new Date(utcRaw).toISOString();
        setFormData({
            ...formData,
            fosterCare: iso,
        });
        setRequiredTextFosterDateAdded(false);
    }

    function handleBirthDatePicker(date: Date) {
        setShowBirthdayDatePicker(false);
        const dayRaw = date.getDate();
        const dayString =
            dayRaw.toString().length === 1 ? `0${dayRaw}` : dayRaw;
        const monthRaw = date.getMonth() + 1;
        const monthString =
            monthRaw.toString().length === 1 ? `0${monthRaw}` : monthRaw;
        const year = date.getFullYear();
        setFormData({
            ...formData,
            birthMonth: monthRaw,
            birthYear: year,
            dayOfBirth: dayRaw,
            birthdayRaw: `${monthString}/${dayString}/${year}`,
        });
        setRequiredTextFosterDateAdded(false);
    }

    function showDatePicker() {
        setShowFosterCareDatePicker(true);
    }

    function showBirthDatePicker() {
        setShowBirthdayDatePicker(true);
    }

    function hideDatePicker() {
        setShowFosterCareDatePicker(false);
    }

    function hideBirthDatePicker() {
        setShowBirthdayDatePicker(false);
    }

    // update form data with image
    useEffect(() => {
        formData.picture = image;
        setFormData({ ...formData });
    }, [image]);

    const showChildStatusField =
        caseStatuses.find((status) => status.id === formData.caseStatusId)
            ?.representsClosure ?? false;

    function handleImage(media: ImageInfo) {
        const fileName = media && media.uri.split('/').pop();
        const fileType = media && mime.getType(media.uri);

        setImage(
            media && fileName && fileType
                ? new ReactNativeFile({
                      uri: media.uri,
                      type: fileType,
                      name: fileName,
                  })
                : undefined
        );
    }

    const saveNewCase = () => {
        schema
            .validate(formData, { abortEarly: false })
            .then(() => {
                if (caseEditId !== undefined) {
                    console.log(`Updating case ${caseEditId}`);
                    editCaseGraphQL({
                        variables: {
                            caseId: caseEditId,
                            value: convertToUpdateCaseInput(formData),
                        },
                    });
                } else {
                    console.log(`Creating case`);
                    createCase(formData);
                }
            })
            .catch((error) => {
                console.log(`Error on Save: ${JSON.stringify(error, null, 2)}`);
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
                    e.path == 'caseFileNumber' && setRequiredTextName(true);
                });
                error.inner.forEach((e: { path: string }) => {
                    e.path == 'fosterCare' &&
                        setRequiredTextFosterDateAdded(true);
                });
            });
    };

    return (
        <KeyboardAwareScrollView
            style={styles.containerStyle}
            extraScrollHeight={30}
        >
            {createOrEditCaseError && (
                <GenericModal
                    rightButtonText={'OK'}
                    title={
                        caseEditId !== undefined
                            ? 'Error editing case'
                            : 'Error adding case'
                    }
                    message={createOrEditCaseError}
                    onRightButton={() => setCreateOrEditCaseError(undefined)}
                />
            )}
            <View
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 10,
                    backgroundColor: 'white',
                }}
            >
                <View>
                    {image || formData.picture ? (
                        <Image
                            source={{
                                uri: image ? image.uri : formData.picture,
                            }}
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
                    <PickPhotoButton afterAccept={handleImage} />
                    <TakePhotoButton afterAccept={handleImage} />
                </View>
            </View>
            {/* Status Section */}
            <View>
                <View>
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
                            selectedValue={formData.caseStatusId}
                            style={{ height: 50, width: '100%' }}
                            onValueChange={(itemValue: number) => {
                                formData.caseStatusId = itemValue;
                                setFormData({ ...formData });
                                setRequiredTextCaseStatus(false);
                            }}
                        >
                            {caseStatuses.map((caseStatus) => (
                                <Picker.Item
                                    key={caseStatus.id}
                                    label={caseStatus.name}
                                    value={caseStatus.id}
                                />
                            ))}
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
                    {showChildStatusField ? (
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
                                    selectedValue={formData.childStatusId}
                                    style={{
                                        height: 50,
                                        width: '100%',
                                    }}
                                    onValueChange={(itemValue: number) => {
                                        formData.childStatusId = itemValue;
                                        setFormData({ ...formData });
                                    }}
                                >
                                    {childStatuses.map((childStatus) => (
                                        <Picker.Item
                                            key={childStatus.id}
                                            label={childStatus.name}
                                            value={childStatus.id}
                                        />
                                    ))}
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
                        <Text style={styles.sectionHeader}>Information</Text>
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
                            value={formData.firstName ?? undefined}
                            onChangeText={(text) => {
                                formData.firstName = text;
                                setFormData({ ...formData });
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
                            value={formData.middleName ?? undefined}
                            onChangeText={(text) => {
                                formData.middleName = text;
                                setFormData({ ...formData });
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
                            value={formData.lastName ?? undefined}
                            onChangeText={(text) => {
                                formData.lastName = text;
                                setFormData({ ...formData });
                                setRequiredTextName(false);
                            }}
                        />
                    </View>
                    <View style={styles.textPadding}>
                        <Text style={{ color: 'rgba(24,23,21,.5)' }}>
                            Case File Number *
                        </Text>
                    </View>
                    <View style={styles.nameInputContainer}>
                        <TextInput
                            style={
                                requiredTextName
                                    ? styles.textInputRequired
                                    : styles.textInput
                            }
                            placeholder={'Case File Number'}
                            value={formData.caseFileNumber ?? undefined}
                            onChangeText={(text) => {
                                formData.caseFileNumber = text;
                                setFormData({ ...formData });
                                setRequiredTextName(false);
                            }}
                        />
                    </View>
                    <View>
                        {requiredTextName ? (
                            <Text style={styles.requiredText}>
                                One of First, Middle, Last, or Case file number
                                required!
                            </Text>
                        ) : (
                            <View></View>
                        )}
                    </View>
                    <Text style={styles.textPadding}>Suffix</Text>
                    <View style={styles.suffixDropdownContainer}>
                        <Picker
                            selectedValue={formData.suffix}
                            style={{ height: 50, width: '100%' }}
                            onValueChange={(itemValue: string) => {
                                formData.suffix = itemValue;
                                setFormData({ ...formData });
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
                            value={formData.title ?? undefined}
                            onChangeText={(text) => {
                                formData.title = text;
                                setFormData({ ...formData });
                            }}
                        />
                    </View>
                    <Text style={styles.textPadding}>Date of Birth</Text>
                    <View style={styles.dateContainer}>
                        <TextInput
                            editable={false}
                            style={styles.textInput}
                            placeholder={'MM/DD/YYYY'}
                            value={formData.birthdayRaw ?? undefined}
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
                            isVisible={showBirthdayDatePicker}
                            onCancel={hideBirthDatePicker}
                            onConfirm={handleBirthDatePicker}
                        />
                    </View>
                    <Text style={styles.textPadding}>Gender Identity</Text>
                    <View style={styles.genderDropdownContainer}>
                        <Picker
                            selectedValue={formData.gender}
                            style={{ height: 50, width: '100%' }}
                            onValueChange={(itemValue: string) => {
                                formData.gender = itemValue;
                                setFormData({ ...formData });
                            }}
                        >
                            {genders.map((value, index) => (
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
                            placeholder={'Address'}
                            value={addressToStreetNumberAndRoute(formData)}
                            onChangeText={(text) => {
                                if (formData.addresses?.length) {
                                    // parse out the street number from the route
                                    const matches = text.match(
                                        /(\s*[\da-zA-Z-]+)\s+\+(.+)/
                                    );
                                    if (matches && matches.length === 3) {
                                        formData.addresses[0].streetNumber =
                                            matches[1];
                                        formData.addresses[0].route =
                                            matches[2];
                                        console.log(
                                            `matched street number and route`
                                        );
                                    } else {
                                        // street number not found, set whole string as route
                                        formData.addresses[0].streetNumber = '';
                                        formData.addresses[0].route = text;
                                    }
                                    setFormData({ ...formData });
                                }
                            }}
                        />
                    </View>
                    <View style={styles.addressContainer}>
                        <TextInput
                            style={styles.addressInput}
                            placeholder={'Address 2'}
                            value={
                                formData.addresses?.[0].routeTwo ?? undefined
                            }
                            onChangeText={(text) => {
                                if (formData.addresses?.length) {
                                    formData.addresses[0].routeTwo = text;
                                    setFormData({ ...formData });
                                }
                            }}
                        />
                    </View>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.addressInput}
                            placeholder={'City'}
                            value={formData.addresses?.[0].locality}
                            onChangeText={(text) => {
                                if (formData.addresses?.length) {
                                    formData.addresses[0].locality = text;
                                    setFormData({ ...formData });
                                }
                            }}
                        />
                    </View>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.addressInput}
                            placeholder={'State'}
                            value={formData.addresses?.[0].state ?? undefined}
                            onChangeText={(text) => {
                                if (formData.addresses?.length) {
                                    formData.addresses[0].state = text;
                                    setFormData({ ...formData });
                                }
                            }}
                        />
                    </View>
                    <View style={styles.formContainer}>
                        <TextInput
                            maxLength={12}
                            keyboardType="numeric"
                            style={styles.addressInput}
                            placeholder={'Postal Code'}
                            value={
                                formData.addresses?.[0].postalCode ?? undefined
                            }
                            onChangeText={(text) => {
                                if (formData.addresses?.length) {
                                    formData.addresses[0].postalCode = text;
                                    setFormData({ ...formData });
                                }
                            }}
                        />
                    </View>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.addressInput}
                            placeholder={'Country'}
                            value={formData.addresses?.[0].country ?? undefined}
                            onChangeText={(text) => {
                                if (formData.addresses?.length) {
                                    formData.addresses[0].country = text;
                                    setFormData({ ...formData });
                                }
                            }}
                        />
                    </View>
                    <Text style={styles.textPadding}>
                        Date added to case load *
                    </Text>
                    <View style={styles.dateContainer}>
                        <TextInput
                            editable={false}
                            style={
                                requiredTextFosterDateAdded
                                    ? styles.textInputRequired
                                    : styles.textInput
                            }
                            placeholder={'MM/DD/YYYY'}
                            value={fosterCareToDisplay(formData.fosterCare)}
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
                            isVisible={showFosterCareDatePicker}
                            onCancel={hideDatePicker}
                            onConfirm={handleFosterDate}
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
                        value={formData.notes ?? undefined}
                        onChangeText={(text) => {
                            formData.notes = text;
                            setFormData({ ...formData });
                        }}
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
                        <Text style={{ color: 'white' }}>
                            {caseEditId !== undefined
                                ? 'Edit Case'
                                : 'Add Case'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ height: 100 }}></View>
            <BusyModal
                message={
                    caseEditId !== undefined
                        ? 'Editing Case...'
                        : 'Adding Case...'
                }
                visible={isAddingOrEditingCase}
            />
            <BusyModal
                message={'Loading Data...'}
                visible={
                    meResult.loading ||
                    schemaResult.loading ||
                    getCaseResult.loading
                }
            />
        </KeyboardAwareScrollView>
    );
}

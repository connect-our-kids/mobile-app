import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
// eslint-disable-next-line
//@ts-ignore
import { Picker } from 'react-native-picker-dropdown';
import { CheckBox } from 'react-native-elements';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import * as yup from 'yup';
import styles from './styles';
import mime from 'mime';
import PickPhotoButton from '../components/family-connections/AddDocumentButtons/PickPhotoButton';
import TakePhotoButton from '../components/family-connections/AddDocumentButtons/TakePhotoButton';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { ReactNativeFile } from 'apollo-upload-client';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
    AddressInput,
    EmailInput,
    TelephoneInput,
    CreateRelationshipInput,
    AlternateNameInput,
    RelationshipTeamAttributeInput,
    UploadWrapper,
    IntWrapper,
    DateWrapper,
    StringWrapper,
    UpdateRelationshipInput,
} from '../generated/globalTypes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import {
    CREATE_RELATIONSHIP_MUTATION,
    EDIT_RELATIONSHIP_MUTATION,
    addRelationshipToCache,
} from '../store/actions/fragments/cases';
import {
    createRelationshipMutation,
    createRelationshipMutationVariables,
} from '../generated/createRelationshipMutation';
import { meQuery } from '../generated/meQuery';
import { ME_QUERY } from '../store/actions/fragments/me';
import {
    staticDataQuery,
    staticDataQueryVariables,
} from '../generated/staticDataQuery';
import { STATIC_DATA_QUERY } from '../store/actions/fragments/schema';
import { GenericModal } from '../components/modals/GenericModal';
import { BusyModal } from '../components/modals/BusyModal';
import { RELATIONSHIP_DETAIL_FULL_QUERY } from '../store/actions/fragments/relationship';
import {
    relationshipDetailFull,
    relationshipDetailFullVariables,
    relationshipDetailFull_relationship_teamAttributes,
} from '../generated/relationshipDetailFull';
import {
    editRelationshipMutation,
    editRelationshipMutationVariables,
} from '../generated/editRelationshipMutation';
import Loader from '../components/Loader';
import constants from '../helpers/constants';
import {
    getTeamAttributes,
    getTeamAttributesVariables,
    getTeamAttributes_teamAttributes,
} from '../generated/getTeamAttributes';
import { TEAM_ATTRIBUTES_QUERY } from '../store/actions/fragments/teamAttributes';

const schema = yup.object<CreateRelationshipInput>().shape(
    {
        firstName: yup
            .string()
            .nullable()
            .when(['middleName', 'lastName'], {
                is: (middleName, lastName) => !middleName && !lastName,
                then: yup.string().required().defined(),
                otherwise: yup.string().nullable(),
            }),
        middleName: yup
            .string()
            .nullable()
            .when(['firstName', 'lastName'], {
                is: (firstName, lastName) => !firstName && !lastName,
                then: yup.string().required().defined(),
                otherwise: yup.string().nullable(),
            }),
        lastName: yup
            .string()
            .nullable()
            .when(['firstName', 'middleName'], {
                is: (firstName, middleName) => !firstName && !middleName,
                then: yup.string().required().defined(),
                otherwise: yup.string().nullable(),
            }),
        suffix: yup.string().nullable(),
        title: yup.string().nullable(),
        notes: yup.string().nullable(),
        // picture: not part of form. Added later using 'image' state
        gender: yup.string().nullable(),
        dateOfDeath: yup.string().nullable(),
        isDeceased: yup.boolean().nullable(),
        birthMonth: yup.number().nullable(),
        birthYear: yup.number().nullable(),
        dayOfBirth: yup.number().nullable(),
        birthdayRaw: yup.string().nullable(),

        facebook: yup.string().nullable(),
        linkedin: yup.string().nullable(),
        twitter: yup.string().nullable(),
        jobTitle: yup.string().nullable(),
        employer: yup.string().nullable(),
        salaryRangeId: yup.number().nullable(),
        statusId: yup.number().nullable(),
        isSeen: yup.boolean().nullable(),
        isContacted: yup.boolean().nullable(),
        ppSearchImported: yup.boolean().nullable(),

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
        emails: yup
            .array<EmailInput>(
                yup
                    .object<EmailInput>({
                        isVerified: yup.boolean().defined(),
                        isHidden: yup.boolean().defined(),
                        emailAddress: yup.string().defined(),
                        label: yup.string().nullable(),
                    })
                    .defined()
            )
            .nullable(),
        telephones: yup
            .array<TelephoneInput>(
                yup
                    .object<TelephoneInput>({
                        isVerified: yup.boolean().defined(),
                        isHidden: yup.boolean().defined(),
                        phoneNumber: yup.string().defined(),
                        label: yup.string().nullable(),
                    })
                    .defined()
            )
            .nullable(),
        alternateNames: yup
            .array<AlternateNameInput>(
                yup
                    .object<AlternateNameInput>({
                        name: yup.string().defined(),
                        label: yup.string().defined(),
                        isVerified: yup.boolean().defined(),
                        isHidden: yup.boolean().defined(),
                    })
                    .defined()
            )
            .nullable(),
        teamAttributes: yup
            .array<RelationshipTeamAttributeInput>(
                yup
                    .object<RelationshipTeamAttributeInput>({
                        teamAttributeId: yup.number().defined(),
                        value: yup.mixed(),
                    })
                    .defined()
            )
            .nullable(),
    },
    [
        ['firstName', 'middleName'],
        ['firstName', 'lastName'],
        ['middleName', 'lastName'],
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

const convertToUpdateRelationshipInput = (
    input: CreateRelationshipInput
): UpdateRelationshipInput => {
    let sanitizedAddresses: AddressInput[] | undefined = undefined;
    if (input.addresses) {
        sanitizedAddresses = input.addresses.map((address) => {
            return { ...address, id: undefined, __typename: undefined };
        });
    }

    let sanitizedEmails: EmailInput[] | undefined = undefined;
    if (input.emails) {
        sanitizedEmails = input.emails.map((email) => {
            return {
                ...email,
                id: undefined,
                __typename: undefined,
                email: undefined,
            };
        });
    }

    let sanitizedTelephones: TelephoneInput[] | undefined = undefined;
    if (input.telephones) {
        sanitizedTelephones = input.telephones.map((telephone) => {
            return {
                ...telephone,
                id: undefined,
                __typename: undefined,
                telephone: undefined,
            };
        });
    }

    let sanitizedAlternateNames: AlternateNameInput[] | undefined = undefined;
    if (input.alternateNames) {
        sanitizedAlternateNames = input.alternateNames.map((alternateName) => {
            return { ...alternateName, id: undefined, __typename: undefined };
        });
    }

    let sanitizedTeamAttributes:
        | RelationshipTeamAttributeInput[]
        | undefined = undefined;
    if (input.teamAttributes) {
        sanitizedTeamAttributes = input.teamAttributes.map(
            (attr: RelationshipTeamAttributeInput) => {
                return {
                    ...attr,
                    teamAttributeId: attr.teamAttributeId,
                    value: attr.value,
                };
            }
        );
    }

    const output: UpdateRelationshipInput = {
        firstName: toStringWrapper(input.firstName),
        middleName: toStringWrapper(input.middleName),
        lastName: toStringWrapper(input.lastName),
        suffix: toStringWrapper(input.suffix),
        title: toStringWrapper(input.title),
        notes: toStringWrapper(input.notes),
        picture: toUploadWrapper(input.picture),
        gender: input.gender,
        dateOfDeath: toDateWrapper(input.dateOfDeath),
        isDeceased: input.isDeceased,
        birthMonth: toNumberWrapper(input.birthMonth),
        birthYear: toNumberWrapper(input.birthYear),
        dayOfBirth: toNumberWrapper(input.dayOfBirth),
        birthdayRaw: toStringWrapper(input.birthdayRaw),

        facebook: toStringWrapper(input.facebook),
        linkedin: toStringWrapper(input.linkedin),
        twitter: toStringWrapper(input.twitter),
        jobTitle: toStringWrapper(input.jobTitle),
        employer: toStringWrapper(input.employer),
        salaryRangeId: toNumberWrapper(input.salaryRangeId),
        statusId: toNumberWrapper(input.statusId),
        isSeen: input.isSeen,
        isContacted: input.isContacted,

        addresses: sanitizedAddresses,
        emails: sanitizedEmails,
        telephones: sanitizedTelephones,
        alternateNames: sanitizedAlternateNames,

        teamAttributes: sanitizedTeamAttributes,
    };

    console.log(
        `Sending the following update: ${JSON.stringify(output, null, 2)}`
    );

    return output;
};

const addressToStreetNumberAndRoute = (address: AddressInput): string => {
    if (address.streetNumber && address.route) {
        return `${address.streetNumber} ${address.route}`;
    } else if (address.streetNumber) {
        return address.streetNumber;
    } else if (address.route) {
        return address.route;
    }
    return '';
};

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

export function AddOrEditRelationshipScreen(props: {
    navigation: NavigationScreenProp<NavigationState>;
}) {
    const [requiredTextName, setRequiredTextName] = useState(false);
    const [formData, setFormData] = useState<CreateRelationshipInput>({
        addresses: [
            {
                isHidden: false,
                isVerified: false,
                locality: '',
                route: '',
                streetNumber: '',
            },
        ],
        telephones: [{ isHidden: false, isVerified: false, phoneNumber: '' }],
        emails: [{ isHidden: false, isVerified: false, emailAddress: '' }],
        alternateNames: [
            { isHidden: false, isVerified: false, name: '', label: '' },
        ],
        teamAttributes: [],
    });
    const [attributes, setAttributes] = useState<
        getTeamAttributes_teamAttributes[]
    >([]);
    const [attributeValues, setAttributeValues] = useState<
        RelationshipTeamAttributeInput[]
    >([]);
    const [showBirthdayDatePicker, setShowBirthdayDatePicker] = useState(false);
    const [showDateOfDeathPicker, setShowDateOfDeathPicker] = useState(false);
    const [
        showTeamAttributeDatePicker,
        setShowTeamAttributeDatePicker,
    ] = useState(false);
    const [currentAttrData, setCurrentAttrData] = useState({
        index: -1,
        teamAttributeId: -1,
    });
    const [image, setImage] = useState<ReactNativeFile | undefined>(undefined);
    const [isBusyModalOpen, setIsBusyModalOpen] = useState(false);
    const [loadingDataError, setLoadingDataError] = useState<
        string | undefined
    >(undefined);
    const [
        createOrEditRelationshipError,
        setCreateOrEditRelationshipError,
    ] = useState<string | undefined>(undefined);

    const meResult = useQuery<meQuery>(ME_QUERY, {
        errorPolicy: 'all',
        onError: (error) => {
            setLoadingDataError(error.message ?? 'Unknown error');
        },
    });

    // this is required
    const caseId = props.navigation.getParam('caseId', undefined) as number;

    // this is required
    const teamId = props.navigation.getParam('teamId', undefined) as number;

    const schemaResult = useQuery<staticDataQuery, staticDataQueryVariables>(
        STATIC_DATA_QUERY,
        {
            errorPolicy: 'all',
            variables: {
                teamId,
            },
            onError: (error) => {
                setLoadingDataError(error.message ?? 'Unknown error');
            },
        }
    );

    const [getRelationship, getRelationshipResult] = useLazyQuery<
        relationshipDetailFull,
        relationshipDetailFullVariables
    >(RELATIONSHIP_DETAIL_FULL_QUERY, {
        errorPolicy: 'all',
        onError: (error) => {
            setLoadingDataError(error.message ?? 'Unknown error');
        },
        onCompleted: (data) => {
            if (!data || !data.relationship) {
                setLoadingDataError('Failed to get person data');
            }
        },
    });

    const teamAttributesResult = useQuery<
        getTeamAttributes,
        getTeamAttributesVariables
    >(TEAM_ATTRIBUTES_QUERY, {
        variables: {
            teamId,
        },
        errorPolicy: 'all',
        onError: (error) => {
            setLoadingDataError(error.message ?? 'Unknown error');
        },
    });

    // remove empty string from list of genders if present
    // in the future this should be done on the backend
    const genders = (schemaResult.data?.schema?.gender ?? []).filter(
        (value) => value
    );

    const salaries = (schemaResult.data?.schema?.salaryRange ?? []).filter(
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

    const relationshipStatuses = (
        schemaResult.data?.schema?.relationshipStatus ?? []
    ).sort(sortBySortOrder);

    // this is optional depending on whether you are creating a new relationship
    // or editing an existing relationship
    const relationshipId = props.navigation.getParam(
        'relationshipId',
        undefined
    ) as number | undefined;

    // load relationship if editing a relationship
    // once on startup
    useEffect(() => {
        if (relationshipId) {
            console.log(`Loading relationship ${relationshipId}`);
            getRelationship({
                variables: {
                    caseId,
                    relationshipId: relationshipId,
                },
            });
        }
    }, []);

    // load relationship data into form when we are editing a relationship
    useEffect(() => {
        if (
            getRelationshipResult.called &&
            getRelationshipResult.data &&
            getRelationshipResult.data.relationship &&
            !getRelationshipResult.loading &&
            !getRelationshipResult.error
        ) {
            const formDataFromRelationship: CreateRelationshipInput = {
                ...getRelationshipResult.data.relationship,
                ...getRelationshipResult.data.relationship?.person,
                statusId: getRelationshipResult.data.relationship?.status?.id,
                salaryRangeId:
                    getRelationshipResult.data.relationship?.salaryRange?.id,
                emails: (
                    getRelationshipResult.data.relationship?.person.emails ?? []
                ).map((email) => {
                    return { ...email, emailAddress: email.email };
                }),
                telephones: (
                    getRelationshipResult.data.relationship?.person
                        .telephones ?? []
                ).map((telephone) => {
                    return { ...telephone, phoneNumber: telephone.telephone };
                }),
                teamAttributes: (
                    getRelationshipResult.data.relationship?.teamAttributes ??
                    []
                ).map((attr) => {
                    return {
                        ...attr,
                        teamAttributeId: attr.id,
                        value: attr.value,
                    };
                }),
            };
            // ensure there is at least one address set
            if (
                !formDataFromRelationship.addresses ||
                formDataFromRelationship.addresses.length === 0
            ) {
                formDataFromRelationship.addresses = [
                    {
                        isHidden: false,
                        isVerified: false,
                        locality: '',
                        route: '',
                        streetNumber: '',
                    },
                ];
            }

            // ensure there is at least one telephone set
            if (
                !formDataFromRelationship.telephones ||
                formDataFromRelationship.telephones.length === 0
            ) {
                formDataFromRelationship.telephones = [
                    {
                        isHidden: false,
                        isVerified: false,
                        phoneNumber: '',
                    },
                ];
            }

            // ensure there is at least one email set
            if (
                !formDataFromRelationship.emails ||
                formDataFromRelationship.emails.length === 0
            ) {
                formDataFromRelationship.emails = [
                    {
                        isHidden: false,
                        isVerified: false,
                        emailAddress: '',
                    },
                ];
            }

            // ensure there is at least one alternate name set
            if (
                !formDataFromRelationship.alternateNames ||
                formDataFromRelationship.alternateNames.length === 0
            ) {
                formDataFromRelationship.alternateNames = [
                    {
                        isHidden: false,
                        isVerified: false,
                        label: '',
                        name: '',
                    },
                ];
            }

            if (
                !formDataFromRelationship.teamAttributes ||
                formDataFromRelationship.teamAttributes.length === 0
            ) {
                formDataFromRelationship.teamAttributes = [];
            }

            setFormData(formDataFromRelationship);
        }
    }, [
        getRelationshipResult.called,
        getRelationshipResult.loading,
        getRelationshipResult.data,
        getRelationshipResult.error,
    ]);

    const [createRelationshipGraphQL, createRelationshipResult] = useMutation<
        createRelationshipMutation,
        createRelationshipMutationVariables
    >(CREATE_RELATIONSHIP_MUTATION, {
        errorPolicy: 'all',
        onCompleted: (data) => {
            props.navigation.goBack();
            props.navigation.navigate('RelationshipScreen', {
                relationshipId: data.createRelationship.id,
            });
        },
        onError: (error) => {
            setCreateOrEditRelationshipError(error.message ?? 'Unknown error');
        },
    });

    const [editRelationshipGraphQL, editRelationshipResult] = useMutation<
        editRelationshipMutation,
        editRelationshipMutationVariables
    >(EDIT_RELATIONSHIP_MUTATION, {
        errorPolicy: 'all',
        onCompleted: (data) => {
            props.navigation.goBack();
            props.navigation.navigate('RelationshipScreen', {
                relationshipId: data.updateRelationship.id,
            });
        },
        onError: (error) => {
            setCreateOrEditRelationshipError(error.message ?? 'Unknown error');
        },
    });

    const isAddingOrEditingRelationship =
        createRelationshipResult.loading || editRelationshipResult.loading;

    const createRelationship = (
        caseId: number,
        value: CreateRelationshipInput
    ) => {
        createRelationshipGraphQL({
            variables: {
                caseId,
                value,
            },
            update: (cache, result) => {
                if (result.data) {
                    addRelationshipToCache(
                        caseId,
                        result.data.createRelationship,
                        cache
                    );
                }
            },
        });
    };

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
    }

    function handleDateOfDeathPicker(date: Date) {
        setShowDateOfDeathPicker(false);
        const dayRaw = date.getDate().toString();
        const day = dayRaw.length === 1 ? `0${dayRaw}` : dayRaw;
        const monthRaw = (date.getMonth() + 1).toString();
        const month = monthRaw.length === 1 ? `0${monthRaw}` : monthRaw;
        const year = date.getFullYear();
        const utcRaw = `${year}-${month}-${day}`;
        const iso = new Date(utcRaw).toISOString();
        setFormData({
            ...formData,
            dateOfDeath: iso,
        });
    }

    const handleTeamAttributeDatePicker = (date: Date) => {
        setShowTeamAttributeDatePicker(false);
        const dayRaw = date.getDate().toString();
        const day = dayRaw.length === 1 ? `0${dayRaw}` : dayRaw;
        const monthRaw = (date.getMonth() + 1).toString();
        const month = monthRaw.length === 1 ? `0${monthRaw}` : monthRaw;
        const year = date.getFullYear();
        const utcRaw = `${month}/${day}/${year}`;

        attributeValues[currentAttrData.index].value = utcRaw;
        attributeValues[currentAttrData.index].teamAttributeId =
            currentAttrData.teamAttributeId;
        setAttributeValues([...attributeValues]);
        if (formData.teamAttributes) {
            formData.teamAttributes = attributeValues;
            setFormData({
                ...formData,
            });
        }
    };

    function showBirthDatePicker() {
        setShowBirthdayDatePicker(true);
    }

    function hideBirthDatePicker() {
        setShowBirthdayDatePicker(false);
    }

    // update form data with image
    useEffect(() => {
        formData.picture = image;
        setFormData({ ...formData });
    }, [image]);

    const getAttributeValueByType = (
        attribute: relationshipDetailFull_relationship_teamAttributes,
        type: string
    ): string | boolean | null => {
        switch (type) {
            case 'boolean':
                return attribute.value === 'true';
            default:
                return attribute.value;
        }
    };

    const getAttributeDefaultValueByType = (
        attribute: getTeamAttributes_teamAttributes
    ): string | boolean | null => {
        switch (attribute.type) {
            case 'boolean':
                return attribute.defaultValue === 'true';
            case 'selectList':
                return attribute.defaultValue.length
                    ? attribute.defaultValue
                    : null;
            default:
                return attribute.defaultValue;
        }
    };

    const getAttributeSavedValue = (
        attribute: getTeamAttributes_teamAttributes
    ): string | boolean | null => {
        const relationshipAttribute = getRelationshipResult?.data?.relationship?.teamAttributes?.find(
            (a) => a.teamAttributeId === attribute.id
        );
        return relationshipAttribute
            ? getAttributeValueByType(relationshipAttribute, attribute.type)
            : getAttributeDefaultValueByType(attribute);
    };

    const getAttributeRemainingCharacters = (
        index: number,
        attribute: getTeamAttributes_teamAttributes
    ): number | void => {
        if (attribute.type === 'longText')
            return 10000 - attributeValues[index].value.length > 0
                ? 10000 - attributeValues[index].value.length
                : 0;
        if (attribute.type === 'shortText')
            return 255 - attributeValues[index].value.length > 0
                ? 255 - attributeValues[index].value.length
                : 0;

        return;
    };

    const isChecked = (value: string): boolean => {
        if (value === 'true') {
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        if (teamAttributesResult?.data?.teamAttributes !== null) {
            const attrsTemp: getTeamAttributes_teamAttributes[] =
                teamAttributesResult.data?.teamAttributes || [];
            attrsTemp?.sort((a, b) => a.order - b.order);

            setAttributes(attrsTemp);
            const valsTemp = attrsTemp
                .filter((attr) => attr.disabled === false)
                .map((attr) => {
                    return {
                        teamAttributeId: attr.id,
                        value:
                            getAttributeSavedValue(attr) !== null
                                ? getAttributeSavedValue(attr)?.toString()
                                : '',
                    } as RelationshipTeamAttributeInput;
                });
            setAttributeValues(valsTemp);
        }
    }, [teamAttributesResult.data, getRelationshipResult.data]);

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

    const sanitizeFormData = () => {
        // remove empty addresses/emails/telephones/alternateNames
        formData.addresses = formData.addresses?.filter(
            (address) =>
                address.country ||
                address.countryCode ||
                address.formatted ||
                address.latitude ||
                address.locality ||
                address.longitude ||
                address.postalCode ||
                address.raw ||
                address.route ||
                address.routeTwo ||
                address.state ||
                address.stateCode ||
                address.streetNumber
        );
        formData.emails = formData.emails?.filter(
            (email) => email.emailAddress
        );
        formData.telephones = formData.telephones?.filter(
            (telephone) => telephone.phoneNumber
        );
        formData.alternateNames = formData.alternateNames?.filter(
            (alternateName) => alternateName.name
        );

        // trim strings
        formData.firstName = formData.firstName?.trim();
        formData.middleName = formData.middleName?.trim();
        formData.lastName = formData.lastName?.trim();
        formData.suffix = formData.suffix?.trim();
        formData.title = formData.title?.trim();
        formData.notes = formData.notes?.trim();
        formData.gender = formData.gender?.trim();
        formData.dateOfDeath = formData.dateOfDeath?.trim();
        formData.birthdayRaw = formData.birthdayRaw?.trim();
        formData.facebook = formData.facebook?.trim();
        formData.linkedin = formData.linkedin?.trim();
        formData.twitter = formData.twitter?.trim();
        formData.jobTitle = formData.jobTitle?.trim();
        formData.employer = formData.employer?.trim();

        formData.addresses = formData.addresses?.map((address) => {
            return {
                ...address,
                country: address.country?.trim(),
                locality: address.locality.trim(),
                postalCode: address.postalCode?.trim(),
                route: address.route.trim(),
                routeTwo: address.routeTwo?.trim(),
                state: address.state?.trim(),
                streetNumber: address.streetNumber.trim(),
                label: address.label?.trim(),
            };
        });
        formData.addresses = formData.addresses?.map((address) => {
            return {
                ...address,
                raw: `${address.route}, ${address.routeTwo}, ${address.locality}, ${address.state} ${address.postalCode}, ${address.country}`,
            };
        });
        // set raw address
        formData.emails = formData.emails?.map((email) => {
            return {
                ...email,
                emailAddress: email.emailAddress.trim(),
                label: email.label?.trim(),
            };
        });
        formData.telephones = formData.telephones?.map((telephone) => {
            return {
                ...telephone,
                phoneNumber: telephone.phoneNumber.trim(),
                label: telephone.label?.trim(),
            };
        });
    };

    const saveNewPerson = () => {
        schema
            .validate(formData, { abortEarly: false })
            .then(() => {
                sanitizeFormData();
                if (relationshipId !== undefined) {
                    console.log(`Updating person ${relationshipId}`);
                    editRelationshipGraphQL({
                        variables: {
                            caseId,
                            relationshipId: relationshipId,
                            value: convertToUpdateRelationshipInput(formData),
                        },
                    });
                } else {
                    console.log(`Creating person`);
                    createRelationship(caseId, formData);
                }
            })
            .catch((error) => {
                console.log(`Error on Save: ${JSON.stringify(error, null, 2)}`);
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

    if (
        meResult.loading ||
        schemaResult.loading ||
        getRelationshipResult.loading
    ) {
        return (
            <View
                style={{
                    backgroundColor: constants.backgroundColor,
                    flex: 1,
                    flexDirection: 'column',
                }}
            >
                <Loader />
            </View>
        );
    }

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.containerStyle}
            extraScrollHeight={30}
        >
            <View
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 20,
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
            {/* Information Section */}
            <View>
                <View style={styles.sectionPadding}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerText}>Information</Text>
                    </View>
                    <CheckBox
                        title={'Contacted'}
                        textStyle={styles.checkboxLabel}
                        checked={formData.isContacted ?? false}
                        size={24}
                        checkedColor={'#0279AC'}
                        uncheckedColor={'lightgray'}
                        containerStyle={styles.checkboxContainer}
                        onPress={() => {
                            formData.isContacted = !formData.isContacted;
                            setFormData({
                                ...formData,
                            });
                        }}
                    />
                    <View>
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
                    <View>
                        <CheckBox
                            title="Add Alternate Name"
                            textStyle={{ fontWeight: 'normal' }}
                            containerStyle={styles.addCheckboxContainer}
                            iconType="material"
                            checkedIcon="add"
                            checkedColor="#0279AC"
                            checked={true}
                            onPress={() => {
                                formData.alternateNames?.push({
                                    isHidden: false,
                                    isVerified: false,
                                    name: '',
                                    label: '',
                                });
                                setFormData({ ...formData });
                            }}
                        />
                        {formData.alternateNames?.map(
                            (alternateName, index) => (
                                <View key={index}>
                                    <Text style={styles.textPadding}>
                                        {`Alternate Name ${index + 1}`}
                                    </Text>
                                    <View style={styles.formContainer}>
                                        <TextInput
                                            style={styles.telephoneInput}
                                            placeholder={'Alternate Name'}
                                            value={alternateName.name}
                                            onChangeText={(text) => {
                                                if (formData.alternateNames) {
                                                    formData.alternateNames[
                                                        index
                                                    ].name = text;
                                                    setFormData({
                                                        ...formData,
                                                    });
                                                }
                                            }}
                                        />
                                    </View>
                                    <View style={styles.formContainer}>
                                        <TextInput
                                            style={styles.telephoneInput}
                                            placeholder={'Alternate Name Label'}
                                            value={alternateName.label}
                                            onChangeText={(text) => {
                                                if (formData.alternateNames) {
                                                    formData.alternateNames[
                                                        index
                                                    ].label = text;
                                                    setFormData({
                                                        ...formData,
                                                    });
                                                }
                                            }}
                                        />
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <CheckBox
                                            title={'Verified'}
                                            textStyle={styles.checkboxLabel}
                                            checked={alternateName.isVerified}
                                            size={24}
                                            checkedColor={'#0279AC'}
                                            uncheckedColor={'lightgray'}
                                            containerStyle={
                                                styles.checkboxContainer
                                            }
                                            onPress={() => {
                                                if (formData.alternateNames) {
                                                    formData.alternateNames[
                                                        index
                                                    ].isVerified = !formData
                                                        .alternateNames[index]
                                                        .isVerified;
                                                    setFormData({
                                                        ...formData,
                                                    });
                                                }
                                            }}
                                        />

                                        <CheckBox
                                            title={'Hidden'}
                                            textStyle={styles.checkboxLabel}
                                            checked={alternateName.isHidden}
                                            size={24}
                                            checkedColor={'#0279AC'}
                                            uncheckedColor={'lightgray'}
                                            containerStyle={
                                                styles.checkboxContainer
                                            }
                                            onPress={() => {
                                                if (formData.alternateNames) {
                                                    formData.alternateNames[
                                                        index
                                                    ].isHidden = !formData
                                                        .alternateNames[index]
                                                        .isHidden;
                                                    setFormData({
                                                        ...formData,
                                                    });
                                                }
                                            }}
                                        />
                                    </View>
                                </View>
                            )
                        )}
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
                        <TouchableOpacity
                            style={{ width: '100%' }}
                            onPress={showBirthDatePicker}
                        >
                            <View style={styles.dateInput}>
                                <TextInput
                                    editable={false}
                                    placeholder={'MM/DD/YYYY'}
                                    value={formData.birthdayRaw ?? undefined}
                                />
                                <FontAwesome5
                                    name="calendar-alt"
                                    size={24}
                                    color="#0279AC"
                                />
                            </View>
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
                    <CheckBox
                        title={'Deceased'}
                        textStyle={styles.checkboxLabel}
                        checked={formData.isDeceased ?? false}
                        size={24}
                        checkedColor={'#0279AC'}
                        uncheckedColor={'lightgray'}
                        containerStyle={{
                            backgroundColor: 'white',
                            borderWidth: 0,
                            marginLeft: 0,
                            paddingLeft: 0,
                        }}
                        onPress={() => {
                            formData.isDeceased = !formData.isDeceased;
                            setFormData({ ...formData });
                        }}
                    />
                    {formData.isDeceased && (
                        <>
                            <Text style={styles.textPadding}>
                                Date of Death
                            </Text>
                            <View style={styles.dateContainer}>
                                <TouchableOpacity
                                    style={{ width: '100%' }}
                                    onPress={() =>
                                        setShowDateOfDeathPicker(true)
                                    }
                                >
                                    <View style={styles.dateInput}>
                                        <TextInput
                                            editable={false}
                                            placeholder={'MM/DD/YYYY'}
                                            value={dateOfDeathToDisplay(
                                                formData.dateOfDeath
                                            )}
                                        />
                                        <FontAwesome5
                                            name="calendar-alt"
                                            size={24}
                                            color="#0279AC"
                                        />
                                    </View>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={showDateOfDeathPicker}
                                    onCancel={() =>
                                        setShowDateOfDeathPicker(false)
                                    }
                                    onConfirm={handleDateOfDeathPicker}
                                />
                            </View>
                        </>
                    )}

                    <Text style={styles.textPadding}>Status</Text>
                    <View style={styles.genderDropdownContainer}>
                        <Picker
                            selectedValue={formData.statusId}
                            style={{ height: 50, width: '100%' }}
                            onValueChange={(itemValue: number) => {
                                formData.statusId = itemValue;
                                setFormData({ ...formData });
                            }}
                        >
                            {relationshipStatuses.map((value) => (
                                <Picker.Item
                                    key={value.id}
                                    label={value.name}
                                    value={value.id}
                                />
                            ))}
                        </Picker>
                    </View>
                    <Text style={styles.textPadding}>Job Title</Text>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'Job Title'}
                            value={formData.jobTitle ?? undefined}
                            onChangeText={(text) => {
                                formData.jobTitle = text;
                                setFormData({ ...formData });
                            }}
                        />
                    </View>
                    <Text style={styles.textPadding}>Employer</Text>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'Employer'}
                            value={formData.employer ?? undefined}
                            onChangeText={(text) => {
                                formData.employer = text;
                                setFormData({ ...formData });
                            }}
                        />
                    </View>
                    <Text style={styles.textPadding}>Salary Range</Text>
                    <View style={styles.salaryDropdownContainer}>
                        <Picker
                            selectedValue={formData.salaryRangeId}
                            style={{ height: 50, width: '100%' }}
                            onValueChange={(itemValue: number) => {
                                formData.salaryRangeId = itemValue;
                                setFormData({ ...formData });
                            }}
                        >
                            {salaries.map((value) => (
                                <Picker.Item
                                    key={value.id}
                                    label={value.label}
                                    value={value.id}
                                />
                            ))}
                        </Picker>
                    </View>

                    {/* Customized Fields Section*/}
                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.headerText}>
                                Customized Fields
                            </Text>
                        </View>
                        {attributes &&
                            attributes
                                ?.filter((attr) => attr.disabled === false)
                                .map((attr, index) => {
                                    switch (attr.type) {
                                        case 'shortText':
                                            return (
                                                <View key={index}>
                                                    <Text
                                                        style={
                                                            styles.textPadding
                                                        }
                                                    >
                                                        {attr.name}
                                                    </Text>
                                                    <View
                                                        style={
                                                            styles.formContainer
                                                        }
                                                    >
                                                        <TextInput
                                                            style={
                                                                styles.textInput
                                                            }
                                                            placeholder={
                                                                attr.name
                                                            }
                                                            value={
                                                                attributeValues[
                                                                    index
                                                                ].value
                                                            }
                                                            onChangeText={(
                                                                text
                                                            ) => {
                                                                attributeValues[
                                                                    index
                                                                ].value = text;
                                                                attributeValues[
                                                                    index
                                                                ].teamAttributeId =
                                                                    attr.id;
                                                                setAttributeValues(
                                                                    [
                                                                        ...attributeValues,
                                                                    ]
                                                                );
                                                                if (
                                                                    formData.teamAttributes
                                                                ) {
                                                                    formData.teamAttributes = attributeValues;
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                        }
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        {
                                                            <Text
                                                                style={
                                                                    styles.charactersRemainingText
                                                                }
                                                            >
                                                                {getAttributeRemainingCharacters(
                                                                    index,
                                                                    attr
                                                                )}{' '}
                                                                characters
                                                                remaining
                                                            </Text>
                                                        }
                                                    </View>
                                                </View>
                                            );

                                        case 'longText':
                                            return (
                                                <View key={index}>
                                                    <Text
                                                        style={
                                                            styles.textPadding
                                                        }
                                                    >
                                                        {attr.name}
                                                    </Text>
                                                    <View
                                                        style={
                                                            styles.formContainer
                                                        }
                                                    >
                                                        <TextInput
                                                            multiline
                                                            numberOfLines={3}
                                                            style={
                                                                styles.longTextInput
                                                            }
                                                            placeholder={
                                                                attr.name
                                                            }
                                                            value={
                                                                attributeValues[
                                                                    index
                                                                ].value
                                                            }
                                                            onChangeText={(
                                                                text
                                                            ) => {
                                                                attributeValues[
                                                                    index
                                                                ].value = text;
                                                                attributeValues[
                                                                    index
                                                                ].teamAttributeId =
                                                                    attr.id;
                                                                setAttributeValues(
                                                                    [
                                                                        ...attributeValues,
                                                                    ]
                                                                );
                                                                if (
                                                                    formData.teamAttributes
                                                                ) {
                                                                    formData.teamAttributes = attributeValues;
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                        }
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        {
                                                            <Text
                                                                style={
                                                                    styles.charactersRemainingText
                                                                }
                                                            >
                                                                {getAttributeRemainingCharacters(
                                                                    index,
                                                                    attr
                                                                )}{' '}
                                                                characters
                                                                remaining
                                                            </Text>
                                                        }
                                                    </View>
                                                </View>
                                            );

                                        case 'boolean':
                                            return (
                                                <View key={index}>
                                                    <CheckBox
                                                        title={attr.name}
                                                        textStyle={
                                                            styles.checkboxLabel
                                                        }
                                                        checked={isChecked(
                                                            attributeValues[
                                                                index
                                                            ].value
                                                        )}
                                                        size={24}
                                                        checkedColor={'#0279AC'}
                                                        uncheckedColor={
                                                            'lightgray'
                                                        }
                                                        containerStyle={{
                                                            backgroundColor:
                                                                'white',
                                                            borderWidth: 0,
                                                            marginLeft: 0,
                                                            paddingLeft: 0,
                                                        }}
                                                        onPress={() => {
                                                            attributeValues[
                                                                index
                                                            ].value =
                                                                attributeValues[
                                                                    index
                                                                ].value ==
                                                                'false'
                                                                    ? 'true'
                                                                    : 'false';
                                                            attributeValues[
                                                                index
                                                            ].teamAttributeId =
                                                                attr.id;
                                                            setAttributeValues([
                                                                ...attributeValues,
                                                            ]);
                                                            formData.teamAttributes = attributeValues;
                                                            setFormData({
                                                                ...formData,
                                                            });
                                                        }}
                                                    />
                                                </View>
                                            );

                                        case 'selectList':
                                            return (
                                                <View key={index}>
                                                    <Text
                                                        style={
                                                            styles.textPadding
                                                        }
                                                    >
                                                        {attr.name}
                                                    </Text>
                                                    <View
                                                        style={
                                                            styles.genderDropdownContainer
                                                        }
                                                    >
                                                        <Picker
                                                            selectedValue={
                                                                attributeValues[
                                                                    index
                                                                ].value
                                                            }
                                                            style={{
                                                                height: 50,
                                                                width: '100%',
                                                            }}
                                                            onValueChange={(
                                                                itemValue: string
                                                            ) => {
                                                                attributeValues[
                                                                    index
                                                                ].value = itemValue;
                                                                attributeValues[
                                                                    index
                                                                ].teamAttributeId =
                                                                    attr.id;
                                                                setAttributeValues(
                                                                    [
                                                                        ...attributeValues,
                                                                    ]
                                                                );
                                                                if (
                                                                    formData.teamAttributes
                                                                ) {
                                                                    formData.teamAttributes = attributeValues;
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                        }
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            {attr.options?.map(
                                                                (
                                                                    value,
                                                                    index
                                                                ) => (
                                                                    <Picker.Item
                                                                        key={
                                                                            index
                                                                        }
                                                                        label={
                                                                            value
                                                                        }
                                                                        value={
                                                                            value
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                        </Picker>
                                                    </View>
                                                </View>
                                            );

                                        case 'date':
                                            return (
                                                <View key={index}>
                                                    <Text
                                                        style={
                                                            styles.textPadding
                                                        }
                                                    >
                                                        {attr.name}
                                                    </Text>
                                                    <TouchableOpacity
                                                        style={{
                                                            width: '100%',
                                                            paddingTop: 10,
                                                        }}
                                                        onPress={() => {
                                                            setShowTeamAttributeDatePicker(
                                                                true
                                                            );
                                                            setCurrentAttrData({
                                                                index: index,
                                                                teamAttributeId:
                                                                    attr.id,
                                                            });
                                                        }}
                                                    >
                                                        <View
                                                            style={
                                                                styles.dateInput
                                                            }
                                                        >
                                                            <TextInput
                                                                placeholder={
                                                                    'MM/DD/YYYY'
                                                                }
                                                                value={
                                                                    attributeValues[
                                                                        index
                                                                    ].value
                                                                }
                                                            />
                                                            <FontAwesome5
                                                                name="calendar-alt"
                                                                size={24}
                                                                color="#0279AC"
                                                            />
                                                        </View>
                                                    </TouchableOpacity>
                                                    <DateTimePickerModal
                                                        isVisible={
                                                            showTeamAttributeDatePicker
                                                        }
                                                        onCancel={() =>
                                                            setShowTeamAttributeDatePicker(
                                                                false
                                                            )
                                                        }
                                                        onConfirm={
                                                            handleTeamAttributeDatePicker
                                                        }
                                                    />
                                                </View>
                                            );
                                    }
                                })}
                    </View>

                    <View style={styles.sectionPadding}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.headerText}>
                                Contact Details
                            </Text>
                        </View>
                        <CheckBox
                            title="Add Residence"
                            textStyle={{ fontWeight: 'normal' }}
                            containerStyle={styles.addCheckboxContainer}
                            iconType="material"
                            checkedIcon="add"
                            checkedColor="#0279AC"
                            checked={true}
                            onPress={() => {
                                formData.addresses?.push({
                                    isHidden: false,
                                    isVerified: false,
                                    locality: '',
                                    route: '',
                                    streetNumber: '',
                                });
                                setFormData({ ...formData });
                            }}
                        />
                        {formData.addresses?.map((address, index) => (
                            <View key={index}>
                                <Text style={styles.textPadding}>{`Residence ${
                                    index + 1
                                }`}</Text>
                                <View style={styles.addressContainer}>
                                    <TextInput
                                        style={styles.addressInput}
                                        placeholder={'Label'}
                                        value={address.label ?? undefined}
                                        onChangeText={(text) => {
                                            if (formData.addresses) {
                                                formData.addresses[
                                                    index
                                                ].label = text;
                                                setFormData({ ...formData });
                                            }
                                        }}
                                    />
                                </View>
                                <View style={styles.addressContainer}>
                                    <TextInput
                                        style={styles.addressInput}
                                        placeholder={'Address'}
                                        value={addressToStreetNumberAndRoute(
                                            address
                                        )}
                                        onChangeText={(text) => {
                                            if (formData.addresses) {
                                                // parse out the street number from the route
                                                const matches = text.match(
                                                    /(\s*[\da-zA-Z-]+)\s+\+(.+)/
                                                );
                                                if (
                                                    matches &&
                                                    matches.length === 3
                                                ) {
                                                    formData.addresses[
                                                        index
                                                    ].streetNumber = matches[1];
                                                    formData.addresses[
                                                        index
                                                    ].route = matches[2];
                                                } else {
                                                    // street number not found, set whole string as route
                                                    formData.addresses[
                                                        index
                                                    ].streetNumber = '';
                                                    formData.addresses[
                                                        index
                                                    ].route = text;
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
                                        value={address.routeTwo ?? undefined}
                                        onChangeText={(text) => {
                                            if (formData.addresses) {
                                                formData.addresses[
                                                    index
                                                ].routeTwo = text;
                                                setFormData({ ...formData });
                                            }
                                        }}
                                    />
                                </View>
                                <View style={styles.formContainer}>
                                    <TextInput
                                        style={styles.addressInput}
                                        placeholder={'City'}
                                        value={address.locality}
                                        onChangeText={(text) => {
                                            if (formData.addresses) {
                                                formData.addresses[
                                                    index
                                                ].locality = text;
                                                setFormData({ ...formData });
                                            }
                                        }}
                                    />
                                </View>
                                <View style={styles.formContainer}>
                                    <TextInput
                                        style={styles.addressInput}
                                        placeholder={'State'}
                                        value={address.state ?? undefined}
                                        onChangeText={(text) => {
                                            if (formData.addresses) {
                                                formData.addresses[
                                                    index
                                                ].state = text;
                                                setFormData({ ...formData });
                                            }
                                        }}
                                    />
                                </View>
                                <View style={styles.formContainer}>
                                    <TextInput
                                        maxLength={10}
                                        keyboardType="numeric"
                                        style={styles.addressInput}
                                        placeholder={'Postal Code'}
                                        value={address.postalCode ?? undefined}
                                        onChangeText={(text) => {
                                            if (formData.addresses) {
                                                formData.addresses[
                                                    index
                                                ].postalCode = text;
                                                setFormData({ ...formData });
                                            }
                                        }}
                                    />
                                </View>
                                <View style={styles.formContainer}>
                                    <TextInput
                                        style={styles.addressInput}
                                        placeholder={'Country'}
                                        value={address.country ?? undefined}
                                        onChangeText={(text) => {
                                            if (formData.addresses) {
                                                formData.addresses[
                                                    index
                                                ].country = text;
                                                setFormData({ ...formData });
                                            }
                                        }}
                                    />
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <CheckBox
                                        title={'Verified'}
                                        textStyle={styles.checkboxLabel}
                                        checked={address.isVerified}
                                        size={24}
                                        checkedColor={'#0279AC'}
                                        uncheckedColor={'lightgray'}
                                        containerStyle={
                                            styles.checkboxContainer
                                        }
                                        onPress={() => {
                                            if (formData.addresses) {
                                                formData.addresses[
                                                    index
                                                ].isVerified = !formData
                                                    .addresses[index]
                                                    .isVerified;
                                                setFormData({ ...formData });
                                            }
                                        }}
                                    />

                                    <CheckBox
                                        title={'Hidden'}
                                        textStyle={styles.checkboxLabel}
                                        checked={address.isHidden}
                                        size={24}
                                        checkedColor={'#0279AC'}
                                        uncheckedColor={'lightgray'}
                                        containerStyle={
                                            styles.checkboxContainer
                                        }
                                        onPress={() => {
                                            if (formData.addresses) {
                                                formData.addresses[
                                                    index
                                                ].isHidden = !formData
                                                    .addresses[index].isHidden;
                                                setFormData({ ...formData });
                                            }
                                        }}
                                    />
                                </View>
                            </View>
                        ))}
                        <View>
                            <CheckBox
                                title="Add Telephone"
                                textStyle={{ fontWeight: 'normal' }}
                                containerStyle={styles.addCheckboxContainer}
                                iconType="material"
                                checkedIcon="add"
                                checkedColor="#0279AC"
                                checked={true}
                                onPress={() => {
                                    formData.telephones?.push({
                                        isHidden: false,
                                        isVerified: false,
                                        phoneNumber: '',
                                    });
                                    setFormData({ ...formData });
                                }}
                            />
                            {formData.telephones?.map((telephone, index) => (
                                <View key={index}>
                                    <Text style={styles.textPadding}>
                                        {`Telephone ${index + 1}`}
                                    </Text>
                                    <View style={styles.formContainer}>
                                        <TextInput
                                            keyboardType="numeric"
                                            style={styles.telephoneInput}
                                            placeholder={'Telephone #'}
                                            value={telephone.phoneNumber}
                                            onChangeText={(text) => {
                                                if (formData.telephones) {
                                                    formData.telephones[
                                                        index
                                                    ].phoneNumber = text;
                                                    setFormData({
                                                        ...formData,
                                                    });
                                                }
                                            }}
                                        />

                                        <View style={styles.formContainer}>
                                            <TextInput
                                                style={styles.telephoneInput}
                                                placeholder={'Label'}
                                                value={
                                                    telephone.label ?? undefined
                                                }
                                                onChangeText={(text) => {
                                                    if (formData.telephones) {
                                                        formData.telephones[
                                                            index
                                                        ].label = text;
                                                        setFormData({
                                                            ...formData,
                                                        });
                                                    }
                                                }}
                                            />
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <CheckBox
                                                title={'Verified'}
                                                textStyle={styles.checkboxLabel}
                                                checked={telephone.isVerified}
                                                size={24}
                                                checkedColor={'#0279AC'}
                                                uncheckedColor={'lightgray'}
                                                containerStyle={
                                                    styles.checkboxContainer
                                                }
                                                onPress={() => {
                                                    if (formData.telephones) {
                                                        formData.telephones[
                                                            index
                                                        ].isVerified = !formData
                                                            .telephones[index]
                                                            .isVerified;
                                                        setFormData({
                                                            ...formData,
                                                        });
                                                    }
                                                }}
                                            />

                                            <CheckBox
                                                title={'Hidden'}
                                                textStyle={styles.checkboxLabel}
                                                checked={telephone.isHidden}
                                                size={24}
                                                checkedColor={'#0279AC'}
                                                uncheckedColor={'lightgray'}
                                                containerStyle={
                                                    styles.checkboxContainer
                                                }
                                                onPress={() => {
                                                    if (formData.telephones) {
                                                        formData.telephones[
                                                            index
                                                        ].isHidden = !formData
                                                            .telephones[index]
                                                            .isHidden;
                                                        setFormData({
                                                            ...formData,
                                                        });
                                                    }
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                        <View>
                            <CheckBox
                                title="Add Email"
                                textStyle={{ fontWeight: 'normal' }}
                                containerStyle={styles.addCheckboxContainer}
                                iconType="material"
                                checkedIcon="add"
                                checkedColor="#0279AC"
                                checked={true}
                                onPress={() => {
                                    formData.emails?.push({
                                        isHidden: false,
                                        isVerified: false,
                                        emailAddress: '',
                                    });
                                    setFormData({ ...formData });
                                }}
                            />
                            {formData.emails?.map((email, index) => (
                                <View key={index}>
                                    <Text style={styles.textPadding}>{`Email ${
                                        index + 1
                                    }`}</Text>
                                    <View style={styles.formContainer}>
                                        <TextInput
                                            style={styles.addressInput}
                                            placeholder={'Email'}
                                            value={email.emailAddress}
                                            onChangeText={(text) => {
                                                if (formData.emails) {
                                                    formData.emails[
                                                        index
                                                    ].emailAddress = text;
                                                    setFormData({
                                                        ...formData,
                                                    });
                                                }
                                            }}
                                        />

                                        <View style={styles.formContainer}>
                                            <TextInput
                                                style={styles.addressInput}
                                                placeholder={'Label'}
                                                value={email.label ?? undefined}
                                                onChangeText={(text) => {
                                                    if (formData.emails) {
                                                        formData.emails[
                                                            index
                                                        ].label = text;
                                                        setFormData({
                                                            ...formData,
                                                        });
                                                    }
                                                }}
                                            />
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <CheckBox
                                                title={'Verified'}
                                                textStyle={styles.checkboxLabel}
                                                checked={email.isVerified}
                                                size={24}
                                                checkedColor={'#0279AC'}
                                                uncheckedColor={'lightgray'}
                                                containerStyle={
                                                    styles.checkboxContainer
                                                }
                                                onPress={() => {
                                                    if (formData.emails) {
                                                        formData.emails[
                                                            index
                                                        ].isVerified = !formData
                                                            .emails[index]
                                                            .isVerified;
                                                        setFormData({
                                                            ...formData,
                                                        });
                                                    }
                                                }}
                                            />

                                            <CheckBox
                                                title={'Hidden'}
                                                textStyle={styles.checkboxLabel}
                                                checked={email.isHidden}
                                                size={24}
                                                checkedColor={'#0279AC'}
                                                uncheckedColor={'lightgray'}
                                                containerStyle={
                                                    styles.checkboxContainer
                                                }
                                                onPress={() => {
                                                    if (formData.emails) {
                                                        formData.emails[
                                                            index
                                                        ].isHidden = !formData
                                                            .emails[index]
                                                            .isHidden;
                                                        setFormData({
                                                            ...formData,
                                                        });
                                                    }
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
            {/* Social Media Section */}
            <View style={styles.sectionPadding}>
                <View style={styles.highlightContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerText}>Social Media</Text>
                    </View>

                    <Text style={styles.textPadding}>Facebook</Text>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'Facebook'}
                            value={formData.facebook ?? undefined}
                            onChangeText={(text) => {
                                formData.facebook = text;
                                setFormData({ ...formData });
                            }}
                        />
                    </View>
                    <Text style={styles.textPadding}>LinkedIn</Text>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'Linkedin'}
                            value={formData.linkedin ?? undefined}
                            onChangeText={(text) => {
                                formData.linkedin = text;
                                setFormData({ ...formData });
                            }}
                        />
                    </View>
                    <Text style={styles.textPadding}>Twitter</Text>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={'Twitter'}
                            value={formData.twitter ?? undefined}
                            onChangeText={(text) => {
                                formData.twitter = text;
                                setFormData({ ...formData });
                            }}
                        />
                    </View>
                </View>
            </View>
            {/* Highlight Section */}
            <View style={styles.sectionPadding}>
                <View style={styles.highlightContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerText}>Highlights</Text>
                    </View>
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
                            saveNewPerson();
                        }}
                    >
                        <Text style={{ color: 'white' }}>
                            {relationshipId !== undefined
                                ? 'Edit Person'
                                : 'Add Person'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ height: 100 }}></View>
            <BusyModal
                message={
                    relationshipId !== undefined
                        ? 'Editing Person...'
                        : 'Adding Person...'
                }
                visible={isAddingOrEditingRelationship}
                onOpen={() => setIsBusyModalOpen(true)}
                onClose={() => setIsBusyModalOpen(false)}
            />

            {createOrEditRelationshipError && !isBusyModalOpen && (
                <GenericModal
                    rightButtonText={'OK'}
                    title={
                        relationshipId !== undefined
                            ? 'Error editing person'
                            : 'Error adding person'
                    }
                    message={createOrEditRelationshipError}
                    onRightButton={() =>
                        setCreateOrEditRelationshipError(undefined)
                    }
                />
            )}

            {loadingDataError && !isBusyModalOpen && (
                <GenericModal
                    rightButtonText={'OK'}
                    title={'Error loading data'}
                    message={loadingDataError}
                    onRightButton={() => {
                        props.navigation.goBack();
                        setLoadingDataError(undefined);
                    }}
                />
            )}
        </KeyboardAwareScrollView>
    );
}

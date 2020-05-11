// @ts-nocheck
// NOTE: Ignoring Typescript errors for this file because it is not currently used.
// When this feature is enabled remove the ts-nocheck line

import React, { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Platform,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Picker } from 'react-native-picker-dropdown';
import { connect } from 'react-redux';
import { getEnvVars } from '../../../../environment';
import * as yup from 'yup';
import { Appearance } from 'react-native-appearance';

const { familyConnectionsURL } = getEnvVars();

const colorScheme = Appearance.getColorScheme();

const schema = yup.object().shape({
    first_name: yup.string().required(),
    middle_name: yup.string().nullable(),
    last_name: yup.string().nullable(),
    suffix: yup.string().nullable(),
    dob: yup.string().nullable(),
    gender: yup.string().nullable(),
    deceased: yup.boolean().nullable(),
    addresses: yup.array().of(
        yup.object({
            locality: yup.string().required(),
            state: yup.string().required(),
            zip: yup.number().positive().integer(),
        })
    ),
    telephones: yup
        .array()
        .of(
            yup.object({
                telephone: yup.string().min(10),
                is_verified: yup.boolean(),
            })
        )
        .required(),
    emails: yup
        .array()
        .of(
            yup.object({
                email: yup.string().email().required(),
                is_verified: yup.boolean(),
            })
        )
        .required(),
    job_title: yup.string().nullable(),
    employer: yup.string().nullable(),
    salary_range: yup.string().nullable(),
    facebook: yup.string().url().nullable(),
    twitter: yup.string().url().nullable(),
    linkedin: yup.string().url().nullable(),
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        //    marginHorizontal: 10 /// used to be 90% width
    },
    header: {
        marginTop: 50,
        marginBottom: 30,
        borderBottomColor: 'rgba(24, 23, 21, 0.3)',
        borderBottomWidth: 0.5,
        fontSize: 2.3,
    },
    textInput: {
        width: '100%',
        color: '#444444',
        borderColor: 'rgba(24, 23, 21, 0.5)',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginTop: 10, // /// used to be margin
        marginBottom: 20,
    },
    textInputLong: {
        width: '80%',
        color: '#444444',
        borderColor: 'rgba(24, 23, 21, 0.5)',
        borderBottomWidth: 1,
        padding: 10,
        marginTop: 5,
    },
    textInputShort: {
        width: '40%',
        color: '#444444',
        borderColor: 'rgba(24, 23, 21, 0.5)',
        borderBottomWidth: 1,
        padding: 10,
        marginTop: 5,
    },
    textInputTel: {
        width: '80%',
        fontSize: 18,
        color: '#444444',
        paddingBottom: 10,
        marginTop: 5,
    },
    textInputEmail: {
        width: '70%',
        color: '#444444',
        borderColor: 'rgba(24, 23, 21, 0.5)',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginTop: 10, // /// used to be margin
        marginBottom: 20,
    },
    doubleField: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginLeft: -10,
        marginBottom: 20,
    },
    picker: {
        color: '#444444',
        borderColor: 'rgba(24, 23, 21, 0.5)',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 20,
        paddingVertical: Platform.OS === 'ios' ? 16 : 4,
        paddingHorizontal: Platform.OS === 'ios' ? 10.5 : 0,
    },
    pickerText: {
        fontSize: Platform.OS === 'ios' ? 14 : null,
        paddingTop: Platform.OS === 'ios' ? 2.5 : null,
        color: '#444444',
    },
    dob_gen: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
        // height on iOS
        // ActionSheet
    },
    datePicker: {
        borderColor: 'rgba(24, 23, 21, 0.5)',
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'ios' ? 16.3 : 20,
        height: Platform.OS === 'ios' ? 49 : 60,
    },
    addButton: {
        backgroundColor: '#0279AC',
        borderRadius: 20,
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 10,
        paddingBottom: 2,
        paddingLeft: 1,
    },
    delButton: {
        backgroundColor: '#DB272A',
        borderRadius: 20,
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 10,
        paddingBottom: 2,
        paddingLeft: 1,
    },
    addButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    delButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '30%',
    },
    delTelButtonRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        width: '30%',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    saveButton: {
        width: 150,
        marginVertical: 15,
        // marginHorizontal: 10,
        padding: 15,
        backgroundColor: '#0279AC',
        color: '#fff',
        borderRadius: 5,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    cancelButton: {
        width: 150,
        marginVertical: 15,
        // marginHorizontal: 10,
        padding: 14,
        backgroundColor: '#fff',
        color: '#0279AC',
        borderColor: '#0279AC',
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 20,
        textAlign: 'center',
    },
    errorBox: {
        justifyContent: 'center',
        backgroundColor: '#ff9494',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 15,
    },
    errorText: {
        color: '#DB272A',
    },
    hr: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(24, 23, 21, 0.3)',
        marginTop: 5,
        marginBottom: 12,
    },
    buttonLbl: { fontSize: 16, paddingBottom: 12 },
});

function EditDetailsForm(props) {
    const [token] = useState('');
    const [formData, setFormData] = useState(props.details);
    const [error, setError] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [showCal, setShowCal] = useState(false);

    function handleChange(name, value, options = {}) {
        setFormData((formData) => {
            const copy = { ...formData };

            if ('index' in options) {
                copy[name][options.index][options.subname] = value;
            } else {
                copy[name] = value;
            }

            return copy;
        });
    }

    function errorValidatorFormatter(err) {
        // nests errors for fields that are arrays, yup returns '[]' in errors that are arrays
        // "telephones[3].telephone must be at least 10 characters"

        const fieldErrors = {};

        if (err.includes('[')) {
            const newErr = err.split('[');
            const name = newErr[0];
            const errTemplate = newErr[1].split(']');
            const errIndex = errTemplate[0]; // index of error 3
            const errDetail = errTemplate[1].slice(1); // message of error
            const errType = errTemplate[1].split(' ')[0].slice(1);

            fieldErrors[name] = [];
            fieldErrors[name][errIndex] = {};
            fieldErrors[name][errIndex][errType] = errDetail;
            return fieldErrors;
        } else {
            fieldErrors[err.split(' ')[0]] = err.split(' ').slice(1).join(' ');
            return fieldErrors;
        }
    }

    function save() {
        const form = new FormData();
        form.append('person', JSON.stringify(formData));

        axios
            .patch(
                `${familyConnectionsURL}/api/v1/individualperson/${props.id}/`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                props.setEdit(false);
                // props.getDetails(props.id);
            })
            .catch((err) => {
                console.log('Unable to edit person', err);
                setError(true);
            });
    }

    function handleSave() {
        // let currentErrors = {}
        setFormErrors({});
        schema
            .validate(formData, { abortEarly: false })
            .then(() => {
                // checks the formData with Yup schema, if it passes errors are cleared and save function is run
                setFormErrors({});
                save();
            })
            .catch((error) => {
                let errObj = {};
                error.errors.forEach((err) => {
                    errObj = { ...errObj, ...errorValidatorFormatter(err) };
                });
                setFormErrors(errObj);
            });
    }

    function handleCancel() {
        props.setEdit(false);
        // props.getDetails(props.id);
    }

    function handleNew(name) {
        setFormData((formData) => {
            let shape;
            switch (name) {
                case 'addresses':
                    shape = {
                        country: '',
                        country_code: '',
                        formatted: '',
                        is_verified: false,
                        latitude: 0,
                        locality: '',
                        longitude: 0,
                        postal_code: '',
                        raw: '',
                        route: '',
                        state: '',
                        state_code: '',
                        street_number: '',
                    };
                    break;
                case 'emails':
                    shape = { email: '', is_verified: false };
                    break;
                case 'telephones':
                    shape = { telephone: '', is_verified: false };
                    break;
            }
            return {
                ...formData,
                [name]: [...formData[name], shape],
            };
        });
    }

    function deleteField(name, id) {
        setFormData({
            ...formData,
            [name]: formData[name].filter((element, index) => id !== index),
        });
    }

    function TRY(path) {
        let v;
        try {
            v = eval(path);
        } catch (err) {
            return undefined;
        }
        return v;
    }

    // functions for birthday field date selector
    // show/hide native picker
    function showDatePicker() {
        setShowCal(true);
    }

    function hideDatePicker() {
        setShowCal(false);
    }

    // handler for date: backend expects birthday object w/ numeric day/month/year and date string of mm/dd/yyyy, m/d/yyyy, etc
    function handleDate(date) {
        setShowCal(false); // must be first or race condition causes picker to reappear after submit
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        setFormData({
            ...formData,
            birthday: {
                day,
                month,
                year,
                raw: month + '/' + day + '/' + year,
            },
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text
                    style={{
                        color: 'rgba(24, 23, 21, 0.5)',
                        fontWeight: 'bold',
                    }}
                >
                    INFORMATION
                </Text>
            </View>

            <Text>First Name</Text>
            <TextInput
                style={styles.textInput}
                value={formData['first_name']}
                placeholder="First Name"
                onChangeText={(text) => handleChange('first_name', text)}
            />

            <Text>Middle Name</Text>
            <TextInput
                style={styles.textInput}
                value={formData['middle_name']}
                placeholder="Middle Name"
                onChangeText={(text) => handleChange('middle_name', text)}
            />

            <Text>Last Name</Text>
            <TextInput
                style={styles.textInput}
                value={formData['last_name']}
                placeholder="Last Name"
                onChangeText={(text) => handleChange('last_name', text)}
            />

            <Text>Suffix</Text>
            <View style={styles.picker}>
                <Picker
                    selectedValue={formData.suffix}
                    onValueChange={(suffix) => handleChange('suffix', suffix)}
                    textStyle={styles.pickerText}
                >
                    <Picker.Item label="Suffix" value="" />
                    <Picker.Item label="Sr." value="Sr." />
                    <Picker.Item label="Jr." value="Jr." />
                    <Picker.Item label="II" value="II" />
                    <Picker.Item label="III" value="III" />
                    <Picker.Item label="IV" value="IV" />
                    <Picker.Item label="V" value="V" />
                </Picker>
            </View>

            <View style={styles.dob_gen}>
                <View style={styles['dob_gen_item']}>
                    <Text style={{ marginBottom: 10 }}>Date of Birth</Text>

                    {/* Date picker: touchable is styled to match text inputs but triggers picker modal via hook */}
                    <TouchableOpacity
                        style={styles.datePicker}
                        onPress={showDatePicker}
                    >
                        <Text style={styles.dateText}>
                            {formData.birthday ? formData.birthday.raw : ''}
                        </Text>
                    </TouchableOpacity>

                    {/* Modal appears over other components when showCal===true
            dark mode on iOS cannot be overridden for this component;
            modal must respond to dark mode to avoid white-on-white date picker
          */}
                    <DateTimePickerModal
                        isVisible={showCal}
                        onCancel={hideDatePicker}
                        onConfirm={handleDate}
                        isDarkModeEnabled={
                            Platform.OS === 'ios' && colorScheme === 'dark'
                        }
                    />
                </View>

                <View style={styles['dob_gen_item']}>
                    <Text>Gender</Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={formData['gender']}
                            onValueChange={(gender) =>
                                handleChange('gender', gender)
                            }
                            textStyle={styles.pickerText}
                        >
                            <Picker.Item label="male" value="M" />
                            <Picker.Item label="female" value="F" />
                            <Picker.Item label="other" value="O" />
                        </Picker>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 10 }}>Deceased</Text>
                <CheckBox
                    checked={formData.deceased}
                    onIconPress={() =>
                        handleChange('deceased', !formData.deceased)
                    }
                />
            </View>

            <View style={styles.header}>
                <Text>CONTACT DETAILS</Text>
            </View>
            {formData.addresses &&
                formData.addresses.map((val, i) => {
                    return (
                        <>
                            <View style={styles.hr}>
                                <View style={styles.delButtonRow}>
                                    <TouchableOpacity
                                        style={styles.delButton}
                                        onPress={() =>
                                            deleteField('addresses', i)
                                        }
                                    >
                                        <Text style={styles.buttonText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.buttonLbl}>Home</Text>
                                </View>

                                <View>
                                    <TextInput
                                        style={styles.textInputLong}
                                        value={
                                            val.street_number
                                                ? `${val.street_number} ${val.route}`
                                                : null
                                        }
                                        placeholder="Street Address"
                                        onChange={(route) =>
                                            handleChange('addresses', route, {
                                                index: i,
                                                subname: 'route',
                                            })
                                        }
                                    />
                                    <Text style={styles.errorText}>
                                        {TRY(
                                            `formErrors["addresses"][${i}]["route"]`
                                        )}
                                    </Text>

                                    <TextInput
                                        style={styles.textInputLong}
                                        value={val.locality}
                                        placeholder="City"
                                        onChange={(locality) =>
                                            handleChange(
                                                'addresses',
                                                locality,
                                                {
                                                    index: i,
                                                    subname: 'locality',
                                                }
                                            )
                                        }
                                    />
                                    <Text style={styles.errorText}>
                                        {TRY(
                                            `formErrors["addresses"][${i}]["locality"]`
                                        )}
                                    </Text>

                                    <View style={styles.doubleField}>
                                        <TextInput
                                            style={styles.textInputShort}
                                            value={val.state}
                                            placeholder="State"
                                            onChange={(state) =>
                                                handleChange(
                                                    'addresses',
                                                    state,
                                                    {
                                                        index: i,
                                                        subname: 'state',
                                                    }
                                                )
                                            }
                                        />
                                        <Text style={styles.errorText}>
                                            {TRY(
                                                `formErrors["addresses"][${i}]["state"]`
                                            )}
                                        </Text>

                                        <TextInput
                                            style={styles.textInputShort}
                                            value={val['postal_code']}
                                            placeholder="Zip Code"
                                            onChange={(postal_code) =>
                                                handleChange(
                                                    'addresses',
                                                    postal_code,
                                                    {
                                                        index: i,
                                                        subname: 'postal_code',
                                                    }
                                                )
                                            }
                                        />
                                        <Text style={styles.errorText}>
                                            {TRY(
                                                `formErrors["addresses"][${i}]["postal_code"]`
                                            )}
                                        </Text>
                                    </View>

                                    <TextInput
                                        style={styles.textInputLong}
                                        value={val.country}
                                        placeholder="Country"
                                        onChange={(country) =>
                                            handleChange('addresses', country, {
                                                index: i,
                                                subname: 'country',
                                            })
                                        }
                                    />
                                    <Text style={styles.errorText}>
                                        {TRY(
                                            `formErrors["addresses"][${i}]["country"]`
                                        )}
                                    </Text>
                                </View>
                            </View>
                        </>
                    );
                })}

            <View style={styles.addButtonRow}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleNew('addresses')}
                >
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.buttonLbl}>Add Address</Text>
                <View style={styles.hr} />
            </View>

            <View style={styles.hr} />

            {formData.telephones &&
                formData.telephones.map((val, i) => {
                    return (
                        <>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 10,
                                    marginBottom: 20,
                                }}
                            >
                                <View style={styles.delTelButtonRow}>
                                    <TouchableOpacity
                                        style={styles.delButton}
                                        onPress={() =>
                                            deleteField('telephones', i)
                                        }
                                    >
                                        <Text style={styles.buttonText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.buttonLbl}>Mobile</Text>
                                </View>
                                <TextInput
                                    style={styles.textInputTel}
                                    key={i}
                                    value={val.telephone}
                                    placeholder="000-000-0000"
                                    onChange={(telephone) =>
                                        handleChange('telephones', telephone, {
                                            index: i,
                                            subname: 'telephone',
                                        })
                                    }
                                />
                                <Text style={styles.errorText}>
                                    {TRY(
                                        `formErrors["telephones"][${i}].telephone`
                                    )}
                                </Text>
                            </View>
                        </>
                    );
                })}
            <View style={styles.hr} />

            <View style={styles.addButtonRow}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleNew('telephones')}
                >
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.buttonLbl}>Add Telephone</Text>
            </View>

            <View style={styles.hr} />

            {formData.emails &&
                formData.emails.map((val, i) => {
                    return (
                        <>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.delButtonRow}>
                                    <TouchableOpacity
                                        style={styles.delButton}
                                        onPress={() => deleteField('emails', i)}
                                    >
                                        <Text style={styles.buttonText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.buttonLbl}>Email</Text>
                                </View>
                                <TextInput
                                    style={styles.textInputEmail}
                                    key={i}
                                    value={val.email}
                                    placeholder="name@mail.com"
                                    onChange={(email) =>
                                        handleChange('emails', email, {
                                            index: i,
                                            subname: 'email',
                                        })
                                    }
                                />
                                <Text style={styles.errorText}>
                                    {TRY(`formErrors["emails"][${i}].email`)}
                                </Text>
                            </View>
                        </>
                    );
                })}
            <View style={styles.hr} />
            <View style={styles.addButtonRow}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleNew('emails')}
                >
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
                <Text>Add Email</Text>
                <View style={styles.hr} />
            </View>

            <View style={styles.hr} />
            <Text style={{ marginTop: 10 }}>Job Title</Text>
            <TextInput
                style={styles.textInput}
                value={formData['job_title']}
                onChangeText={(text) => handleChange('job_title', text)}
                placeholder="Job Title"
            />

            <Text>Employer</Text>
            <TextInput
                style={styles.textInput}
                value={formData['employer']}
                onChangeText={(text) => handleChange('employer', text)}
                placeholder="Company Name"
            />

            <Text>Salary Range</Text>
            <View style={styles.picker}>
                <Picker
                    selectedValue={formData['salary_range']}
                    textStyle={styles.pickerText}
                    onValueChange={(salary) =>
                        handleChange('salary_range', salary)
                    }
                >
                    <Picker.Item label="Salary Range" value={1} />
                    <Picker.Item label="<$40,000" value={2} />
                    <Picker.Item label="$40,001-$80,000" value={3} />
                    <Picker.Item label="$81,001-$120,000" value={4} />
                    <Picker.Item label="$120,001-$160,000" value={5} />
                    <Picker.Item label="$160,001-$200,000" value={6} />
                    <Picker.Item label="$200,000+" value={7} />
                </Picker>
            </View>

            <View style={styles.header}>
                <Text>SOCIAL MEDIA</Text>
            </View>

            <Text>Facebook</Text>
            <TextInput
                style={styles.textInput}
                value={formData['facebook']}
                onChangeText={(text) => handleChange('facebook', text)}
                placeholder="Facebook"
            />
            <Text style={styles.errorText}>{formErrors.facebook}</Text>

            <Text>Twitter</Text>
            <TextInput
                style={styles.textInput}
                value={formData['twitter']}
                onChangeText={(text) => handleChange('twitter', text)}
                placeholder="Twitter"
            />
            <Text style={styles.errorText}>{formErrors.twitter}</Text>

            <Text>LinkedIn</Text>
            <TextInput
                style={styles.textInput}
                value={formData['linkedin']}
                onChangeText={(text) => handleChange('linkedin', text)}
                placeholder="LinkedIn"
            />
            <Text style={styles.errorText}>{formErrors.linkedin}</Text>

            {error ? (
                <View style={styles.errorBox}>
                    <Text style={{ color: '#fff', alignSelf: 'center' }}>
                        Unable to Update Connection
                    </Text>
                </View>
            ) : null}

            <View
                style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginBottom: 15,
                }}
            >
                <TouchableOpacity onPress={handleCancel}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveButton}>Save</Text>
                </TouchableOpacity>
            </View>
            <View style={{ height: 60 }} />
        </View>
    );
}

const mapStateToProps = () => {
    return {};
};

export default connect(mapStateToProps, {})(EditDetailsForm);

import React from 'react';
import { Button, Text, ScrollView, View } from 'react-native';
import { compose } from 'recompose';
import {
    handleTextInput,
    withNextInputAutoFocusInput,
} from 'react-native-formik';
import { TextField } from 'react-native-material-textfield';
// import SwitchBtn from "./SwitchBtn";
import ToggleSwitch from 'toggle-switch-react-native';
import axios from 'axios';

const AddNotesInput = compose(
    handleTextInput,
    withNextInputAutoFocusInput,
)(TextField);

const NotesForm = withNextInputAutoFocusInputForm(View);
const [ notes, setNotes ] = useState([]);

useEffect(() => {
    axios
        .post('https://family-staging.connectourkids.org/api/v1/documents/')
        .then(
            (res) => {
                console.log(res);
            },
            (error) => {
                console.error('Please try again', error);
            },
        );
}, []);
function NotesForm(Notes: string): void {
    axios
        .post(
            `https://family-staging.connectourkids.org/api/v1/person/${pk}/histories/`,
        )
        .then(
            (res) => {
                console.log(res);
            },
            (error) => {
                console.error('Note failed to save please try again', error);
            },
        );
}

const handleChange = (event) => {
    setNotes({ ...notes, [event.target.SAVE]: event.target.value });
};

export default (props) => (
    <Formik
        onsubmit={(values) => console.log(values)}
        validationSchema={validationSchema}
        render={(props) => {
            return (
                <NotesForm>
                    <MyInput label="Notes" name="Add a Note" type="inputfield" />
                    <ToggleSwitch
                        isOn={false}
                        onColor="sky blue"
                        offColor="grey"
                        label="This information is Sensitive(2FA Required to view)"
                        labelStyle={{ color: 'blue', fontWeight: '790' }}
                        size="large"
                        onToggle={(isOn) => console.log('changed to : ', isOn)}
                    />
                    <Button onPress={props.handleSubmit} title="SAVE" />
                </NotesForm>
            );
        }}
    />
);

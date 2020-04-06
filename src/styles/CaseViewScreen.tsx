import React, { useState } from 'react';
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native';
import constants from '../helpers/constants';
import { ListItem, Button } from 'react-native-elements';
import {
    Engagement,
    Participants,
    Highlights,
} from '../components/CaseViewTabs';

export default function CaseViewScreen(props) {
    const [tabs, setTabs] = useState({
        engagement: true,
        participants: false,
        highlights: false,
    });

    const styles = StyleSheet.create({
        tabs: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-around',
        },

        selected: {
            backgroundColor: constants.highlightColor,
        },

        tab: {
            padding: 10,
            fontSize: 16,
        },
    });

    const caseData = props.caseData;
    return (
        <View>
            <View
                style={{
                    marginVertical: 200,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text>{caseData.full_name} Test</Text>
                <View>
                    <ListItem
                        leftAvatar={{
                            source: { uri: caseData.picture || placeholderImg },
                        }}
                    />
                    <Text>Gender: {caseData.gender}</Text>
                    <Text>Date of Birth: {caseData.birthday.raw}</Text>
                    <Text>
                        Residence:{' '}
                        {caseData.address && caseData.address.formatted
                            ? caseData.address.formatted
                            : 'no address available'}
                    </Text>
                    <Text>Initiation:{caseData.foster_care}</Text>
                </View>
                <View
                    style={{
                        alignContent: 'center',
                        marginVertical: 60,
                        marginHorizontal: 30,
                        fontSize: 80,
                        fontWeight: 'bold',
                        paddingTop: -10,
                    }}
                >
                    <TouchableHighlight>
                        <Button
                            buttonStyle={{
                                backgroundColor: constants.highlightColor,
                            }}
                            title="Work on Case"
                            onPress={() => {
                                props.setModalVisible(!props.modalVisible);
                            }}
                        />
                    </TouchableHighlight>
                </View>
                <View style={styles.tabs}>
                    <Text
                        style={[
                            styles.tab,
                            tabs.engagement ? styles.selected : null,
                        ]}
                        onPress={() => {
                            setTabs({
                                engagement: true,
                                participants: false,
                                highlights: false,
                            });
                        }}
                    >
                        Engagement
                    </Text>
                    <Text
                        style={[
                            styles.tab,
                            tabs.participants ? styles.selected : null,
                        ]}
                        onPress={() => {
                            setTabs({
                                engagement: false,
                                participants: true,
                                highlights: false,
                            });
                        }}
                    >
                        Participants
                    </Text>
                    <Text
                        style={[
                            styles.tab,
                            tabs.highlights ? styles.selected : null,
                        ]}
                        onPress={() => {
                            setTabs({
                                engagement: false,
                                participants: false,
                                highlights: true,
                            });
                        }}
                    >
                        Highlights
                    </Text>
                </View>
            </View>
            {tabs.engagement ? <Engagement caseData={caseData} /> : null}
            {tabs.participants ? <Participants caseData={caseData} /> : null}
            {tabs.highlights ? <Highlights caseData={caseData} /> : null}

            <TouchableHighlight
                underlayColor="lightgray"
                style={{ alignItems: 'center' }}
                onPress={() => {
                    props.setCaseVisible();
                }}
            >
                <Text
                    style={{
                        padding: 10,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: `${constants.highlightColor}`,
                        color: `${constants.highlightColor}`,
                    }}
                >
                    Close Case
                </Text>
            </TouchableHighlight>
        </View>
    );
}

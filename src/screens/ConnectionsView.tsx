import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Button,
    Linking,
    Modal,
    Image,
} from 'react-native';
import {
    Divider,
    ListItem,
} from 'react-native-elements';
import constants from '../helpers/constants';
import { connect } from 'react-redux';
import {
    getEngagements,
    getDocuments,
    clearDocuments,
    clearEngagements,
    getDetails,
    setDetails,
} from '../store/actions/connectionData';
import {
    getCaseConnections,
    clearCaseConnections,
} from '../store/actions/caseConnections';
import {
    Ionicons,
    AntDesign,
    MaterialCommunityIcons,
    Feather,
    MaterialIcons,
} from '@expo/vector-icons';
import { Engagement, Documents } from '../components/ConnectionsViewTabs/ConnectionsViewTabs';
import Loader from '../components/Loader/Loader';
import ScrollToTop from '../UI/ScrollToTop';
import ConnectionsDetailsView from './ConnectionsDetailsView';
import AddDocumentButtonsGroup from '../components/ConnectionsViewTabs/AddDocumentButtonsGroup/index.jsx';
import CaseList from '../components/CaseList/index.jsx';

const placeholderImg = require('../../assets/profile_placeholder.png');

function ConnectionsView(props) {
    const connection = props.navigation.getParam('connectionData');
    const [ tabs, setTabs ] = useState({
        engagement: true,
        docs: false,
        details: false,
    });

    const [ isScrolling, setIsScrolling ] = useState(false);
    useEffect(() => {
        props.getEngagements(props.navigation.getParam('connectionData').person.pk);
        props.getDocuments(props.navigation.getParam('connectionData').person.pk);
        props.getDetails(props.navigation.getParam('connectionData').person.pk);
    }, [ props.isLoadingDocs, props.isLoadingEngagements ]);


    // const leftArrow = '\u2190';

    const engagementsNoDocuments: object[] = props.engagements.filter((engagement) => engagement.data_type !== 'D');

    const passEngagementType: any = (type) => {
        return props.navigation.navigate('EngagementForm', { data_type: type, id: connection.person.pk });
    };

    const goToTop: any = () => {
        scroll.scrollTo({ x: 0, y: 0, animated: true });
    };

    return (
        <View >
            {isScrolling
                ? <ScrollToTop
                    style={{
                        position: 'absolute',
                        zIndex: 1000,
                        bottom: 10,
                        right: 38,
                        backgroundColor: 'white',
                        padding: 8,
                        borderRadius: 35,
                    }}
                    onPress={goToTop}
                /> : null}
            <ScrollView
                ref={(a) => { scroll = a }}
                style={{ height: '100%', width: '100%' }}
                scrollsToTop
                onScroll={(e) => {
                    if (e.nativeEvent.contentOffset.y <= 250) {
                        setIsScrolling(false);
                    }
                    else if (e.nativeEvent.contentOffset.y >= 250) {
                        setIsScrolling(true);
                    }
                }}
                onScrollToTop={() => setIsScrolling(false)}
                scrollEventThrottle={16}
            >

                <View>
                    <View style={styles.avatarName}>
                        <CaseList
                            connection={connection}
                        />
                    </View>
                </View>

                <View style={[ { justifyContent: 'flex-start', width: '100%', alignItems: 'flex-start' } ]}>
                    <View
                        style={{
                            borderRadius: 4,
                            width: '100%',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <View style={[ styles.tabs ]}>
                            <View style={[ styles.engagementTab, tabs.engagement ? styles.engagementSelected : null ]}>
                                <Text
                                    style={[ { color: '#444444', fontSize: 17.5, paddingBottom: 9 }, tabs.engagement ? { color: '#444444' } : { color: '#444444' } ]}
                                    onPress={() => {
                                        setTabs({
                                            engagement: true,
                                            docs: false,
                                            details: false,
                                        });
                                    }}>
                                    <Text style={tabs.engagement ? styles.thatBlue : null} >
                                        Engagements
                                    </Text>

                                </Text>
                            </View>
                            <View style={[ styles.detailsTab, tabs.details ? styles.detailsSelected : null ]}>
                                <Text
                                    style={[ { color: '#444444', fontSize: 17.5, paddingBottom: 9 }, tabs.details ? { color: '#444444' } : { color: '#444444' } ]}
                                    onPress={() => {
                                        setTabs({
                                            engagement: false,
                                            docs: false,
                                            details: true,
                                        });
                                        props.setDetails(true);
                                    }}>

                                    <Text style={tabs.details ? styles.thatBlue : null} >
                                        Details
                                    </Text>

                                </Text>
                            </View>
                            <View style={[ styles.documentsTab, tabs.docs ? styles.documentsSelected : null ]}>
                                <Text
                                    style={[ { color: '#444444', fontSize: 17.5, paddingBottom: 9 }, tabs.docs ? { color: '#444444' } : { color: '#444444' } ]}
                                    onPress={() => {
                                        setTabs({
                                            engagement: false,
                                            docs: true,
                                            details: false,
                                        });
                                    }}>
                                    <Text style={tabs.docs ? styles.thatBlue : null} >
                                        Documents
                                    </Text>
                                </Text>
                            </View>
                        </View>

                        {
                            tabs.engagement
                                ? <View
                                    style={{
                                        width: '100%',
                                        minHeight: 350,
                                        paddingVertical: 15,
                                        paddingHorizontal: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 4,
                                            marginBottom: 20,
                                            marginHorizontal: 0,
                                        }}
                                    >
                                        <View style={styles.iconLabelContainer}>
                                            <View style={styles.iconContainer}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        passEngagementType('N');
                                                    }}
                                                >
                                                    <MaterialIcons
                                                        name='note-add'
                                                        style={styles.iconStyles}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.iconLabel}>ADD NOTE</Text>
                                        </View>

                                        <View style={styles.iconLabelContainer}>
                                            <View style={styles.iconContainer}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        passEngagementType('C');
                                                    }}
                                                >
                                                    <MaterialCommunityIcons
                                                        name='phone-plus'
                                                        style={{
                                                            fontSize: 28,
                                                            color: constants.highlightColor,
                                                            width: 28,
                                                            height: 28,
                                                            marginHorizontal: 10,
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.iconLabel}>LOG CALL</Text>
                                        </View>

                                        <View style={styles.iconLabelContainer}>
                                            <View style={styles.iconContainer}>
                                                <TouchableOpacity
                                                    onPress={async () => {
                                                        passEngagementType('E');
                                                    }}
                                                >
                                                    <MaterialCommunityIcons
                                                        name='email-plus'
                                                        style={styles.iconStyles}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.iconLabel}>LOG EMAIL</Text>
                                        </View>
                                    </View>

                                    <View>
                                        {
                                            engagementsNoDocuments.map((engagement) => {
                                                return (
                                                    <View key={engagement.pk} style={{ width: '70%' }}>
                                                        <Engagement engagement={engagement} />
                                                    </View>);

                                            })}
                                    </View>
                                </View>
                                : null
                        }

                        {
                            tabs.docs
                                ? <View
                                    style={{ minHeight: 350, width: '100%' }}
                                >
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <AddDocumentButtonsGroup afterAccept={(media) => {
                                            props.navigation.navigate('DocumentForm', { id: connection.person.pk, media });
                                        }}/>

                                    </View>
                                    <View style={{ width: '100%', maxHeight: '100%' }} >
                                        {props.isLoadingDocs ? <Loader />
                                            : props.documents.map((document) => {

                                                return (
                                                    <Documents key={document.pk} document={document} />);
                                            })}
                                    </View>
                                </View>
                            // </View>
                                : null
                        }
                        {
                            tabs.details
                                ? <View
                                    style={{ minHeight: 350, width: '100%' }}
                                >
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        {props.isLoadingDetails ? <Loader />
                                            : <ConnectionsDetailsView details={props.details} id={connection.person.pk} />
                                        }
                                    </View>
                                </View>
                                : null
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}


const mapStateToProps = (state) => {
    return {
        engagements: state.connection.engagements,
        isLoadingEngagements: state.engagements.isLoadingEngagements,
        engagementsError: state.connection.engagementsError,
        documents: state.connection.documents,
        isLoadingDocuments: state.connection.isLoadingDocuments,
        isLoadingDocs: state.engagements.isLoadingDocs,
        documentsError: state.connection.documentsError,
        details: state.connection.details,
        isLoadingDetails: state.connection.isLoadingDetails,
        detailsTab: state.connection.detailsTab,
    };
};

export default connect(
    mapStateToProps,
    {
        getEngagements,
        clearEngagements,
        getDocuments,
        clearDocuments,
        getDetails,
        setDetails,
        getCaseConnections,
    },
)(ConnectionsView);

const styles = StyleSheet.create({
    tabs: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderTopRightRadius: 4,
        borderBottomColor: '#EBEBEB',
    },

    engagementTab: {
        width: '33.3%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 36,
        fontSize: 17.5,
        textAlign: 'center',
    },

    documentsTab: {
        width: '33.3%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 36,
        fontSize: 17.5,
        textAlign: 'center',
    },
    detailsTab: {
        width: '33.3%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 36,
        fontSize: 17.5,
        textAlign: 'center',
    },
    thatBlue: {
        color: constants.highlightColor,
    },

    engagementSelected: {
        color: 'orange',
        borderBottomWidth: 3,
        borderBottomColor: constants.highlightColor,
        overflow: 'hidden',
    },

    documentsSelected: {
        color: constants.highlightColor,
        borderBottomWidth: 3,
        borderBottomColor: constants.highlightColor,
        overflow: 'hidden',
    },
    detailsSelected: {
        color: constants.highlightColor,
        borderBottomWidth: 3,
        borderBottomColor: constants.highlightColor,
        overflow: 'hidden',
    },

    iconLabelContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginHorizontal: 15,
    },

    iconContainer: {
        height: 45,
        width: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    iconStyles: {
        fontSize: 28,
        color: constants.highlightColor,
        width: 28,
        height: 28,
        marginHorizontal: 10,
    },

    iconLabel: {
        color: '#0F6580',
        fontSize: 12,
    },
    avatarName: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingBottom: '10%',
        paddingTop: 5,
        paddingLeft: 5,
    },
});

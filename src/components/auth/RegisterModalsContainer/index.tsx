import React from 'react';

import {
    View,
    Modal,
} from 'react-native';

import SocialWorkerModal from '../SocialWorkerModal/index.jsx';
import VideoAgreeModal from '../VideoAgreeModal/index.jsx';
import VideoModal from '../VideoModal/index.jsx';
import styles from './style.js';

import { sendEvent } from '../../../helpers/createEvent';

/**********************************************************/

export default function RegisterModalsContainer(props): JSX.Element {

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={props.modalVisible}
            onRequestClose={(): void => {
                props.setModalVisible(false);
            }}
        >
            <View style={styles.marginTop}>
                <View>
                    {(props.modalVisible && !props.videoAgree && !props.videoVisible)
                        ? (
                            <SocialWorkerModal
                                modalVisible={props.modalVisible}
                                advanceModal={props.setAgreeModalVisible}
                                setModalVisible={props.setModalVisible}
                                sendEvent={sendEvent}
                            />
                        )
                        : null
                    }
                    {(!props.videoVisible && props.videoAgree)
                        ? (
                            <VideoAgreeModal
                                modalVisible={props.modalVisible}
                                advanceModal={props.setVideoPlayerModalVisible}
                                setModalVisible={props.setModalVisible}
                                onLogin={props.onLogin}
                                sendEvent={sendEvent}
                            />
                        )
                        : null
                    }
                    {(!props.videoAgree && props.videoVisible)
                        ? (
                            <VideoModal
                                setModalVisible={props.setModalVisible}
                                onLogin={props.onLogin}
                                sendEvent={sendEvent}
                            />
                        )
                        : null
                    }
                </View>
            </View>
        </Modal>
    );

}

/**********************************************************/

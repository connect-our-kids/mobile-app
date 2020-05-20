import React from 'react';

import { View, Modal } from 'react-native';

import SocialWorkerModal from '../SocialWorkerModal';
import VideoAgreeModal from '../VideoAgreeModal';
import VideoModal from '../VideoModal';
import styles from './RegisterModalsContainer.styles';

import { sendEvent } from '../../../helpers/createEvent';

export default function RegisterModalsContainer(props: {
    modalVisible: boolean | undefined;
    setModalVisible: (arg0: boolean) => void;
    videoAgree: boolean;
    videoVisible: boolean;
    setAgreeModalVisible: (arg0: boolean) => void;
    setVideoPlayerModalVisible: (arg0: boolean) => void;
    onLogin: () => void;
}): JSX.Element {
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
                    {props.modalVisible &&
                    !props.videoAgree &&
                    !props.videoVisible ? (
                        <SocialWorkerModal
                            modalVisible={props.modalVisible}
                            advanceModal={props.setAgreeModalVisible}
                            setModalVisible={props.setModalVisible}
                            sendEvent={sendEvent}
                        />
                    ) : null}
                    {!props.videoVisible && props.videoAgree ? (
                        <VideoAgreeModal
                            advanceModal={props.setVideoPlayerModalVisible}
                            setModalVisible={props.setModalVisible}
                            onLogin={props.onLogin}
                            sendEvent={sendEvent}
                        />
                    ) : null}
                    {!props.videoAgree && props.videoVisible ? (
                        <VideoModal
                            setModalVisible={props.setModalVisible}
                            onLogin={props.onLogin}
                            sendEvent={sendEvent}
                        />
                    ) : null}
                </View>
            </View>
        </Modal>
    );
}

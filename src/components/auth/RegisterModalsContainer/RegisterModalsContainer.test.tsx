import React from 'react';
import renderer from 'react-test-renderer';
import RegisterModalsContainer from './RegisterModalsContainer';

describe('RegisterModalsContainer component', () => {
    test('renders', () => {
        const props: {
            modalVisible: boolean | undefined;
            setModalVisible: (arg0: boolean) => void;
            videoAgree: boolean;
            videoVisible: boolean;
            setAgreeModalVisible: (arg0: boolean) => void;
            setVideoPlayerModalVisible: (arg0: boolean) => void;
            onLogin: () => void;
        } = {
            modalVisible: undefined,
            videoAgree: true,
            videoVisible: true,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setModalVisible: (arg0: boolean) => {
                return;
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setAgreeModalVisible: (arg0: boolean) => {
                return;
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setVideoPlayerModalVisible: (arg0: boolean) => {
                return;
            },
            onLogin: () => {
                return;
            },
        };
        const tree = renderer.create(<RegisterModalsContainer {...props} />);
        expect(tree.root.findByType(RegisterModalsContainer)).toBeDefined();
    });
});

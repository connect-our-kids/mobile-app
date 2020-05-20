import React from 'react';

import renderer from 'react-test-renderer';

import VideoAgreeModal from './VideoAgreeModal';

describe('VideoAgreeModal component', () => {
    test('renders', () => {
        const props: {
            setModalVisible: (arg0: boolean) => void;
            sendEvent: (arg0: null, arg1: string, arg2: string) => void;
            advanceModal: (arg0: boolean) => void;
            onLogin: () => void;
        } = {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setModalVisible: (arg0: boolean) => {
                return;
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            sendEvent: (arg0: null, arg1: string, arg2: string) => {
                return;
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            advanceModal: (arg0: boolean) => {
                return;
            },
            onLogin: () => {
                return;
            },
        };
        const tree = renderer.create(<VideoAgreeModal {...props} />);
        expect(tree.root.findByType(VideoAgreeModal)).toBeDefined();
    });
});

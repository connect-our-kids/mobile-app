import React from 'react';

import renderer from 'react-test-renderer';

import VideoModal from './VideoModal';

describe('VideoModal component', () => {
    test('renders', () => {
        const props: {
            setModalVisible: (arg0: boolean) => void;
            sendEvent: (arg0: null, arg1: string, arg2: string) => void;
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
            onLogin: () => {
                return;
            },
        };
        const tree = renderer.create(<VideoModal {...props} />);
        expect(tree.root.findByType(VideoModal)).toBeDefined();
    });
});

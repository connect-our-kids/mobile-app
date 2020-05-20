import React from 'react';
import renderer from 'react-test-renderer';
import SocialWorkerModal from './SocialWorkerModal';

describe('SocialWorkerModal component', () => {
    test('renders', () => {
        const props: {
            setModalVisible: (arg0: boolean) => void;
            modalVisible: boolean;
            sendEvent: (arg0: null, arg1: string, arg2: string) => void;
            advanceModal: (arg0: boolean) => void;
        } = {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setModalVisible: (arg0: boolean) => {
                return;
            },
            modalVisible: true,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            sendEvent: (arg0: null, arg1: string, arg2: string) => {
                return;
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            advanceModal: (arg0: boolean) => {
                return;
            },
        };
        const tree = renderer.create(<SocialWorkerModal {...props} />);
        expect(tree.root.findByType(SocialWorkerModal)).toBeDefined();
    });
});

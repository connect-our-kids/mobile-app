import React from 'react';
import { Image, View } from 'react-native';
import constants from '../../helpers/constants';

const Loader = () => {
    return (
        <View
            style={{
                backgroundColor: constants.backgroundColor,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
            }}
        >
            <Image
                source={require('../../../assets/loading.gif')}
                style={{ width: 80, height: 80 }}
            />
        </View>
    );
};

export default Loader;

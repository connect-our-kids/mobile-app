import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import constants from '../../../helpers/constants';

import chevron from '../../../../assets/chevron.png';

const ScrollToTop = (
    props: JSX.IntrinsicAttributes &
        JSX.IntrinsicClassAttributes<TouchableOpacity> &
        Readonly<import('react-native').TouchableOpacityProps>
) => {
    // by spreading props and styles in an array, we can pass it custom styles to override or add to these base styles when we use this component
    return (
        <TouchableOpacity {...props}>
            <View
                style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Image
                    source={chevron}
                    style={{ height: 15, width: 20, marginBottom: -5 }}
                />
                <Image
                    source={chevron}
                    style={{ height: 15, width: 20, marginBottom: 2 }}
                />
                <Text style={{ color: constants.highlightColor, fontSize: 18 }}>
                    TOP
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default ScrollToTop;

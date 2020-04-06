import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import constants from '../helpers/constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import chevron from '../../assets/chevron.png';

const ScrollToTop = (props) => {
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

const styles = StyleSheet.create({
    scrollButton: {
        position: 'absolute',
        zIndex: 1000,
        bottom: 5,
        right: 46,
    },
});

export default ScrollToTop;

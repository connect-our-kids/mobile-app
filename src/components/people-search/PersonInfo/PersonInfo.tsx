/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { StyleSheet } from 'react-native';
import { Grid } from 'native-base';
import PersonInfoHeader from '../PersonInfoHeader';
import PersonInfoRow from '../PersonInfoRow';

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        flexDirection: 'column',
    },
});

interface PersonInfoProps {
    item: any;
    startRegister: any;
    isLoggedIn: any;
    showConModal: any;
    navigation: any;
    setData: any;
}

export default function PersonInfo({
    item,
    startRegister,
    isLoggedIn,
    showConModal,
    navigation,
    setData,
}: PersonInfoProps) {
    return (
        <Grid style={styles.container}>
            <PersonInfoHeader item={item} />
            <PersonInfoRow
                {...{
                    showConModal,
                    startRegister,
                    item,
                    itemKey: 'emails',
                    itemValue: 'address',
                    title: 'Emails',
                    navigation,
                    setData: undefined,
                }}
            />
            <PersonInfoRow
                {...{
                    showConModal,
                    startRegister,
                    item,
                    itemKey: 'phones',
                    itemValue: 'display',
                    title: 'Phone Numbers',
                    navigation,
                    setData: undefined,
                }}
            />
            <PersonInfoRow
                {...{
                    showConModal,
                    startRegister,
                    item,
                    itemKey: 'addresses',
                    itemValue: 'display',
                    title: 'Addresses',
                    navigation,
                    setData: undefined,
                }}
            />
            {/* This person info row also needs to pass in a url */}
            {isLoggedIn && (
                <PersonInfoRow
                    {...{
                        showConModal,
                        startRegister: undefined,
                        item,
                        itemKey: 'urls',
                        itemValue: '@domain',
                        title: 'Websites',
                        navigation,
                        setData: undefined,
                    }}
                />
            )}
            <PersonInfoRow
                {...{
                    showConModal,
                    startRegister,
                    item,
                    itemKey: 'relationships',
                    itemValue: 'names',
                    title: 'Relationships',
                    navigation,
                    setData,
                }}
            />
        </Grid>
    );
}

import React from 'react';
import { Card, CardItem, Grid } from 'native-base';
import { StyleSheet } from 'react-native';
import PersonInfoHeader from '../PersonInfoHeader';

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
    },
});

export default function PersonRow({
    handlePress,
    item,
}: {
    handlePress: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: any;
}) {
    return (
        <Card
            style={{
                shadowOffset: { width: 0, height: 0 },
                shadowColor: 'transparent',
                shadowOpacity: 0,
                borderColor: 'transparent',
            }}
        >
            <CardItem button onPress={handlePress}>
                <Grid style={styles.rowContainer}>
                    <PersonInfoHeader item={item} listItem />
                </Grid>
            </CardItem>
        </Card>
    );
}

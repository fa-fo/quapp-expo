import * as React from 'react';
import {Pressable, Text} from 'react-native';
import styles from '../assets/styles';

export const setGroupHeaderOptions = (navigation, route, data) => {
    navigation.setOptions({
        headerRight: () => (
            <Text>
                {data.object.prevGroup ?
                    <Pressable
                        style={styles.buttonTopRight}
                        onPress={() =>
                            navigation.navigate(route.name, {item: data.object.prevGroup})
                        }>
                        <Text style={styles.textButtonTopRight}>{'<'}</Text>
                    </Pressable>
                    : null}
                <Text> </Text>
                {data.object.nextGroup ?
                    <Pressable
                        style={styles.buttonTopRight}
                        onPress={() =>
                            navigation.navigate(route.name, {item: data.object.nextGroup})
                        }>
                        <Text style={styles.textButtonTopRight}>{'>'}</Text>
                    </Pressable>
                    : null}
            </Text>
        ),
    });
};

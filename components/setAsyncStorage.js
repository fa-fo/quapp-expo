import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function setAsyncStorage(key, value, merge) {
    try {
        const jsonValue = JSON.stringify(value);

        if (merge)
            await AsyncStorage.mergeItem(key, jsonValue);
        else
            await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.log(e);
    }
}

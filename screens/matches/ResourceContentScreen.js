import * as React from 'react';
import {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, useWindowDimensions, View} from 'react-native';
import fetchApi from "../../components/fetchApi";
import styles from "../../assets/styles";
import RenderHtml from 'react-native-render-html';
import {useRoute} from "@react-navigation/native";

export default function ResourceContentScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const {width} = useWindowDimensions();

    useEffect(() => {
        setLoading(true);
        loadScreenData();
    }, [route]);

    const loadScreenData = () => {
        fetchApi('sports/getResourceContent/' + route.params.resource_id)
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const tagsStyles = {
        h4: {
            marginBottom: 0
        }
    };

    return (
        <ScrollView style={[styles.headerComponentView, {minHeight: '100%'}]}>
            {isLoading ? <ActivityIndicator size="large" color="#00ff00" style={styles.actInd}/> :
                (data.status === 'success' ?
                        <View>
                            <RenderHtml
                                contentWidth={width}
                                source={{html: (data?.object?.content ?? 'kein Inhalt gefunden')}}
                                tagsStyles={tagsStyles}
                            />
                        </View> : null
                )}
        </ScrollView>
    );
}

import {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, useWindowDimensions, View} from 'react-native';
import fetchApi from "../../components/fetchApi";
import {style} from "../../assets/styles";
import RenderHtml from 'react-native-render-html';
import {useRoute} from "@react-navigation/native";
import * as ColorFunctions from "../../components/functions/ColorFunctions";

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
            marginBottom: 0,
            color: ColorFunctions.getColor('primary')
        },
        p: {
            color: ColorFunctions.getColor('primary')
        },
        ul: {
            color: ColorFunctions.getColor('primary')
        },
        li: {
            width: width - 50
        }
    };

    return (
        <ScrollView style={[style().headerComponentView, {minHeight: '100%'}]}>
            {isLoading ? <ActivityIndicator size="large" color="#00ff00" style={style().actInd}/> :
                (data?.status === 'success' ?
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

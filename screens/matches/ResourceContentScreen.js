import {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, ScrollView, useWindowDimensions, View} from 'react-native';
import {
    CoreBridge,
    darkEditorCss,
    darkEditorTheme,
    defaultEditorTheme,
    RichText,
    TenTapStartKit,
    Toolbar,
    useEditorBridge,
    useEditorContent
} from '@10play/tentap-editor';
import fetchApi from "../../components/fetchApi";
import {style} from "../../assets/styles";
import RenderHtml from 'react-native-render-html';
import {useRoute} from "@react-navigation/native";
import * as ColorFunctions from "../../components/functions/ColorFunctions";
import TextC from "../../components/customText";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ResourceContentScreen({navigation}) {
    const route = useRoute();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const {width} = useWindowDimensions();
    const [richText, setRichText] = useState('');
    const [isTryingSave, setIsTryingSave] = useState(false);
    const [saved, setSaved] = useState(false);

    const editor = route.name === 'ResourceContentAdmin' ?
        useEditorBridge({
            autofocus: true,
            dynamicHeight: true,
            initialContent: richText ?? '',
            bridgeExtensions: [
                ...TenTapStartKit,
                CoreBridge.configureCSS(darkEditorCss)
            ],
            theme: global.colorScheme === 'dark' ? darkEditorTheme : defaultEditorTheme
        }) : null;

    const content = route.name === 'ResourceContentAdmin' ?
        useEditorContent(editor, {type: 'html'}) : null;

    useEffect(() => {
        setRichText(content);
        setSaved(false);
    }, [content]);

    const saveScreenData = () => {
        setSaved(false);
        setIsTryingSave(true);
        let postData = {'password': global.adminPW, 'content': richText};

        return fetchApi('sports/saveResourceContent/' + route.params.resource_id, 'POST', postData)
            .then(data => {
                if (data?.status === 'success') {
                    setSaved(true)
                }
            })
            .catch(error => console.error(error))
            .finally(() => setIsTryingSave(false));
    };

    useEffect(() => {
        setLoading(true);
        loadScreenData();
    }, [route]);

    const loadScreenData = () => {
        fetchApi('sports/getResourceContent/' + route.params.resource_id + (route.name === 'ResourceContentAdmin' ? '/1' : ''))
            .then((json) => {
                setData(json);
                setRichText(json?.object?.content ?? '');
            })
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
                            {route.name === 'ResourceContentAdmin' ?
                                (editor ?
                                    <View>
                                        <View style={[style().viewRight, {flex: 1}]}>
                                            <Pressable
                                                style={[style().button1, style().buttonEvent, style().buttonGreen, {marginHorizontal: 60}]}
                                                onPress={() => saveScreenData()}
                                            >
                                                <TextC style={style().textButton1}>
                                                    <IconMat name='content-save' size={24} color='#fff'/>
                                                    Speichern
                                                </TextC>
                                            </Pressable>
                                            {saved ?
                                                <Icon name="checkbox-marked-circle" size={48}
                                                      style={{position: 'absolute', right: 2, top: 2, color: 'green'}}/>
                                                : null}
                                            {isTryingSave ?
                                                <ActivityIndicator size={48} color="green"
                                                                   style={{
                                                                       position: 'absolute',
                                                                       right: 2,
                                                                       top: 2,
                                                                       color: 'green'
                                                                   }}/> : null}
                                        </View>
                                        <View style={{flex: 1}}>
                                            <Toolbar editor={editor}/>
                                            <RichText
                                                editor={editor}
                                                style={{height: 600}}
                                            />
                                        </View>
                                    </View> : null)
                                :
                                <RenderHtml
                                    contentWidth={width}
                                    source={{html: data?.object?.content ?? 'kein Inhalt gefunden'}}
                                    tagsStyles={tagsStyles}
                                />}
                        </View> : null
                )}
        </ScrollView>
    );
}

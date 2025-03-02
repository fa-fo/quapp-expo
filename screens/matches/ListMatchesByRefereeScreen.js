import TextC from "../../components/customText";
import {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Pressable, RefreshControl, ScrollView, TextInput, View} from 'react-native';
import {Section, TableView} from 'react-native-tableview-simple';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CellVariantMatches from '../../components/cellVariantMatches';
import * as DateFunctions from "../../components/functions/DateFunctions";
import fetchApi from '../../components/fetchApi';
import {style} from "../../assets/styles";

export default function ListMatchesByRefereeScreen({navigation}) {
    const [refereeName, setRefereeName] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const inputRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            inputRef?.current?.focus()
        }, 50)

        const loadData = () => {
            loadScreenData();
        };

        return navigation.addListener('focus', loadData);
    }, []);

    const loadScreenData = () => {
        let name = refereeName.trim();

        if (name !== '') {
            setLoading(true);
            let postData = {'refereeName': name};

            fetchApi('matches/byReferee', 'POST', postData)
                .then((json) => setData(json))
                .catch((error) => console.error(error))
                .finally(() => setLoading(false));
        }
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadScreenData}/>}>
            <View style={style().viewStatus}>
                <TextInput
                    style={[style().textInput, style().textInputLarge]}
                    onChangeText={setRefereeName}
                    placeholder="Hier SR-Namen eingeben"
                    keyboardType="default"
                    value={refereeName}
                    ref={inputRef}
                    maxLength={32}
                    onSubmitEditing={() => loadScreenData()}
                />
                <Pressable
                    style={[style().button1, style().buttonConfirm, style().buttonGreen, {
                        position: 'absolute',
                        right: 8,
                        top: 8
                    }]}
                    onPress={() => loadScreenData()}
                >
                    <Icon name="arrow-right" size={25}/>
                </Pressable>
            </View>

            {isLoading ? <ActivityIndicator size="large" color="#00ff00" style={style().actInd}/> :
                <View>
                    {data?.object ?
                        <TextC>{'\n  ' + (data.object.matches?.length ?? 0) + ' Spiele gefunden'}</TextC> : null}
                    {data?.status === 'success' && data?.object?.matches?.length > 0 ?
                        <TableView appearance={global.colorScheme}>
                            <Section header={''}>
                                {data.object.matches.map(item =>
                                    <CellVariantMatches
                                        key={item.id}
                                        item={item}
                                        timeText={DateFunctions.getFormatted(item.matchStartTime) + ' Uhr: '}
                                        team1Result={item.resultGoals1 !== null ? (parseInt(item.resultGoals1) || 0) : null}
                                        team2Result={item.resultGoals2 !== null ? (parseInt(item.resultGoals2) || 0) : null}
                                        isRefereeJob={1}
                                        onPress={() => navigation.navigate('MatchDetails', {item})}
                                    />
                                )}
                            </Section>
                        </TableView> : null
                    }
                </View>
            }
        </ScrollView>
    );
}

import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
import {style} from '../../assets/styles.js';
import {Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../components/fetchApi';
import CellVariant from '../../components/cellVariant';
import ScrollViewC from "../../components/customScrollView";
import Icon from "@react-native-vector-icons/material-design-icons";

export default function YearsAllScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchApi('years/all')
            .then((json) => setData(json))
            .finally(() => setLoading(false));
    }, []);

    return (
        <ScrollViewC>
            {isLoading ? <ActivityIndicator size="large" color="#00ff00" style={style().actInd}/> :
                (data?.status === 'success' ? (
                    <TableView appearance={global.colorScheme}>
                        <Section headerComponent={
                            <View>
                                <View style={[style().matchflexRowView, style().headerComponentView]}>
                                    <View style={{flex: 2}}>
                                        <TextC>Bisherige Turniere:</TextC>
                                    </View>
                                    {global.myTeamId > 0 ?
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                            <Pressable style={style().buttonTopRight}
                                                       onPress={() => navigation.navigate('TeamYearsInfoBalance', {team: {team_id: global.myTeamId}})}
                                            >
                                                <TextC style={style().textButtonTopRight}>
                                                    <Icon name="folder-table-outline" size={15} color="#fff"/>
                                                    {' Mein Team: ' + global.myTeamName + '\nBilanz seit 2022'}
                                                </TextC>
                                            </Pressable>
                                        </View> : null}
                                </View>
                            </View>
                        }>
                            {data.object.map(item => (
                                <CellVariant key={item.id}
                                             cellStyle="RightDetail"
                                             title={item.year_name}
                                             accessory="DetailDisclosure"
                                             detail={(item.year_id !== data.year.id ?
                                                     (item.year_name >= 2024 && global.settings.useLiveScouting ? 'Fotos, ' : '')
                                                     + (item.year_name >= 2022 ? 'Ergebnisse, ' : '')
                                                     : '')
                                                 + 'Endtabelle'}
                                             onPress={() => navigation.navigate('TeamYearsEndRanking', {item})}
                                />
                            ))}
                        </Section>
                    </TableView>
                ) : <TextC>Fehler!</TextC>)}
        </ScrollViewC>
    );
}

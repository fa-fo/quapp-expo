import TextC from "../../components/customText";
import {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView} from 'react-native';
import {style} from '../../assets/styles.js';
import {Section, TableView} from 'react-native-tableview-simple';
import fetchApi from '../../components/fetchApi';
import CellVariant from '../../components/cellVariant';

export default function YearsAllScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchApi('years/all')
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <ScrollView>
            {isLoading ? <ActivityIndicator size="large" color="#00ff00" style={style().actInd}/> :
                (data?.status === 'success' ? (
                    <TableView appearance={global.colorScheme}>
                        <Section>
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
        </ScrollView>
    );
}

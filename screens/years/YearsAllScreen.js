import * as React from 'react';
import {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, Text} from 'react-native';
import styles from '../../assets/styles.js';
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
            {isLoading ? <ActivityIndicator size="large" color="#00ff00" style={styles.actInd}/> :
                (data.status === 'success' ? (
                    <TableView appearance="light">
                        <Section>
                            {data.object.map(item => (
                                <CellVariant key={item.id}
                                             cellStyle="RightDetail"
                                             title={item.year_name}
                                             accessory="DetailDisclosure"
                                             detail="Tabelle"
                                             onPress={() => navigation.navigate('TeamYearsEndRanking', {item})}
                                />
                            ))}
                        </Section>
                    </TableView>
                ) : <Text>Fehler!</Text>)}
        </ScrollView>
    );
}

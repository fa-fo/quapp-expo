import * as React from 'react';
import {Text, View} from 'react-native';
import {Cell} from 'react-native-tableview-simple';

export default function CellVariantRankingSubst(props) {
    return (
        <Cell
            {...props}
            cellContentView={
                <View
                    style={{
                        alignSelf: 'flex-start',
                        flexDirection: 'row',
                        flex: 1,
                        paddingVertical: 10,
                    }}>
                    <View style={{flex: 1, alignSelf: 'right'}}>
                        <Text
                            numberOfLines={1}
                            style={{fontSize: 16}}>
                            {props.rank}.
                        </Text>
                    </View>
                    <View style={{flex: 10, alignSelf: 'left'}}>
                        <Text
                            numberOfLines={1}
                            style={{fontSize: 16}}>
                            {props.title}
                        </Text>
                    </View>
                    <View style={{flex: 1, alignSelf: 'left'}}>
                        <Text
                            numberOfLines={1}
                            style={{fontSize: 16}}>
                            {props.count}
                        </Text>
                    </View>
                </View>
            }
        />
    );
}

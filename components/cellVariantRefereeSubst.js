import TextC from "../components/customText";
import {View} from 'react-native';
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
                        <TextC
                            numberOfLines={1}
                            style={{fontSize: 16}}>
                            {props.rank}.
                        </TextC>
                    </View>
                    <View style={{flex: 10, alignSelf: 'left'}}>
                        <TextC
                            numberOfLines={1}
                            style={{fontSize: 16}}>
                            {props.title}
                        </TextC>
                    </View>
                    <View style={{flex: 1, alignSelf: 'left'}}>
                        <TextC
                            numberOfLines={1}
                            style={{fontSize: 16}}>
                            {props.count}
                        </TextC>
                    </View>
                </View>
            }
        />
    );
}

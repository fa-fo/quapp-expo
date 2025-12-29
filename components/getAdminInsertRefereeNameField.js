import TextC from "../components/customText";
import {ActivityIndicator, TextInput, View} from 'react-native';
import {style} from '../assets/styles';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {useState} from "react";
import * as SportFunctions from "./functions/SportFunctions";

export function getAdminInsertRefereeNameField(match) {
    const [oldRefName, setOldRefName] = useState(match.refereeName ?? '');
    const [refName, setRefName] = useState(oldRefName);
    const [isTryingSave, setIsTryingSave] = useState(false);
    const [saved, setSaved] = useState(false);

    const submit = () => {
        if (refName !== oldRefName) {
            setIsTryingSave(true);
            let postData = {'refereeName': refName};

            SportFunctions.saveRefereeName(match, postData, setSaved)
                .finally(() => {
                    setOldRefName(refName);
                    setIsTryingSave(false)
                });
        }
    }

    return (
        match ?
            (match.isTime2confirm ?
                    (match.refereeName ?
                        <TextC numberOfLines={1} style={style().textGreen}>
                            <TextC style={style().textViolet}>SR: </TextC> {match.refereeName}
                        </TextC> : null)
                    :
                    <TextC>SR:{' '}
                        <View>
                            <TextInput style={[style().textInput, {borderColor: refName !== '' ? 'green' : 'red'}]}
                                       disabled={isTryingSave}
                                       onChangeText={setRefName}
                                       onFocus={() => setSaved(false)}
                                       onBlur={submit}
                                       keyboardType="default"
                                       maxLength={32}
                                       placeholder="hier SR eintragen"
                                       value={refName ?? ''}
                            />
                            {saved ?
                                <Icon name="checkbox-marked-circle" size={24}
                                      style={{position: 'absolute', right: 2, top: 2, color: 'green'}}/>
                                : null}
                            {isTryingSave ?
                                <ActivityIndicator size={24} color="green"
                                                   style={{
                                                       position: 'absolute',
                                                       right: 2,
                                                       top: 2,
                                                       color: 'green'
                                                   }}/> : null}
                        </View>
                    </TextC>
            ) : null
    );
}

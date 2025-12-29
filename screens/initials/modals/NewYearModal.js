import TextC from "../../../components/customText";
import {useState} from 'react';
import {Modal, Pressable, TextInput, View} from 'react-native';
import {style} from '../../../assets/styles.js';
import fetchApi from "../../../components/fetchApi";
import {isValid, parse} from "date-fns";
import {isNumber} from "../../../components/functions/CheckFunctions";

export default function NewYearModal({
                                         setModalVisible,
                                         modalVisible,
                                         loadScreenData,
                                         oldYear
                                     }) {
    const [name, setName] = useState(oldYear.name + 1);
    const [day1, setDay1] = useState(getNewDay(oldYear.day1));
    const [day2, setDay2] = useState(getNewDay(oldYear.day2));
    const [daysCount, setDaysCount] = useState(oldYear.daysCount ?? '');
    const [teamsCount, setTeamsCount] = useState(oldYear.teamsCount ?? '');
    const [usernamePW, setUsernamePW] = useState('');
    const [textPWWrongVisible, setTextPWWrongVisible] = useState(false);

    function getNewDay(day) {
        let newYear = oldYear.name + 1;
        let isLeap = new Date(newYear, 1, 29).getMonth() === 1;

        return day ?
            newYear.toString()
            + '-' + day.substring(5, 7)
            + '-' + (parseInt(day.substring(8, 10)) - (isLeap ? 2 : 1)).toString()
            : '';
    }

    const saveNewYear = () => {
        if (checkAllInput() && usernamePW !== '') {
            setTextPWWrongVisible(false);
            let postData = {
                name: name,
                day1: day1,
                day2: day2,
                daysCount: daysCount,
                teamsCount: teamsCount,
                password: usernamePW
            };

            fetchApi('years/new', 'POST', postData)
                .then(json => {
                    if (json && json.status === 'success') {
                        setModalVisible(false);
                        setUsernamePW('');
                        loadScreenData();
                    } else {
                        setTextPWWrongVisible(true);
                    }
                })
                .catch(error => console.error(error));
        }
    };

    function checkName(name1) {
        return isNumber(name1.toString()) && parseInt(name1).toString() === name1.toString() && name1 > oldYear.name && name1 > 0;
    }

    function checkDate(day) {
        let day1 = day.trim();
        return day1.substring(0, 4) === name.toString() && isValid(parse(day1, 'yyyy-MM-dd', new Date()));
    }

    function checkValue(value) {
        return isNumber(value.toString()) && parseInt(value).toString() === value.toString() && value > 0;
    }

    function checkAllInput() {
        return checkName(name) && checkDate(day1) && (day2 === '' || checkDate(day2)) && checkValue(daysCount) && checkValue(teamsCount);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}>
            <View style={style().centeredView}>
                <View style={style().modalView}>
                    <TextC style={style().big3}>Neues Turnier(jahr) erstellen und dorthin wechseln:</TextC>
                    <TextC>{'\n'}Jahr/Name:{' '}
                        <TextInput
                            style={[style().textInput, {borderColor: checkName(name) ? 'green' : 'red'}]}
                            onChangeText={setName}
                            keyboardType="numeric"
                            placeholder="hier Name/Jahr eintragen"
                            value={name.toString()}
                            maxLength={4}
                        />
                    </TextC>
                    <TextC>{'\n'}Tag 1:{' '}
                        <TextInput
                            style={[style().textInput, {borderColor: checkDate(day1) ? 'green' : 'red'}]}
                            onChangeText={setDay1}
                            placeholder=""
                            keyboardType="numeric"
                            value={day1}
                            maxLength={10}
                        /> Format: yyyy-MM-dd
                    </TextC>
                    <TextC>Tag 2:{' '}
                        <TextInput
                            style={[style().textInput, {borderColor: day2 === '' || checkDate(day2) ? 'green' : 'red'}]}
                            onChangeText={setDay2}
                            placeholder=""
                            keyboardType="numeric"
                            value={day2 ?? ''}
                            maxLength={10}
                        /> Format: yyyy-MM-dd
                    </TextC>
                    <TextC>{'\n'}Anzahl Tage:{' '}
                        <TextInput
                            style={[style().textInput, {borderColor: checkValue(daysCount) ? 'green' : 'red'}]}
                            onChangeText={setDaysCount}
                            placeholder="hier Anzahl eintragen"
                            keyboardType="numeric"
                            value={daysCount}
                            maxLength={3}
                        />
                    </TextC>
                    <TextC>{'\n'}Anzahl Teams:{' '}
                        <TextInput
                            style={[style().textInput, {borderColor: checkValue(teamsCount) ? 'green' : 'red'}]}
                            onChangeText={setTeamsCount}
                            placeholder="hier Anzahl eintragen"
                            keyboardType="numeric"
                            value={teamsCount}
                            maxLength={3}
                        />
                    </TextC>
                    {checkAllInput() ?
                        <View>
                            <TextC>{'\n\n'}Bist du sicher?</TextC>
                            <TextC>Hier bitte Admin-Passwort eingeben:</TextC>
                            <TextInput
                                style={[style().textInput, {borderColor: usernamePW !== '' && !textPWWrongVisible ? 'green' : 'red'}]}
                                onChangeText={setUsernamePW}
                                secureTextEntry={true}
                                placeholder="Hier Passwort eingeben"
                                keyboardType="default"
                                value={usernamePW}
                                maxLength={16}
                                onSubmitEditing={() => saveNewYear()}
                            />
                        </View> : null}
                    {textPWWrongVisible ?
                        <TextC style={style().failureText}>falsches PW?</TextC> : null}
                    {checkAllInput() && usernamePW !== '' ?
                        <Pressable
                            style={[style().button1, style().buttonGreen]}
                            onPress={() => saveNewYear()}>
                            <TextC numberOfLines={1} style={style().textButton1}>Speichern</TextC>
                        </Pressable> : null}
                    <TextC>{'\n'}</TextC>
                    <Pressable
                        style={[style().button1, style().buttonGrey]}
                        onPress={() => setModalVisible(false)}>
                        <TextC style={style().textButton1}>Schließen</TextC>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

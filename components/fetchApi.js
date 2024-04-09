import * as React from 'react';
import * as DateFunctions from "./functions/DateFunctions";

export default function fetchApi(address, method, postData, docMode) {
    let url = '';

    if (window?.location?.hostname === 'localhost') {
        url = 'http://localhost/quapp-cakephp/';
    } else {
        url = 'https://api.quattfo.de/';
    }

    if (method === 'POST') {
        let formData = new FormData();

        for (const [key, value] of Object.entries(postData)) {
            formData.append(key, value);
        }

        return fetch(url + address, {
            method: 'POST',
            body: formData,
        }).then(response => docMode === 'pdf' ? response : response.json())

    } else {
        return fetch(url + address, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(
                function (json) {
                    global.settings = json.year.settings;
                    global.currentDayName = DateFunctions.getDateFormatted(json.year.day);
                    global.currentYearName = json.year.name;
                    global.currentYearId = json.year.id;

                    return json;
                })
    }
}

import * as DateFunctions from "./functions/DateFunctions";

export default function fetchApi(address, method, postData, docMode) {
    address = global.baseUrl + address + global.baseUrlExt;

    if (method === 'POST') {
        let formData = new FormData();

        for (const [key, value] of Object.entries(postData)) {
            formData.append(key, value);
        }

        return fetch(address, {
            method: 'POST',
            body: formData,
        }).then(response => docMode === 'pdf' ? response : response.json())

    } else {
        return fetch(address, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(
                function (json) {
                    global.settings = json.year.settings;
                    global.currentDayName = DateFunctions.getDateFormatted(json.year.day);
                    global.currentYear = json.year;

                    return json;
                })
    }
}

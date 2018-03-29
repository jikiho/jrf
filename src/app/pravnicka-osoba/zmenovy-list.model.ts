/**
 * "Pravnicka osoba - Zmenove listy" feature model.
 */
export class ZmenovyListModel {
    state = {
        udaje: ''
    };

    zivnost = [];

    value = {
        puvodniUdaj: null,
        novyUdaj: null
    };

    constructor(value: any) {
        Object.assign(this, value);
    }
}

/**
 * "Pravnicka osoba - Podnikatel" feature model.
 */
export class PodnikatelModel {
    state = {
        completePodnikatel: false,
        completeAdresaSidla: false,
        nazev: '',
        ico: ''
    };

    value = {
        podnikatel: {
            nazev: null,
            pravniForma: null,
            ico: null
        },
        adresaSidla: {
            ulice: null,
            cisloDomovni: null,
            cisloOrientacni: null,
            psc: null,
            obec: null,
            castObce: null,
            okres: null,
            stat: null
        }
    };

    constructor(value: any) {
        Object.assign(this, value);
    }
}

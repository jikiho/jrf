/**
 * "Pravnicka osoba - Podnikatel" feature model.
 */
export class PodnikatelModel {
    completePodnikatel: boolean = false;
    completeAdresa: boolean = false;
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
    overview = {
        nazev: '',
        ico: ''
    };
}

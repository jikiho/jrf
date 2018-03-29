/**
 * "Pravnicka osoba - Zivnosti" feature model.
 */
export class ZivnostModel {
    state = {
        kodZivnosti: '',
        predmetPodnikani: ''
    };

    druhZivnosti = null;

    skupinaZivnosti = null;

    zivnost = null;

    oborCinnosti = null;

    constructor(value: any) {
        Object.assign(this, value);
    }
}

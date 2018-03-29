/**
 * "Pravnicka osoba - Ostatni" feature model.
 */
import {Model} from '../model';

export class OstatniPrilohaModel extends Model<OstatniPrilohaModel> {
    hash: string;

    file: File;

    value = {
        uradyPrilohy: {}
    };
}

export class OstatniModel {
    state = {
        pocetPriloh: 0
    };

    pocetPriloh = {fu: 0, zu: 0, up: 0};

    velikostPriloh = 0;

    prilohy: OstatniPrilohaModel[] = [];

    value = {
        uradyPrilohy: {}
    };

    constructor(value: any) {
        Object.assign(this, value);
    }
}

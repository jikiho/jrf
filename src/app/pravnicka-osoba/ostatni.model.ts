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
    pocetPriloh = {fu: 0, zu: 0, up: 0};

    velikostPriloh = 0;

    prilohy: OstatniPrilohaModel[] = [];

    value = {
        uradyPrilohy: {}
    };

    overview = {
        pocetPriloh: 0
    }
}

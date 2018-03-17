/**
 * "Pravnicka osoba - Ostatni" feature model.
 */
import {Model} from '../model';

export class OstatniPrilohyModel extends Model<OstatniPrilohyModel> {
    hash: string;
    file: File;
}

export class OstatniModel {
    overview: string;
    uradyPrilohy = {};
    pocetPriloh = {fu: 0, zu: 0, up: 0};
    velikostPriloh = 0;
    prilohy: OstatniPrilohyModel[] = [];
}

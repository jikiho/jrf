/**
 * "Pravnicka osoba" feature data content model.
 */
import {ContentModel} from '../content.model';
import {OstatniModel} from './ostatni.model';
import {PodnikatelModel} from './podnikatel.model';
import {ZivnostModel} from './zivnost.model';
import {ZmenovyListModel} from './zmenovy-list.model';

export class DataContentModel {
    podnikatel = new ContentModel(PodnikatelModel);
    zivnosti = new ContentModel(ZivnostModel, 0);
    ostatni = new ContentModel(OstatniModel);
    zmenoveListy = new ContentModel(ZmenovyListModel, 3);
}

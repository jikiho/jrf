/**
 * "Pravnicka osoba" feature contents service.
 */
import {Injectable} from '@angular/core';

import {ContentModel} from '../content.model';
import {OstatniModel} from './ostatni.model';
import {PodnikatelDataService} from './podnikatel-data.service';
import {PodnikatelModel} from './podnikatel.model';
import {UtilsModule as utils} from '../utils.module';
//import {XmlModel} from './xml.model';
import {xmlParser} from '../feature.module';
import {ZivnostModel} from './zivnost.model';
import {ZmenovyListModel} from './zmenovy-list.model';

@Injectable()
export class ContentsService {
    /**
     * Feature contents.
     */
    podnikatel = new ContentModel(PodnikatelModel);
    zivnosti = new ContentModel(ZivnostModel, 0);
    ostatni = new ContentModel(OstatniModel);
    zmenoveListy = new ContentModel(ZmenovyListModel, 3);

    constructor(private podnikatelData: PodnikatelDataService) {
    }

    /**
     * Flag...
     */
    get dirty(): boolean {
//TODO
        return true;
    }

    /**
     * Creates new contents.
     */
    create(value: any = {}): boolean {
        this.podnikatel.create(value.podnikatel);
        this.zivnosti.create(value.zivnosti);
        this.ostatni.create(value.ostatni);
        this.zmenoveListy.create(value.zmenoveListy);

        return true;
    }

    /**
     * Loads contents from a file.
     */
    load(file: File, complete?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            utils.read(file, 'readAsText')
                .then((result) => {
                    xmlParser.parseString(result, (error, result) => {
                        if (error) {
                            reject({
                                message: `File XML parsing failed: "${file.name}"`,
                                error
                            });
                        }
                        else {
                            resolve({
                                podnikatel: this.podnikatelData.finishValue(result)
//TODO: zivnosti, ostatni, zmenoveListy
                            });
                        }
                    });
                })
                .catch((error) => {
                    reject({
                        message: `File loading failure: "${file.name}"`,
                        error
                    });
                });
        });
    }

    /**
     * Saves contents to a file.
     */
    save(): boolean {
//TODO
        return true;
    }

    /**
     * Validates contents.
     */
    validate(): string[] | null {
//TODO
        return null;
    }
}

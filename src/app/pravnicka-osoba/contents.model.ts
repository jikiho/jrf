/**
 * "Pravnicka osoba" feature contents model.
 */
import {ContentModel} from '../content.model';
import {OstatniModel} from './ostatni.model';
import {PodnikatelModel} from './podnikatel.model';
import {UtilsModule as utils} from '../utils.module';
//import {XmlModel} from './xml.model';
import {xmlParser} from '../feature.module';
import {ZivnostModel} from './zivnost.model';
import {ZmenovyListModel} from './zmenovy-list.model';

export class ContentsModel {
    /**
     * Feature contents.
     */
    podnikatel = new ContentModel(PodnikatelModel);
    zivnosti = new ContentModel(ZivnostModel, 0);
    ostatni = new ContentModel(OstatniModel);
    zmenoveListy = new ContentModel(ZmenovyListModel, 3);

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
    create(value: any = {}): ContentsModel {
        this.podnikatel.create(value.podnikatel);
        this.zivnosti.create(value.zivnosti);
        this.ostatni.create(value.ostatni);
        this.zmenoveListy.create(value.zmenoveListy);

        return this;
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
                                podnikatel: PodnikatelModel.value(result),
                                //zivnosti: ZivnostModel.value(result),
                                //ostatni: OstatniModel.value(result),
                                //zmenoveListy: ZmenovyListModel.value(result)
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

    private transformSave(): any {
//TODO
        return {};
    }

    /**
     * Validates contents.
     */
    validate(): string[] | null {
//TODO
        return null;
    }
}

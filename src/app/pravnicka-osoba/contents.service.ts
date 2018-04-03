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
import {xmlBuilder, xmlParser} from '../feature.module';
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
                            resolve(this.finishValue(result));
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
     * Saves contents to a XML file.
     */
    save(): boolean {
        const date = utils.now('yyyyMMdd'),
            name = `jrf-${date}.xml`,
            value = this.prepareValue(),
            content = xmlBuilder.buildObject(value),
            file = utils.xmlFile(content, name);

        utils.saveFile(file);

        return file.size > 0;
    }

    /**
     * Validates contents.
     */
    validate(): string[] | null {
//TODO
        return null;
    }

    /**
     * Prepares a value with contents for XML builder.
     */
    prepareValue(): any {
        const value = {
                Podani: {
                    $: {
                        version: '2.6',
                        xmlns: 'urn:cz:isvs:rzp:schemas:PodaniPublic:v1',
                        'xmlns:ns2': 'http://www.w3.org/2000/09/xmldsig#'
                    },
                    AplikaceNazev: 'i.cz:Elektronické podání - JRF',
                    NovaOpravneniPO: {
                        ZakladniCastPO: {
                            Podnikatel: {},
                            SidloAdresa: {}
                        }
                    }
                }
            };

        this.podnikatelData.prepareValue(value, this.podnikatel);
//TODO: zivnosti, ostatni, zmenoveListy

        return value;
    }

    /**
     * Finishes a value with contents from XML parser result.
     */
    private finishValue(result: any): any {
        return {
            podnikatel: this.podnikatelData.finishValue(result)
//TODO: zivnosti, ostatni, zmenoveListy
        };
    }
}

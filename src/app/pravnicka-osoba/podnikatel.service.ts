/**
 * "Pravnicka osoba - Podnikatel" feature service.
 */
import {Injectable} from '@angular/core';

import {AppService} from '../app.service';
import {DataService} from './data.service';
import {HttpService} from '../http/http.service';
import {UtilsModule as utils} from '../utils.module';
import {xmlBuilder, xmlParser} from '../feature.module';

@Injectable()
export class PodnikatelService {
    constructor(private app: AppService, private data: DataService, private http: HttpService) {
    }

    /**
     * Request "overeni adresy".
     */
    requestOvereniAdresy(value: any): Promise<any> {
        const url = 'api:', //resource
            content = PodnikatelService.xmlOvereniAdresy(value, {
                stat: this.data.refs.stat.CZ.Kod
            }),
            file = utils.xmlFile(content),
            body = utils.formData({
                VSS_SERV: 'ZUMJRFADR',
                filename: file
            });

        return new Promise((resolve, reject) => {
            this.http.postXml(url, body).subscribe(
                (response) => {
                    xmlParser.parseString(response.body, (error, result) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(PodnikatelService.valueOvereniAdresy(result));
                        }
                    });
                },
                (error) => {
                    reject({
                        message: `Resource loading failure: "${url}"`,
                        error
                    });
                }
            );
        });
    }

    /**
     * Transforms a value for XML builder.
     */
    static xmlOvereniAdresy(value: any, defaults: any = {}): string {
        return xmlBuilder.buildObject({
            KlientPozadavek: {
                $: {
                    version: '1.0',
                    xmlns: 'urn:cz:isvs:rzp:schemas:Podani:v1'
                },
                OvereniAdresy: {
                    Stat: {
                        $: {
                            kod: value.stat || defaults.stat
                        }
                    },
                    Obec: value.obec,
                    CastObce: value.castObce,
                    Ulice: value.ulice,
                    CisloDomovni: value.cisloDomovni,
                    CisloOrientacni: value.cisloOrientacni,
                    PSC: value.psc
                }
            }
        });
    }

    /**
     * Transforms XML parser result to a value.
     */
    static valueOvereniAdresy(result: any): any {
        let data = result.KlientOdpoved.OvereniAdresy.Adresa,
            items = Array.isArray(data) ? data : data && [data] || [];

        return items.map((item) => ({
            stat: item.Stat.$.kod,
            obec: item.Obec._,
            castObce: item.CastObce._,
            ulice: item.Ulice,
            cisloDomovni: item.CisloDomovni,
            cisloOrientacni: item.CisloOrientacni,
            psc: item.PSC
        }));
    }
}

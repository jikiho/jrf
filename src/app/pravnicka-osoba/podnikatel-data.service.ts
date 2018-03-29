/**
 * "Pravnicka osoba - Podnikatel" feature data service.
 */
import {Injectable} from '@angular/core';

import {DataService} from './data.service';
import {HttpService} from '../http/http.service';
import {UtilsModule as utils} from '../utils.module';
import {xmlBuilder, xmlParser} from '../feature.module';

@Injectable()
export class PodnikatelDataService {
    constructor(private data: DataService, private http: HttpService) {
    }

    /**
     * Prepares a model value for XML builder.
     */
    prepareValue(value: any): string {
        return '';
    }

    /**
     * Finishes a model value from XML parser result.
     */
    finishValue(result: any): any {
        const data = result.Podani.NovaOpravneniPO,
            podnikatel = utils.get(data, 'ZakladniCastPO.Podnikatel') || {},
            adresaSidla = utils.get(data, 'ZakladniCastPO.SidloAdresa') || {};

        return {
            value: {
                podnikatel: {
                    nazev: podnikatel.ObchodniJmeno,
                    pravniForma: podnikatel.PravniForma.$.kod,
                    ico: podnikatel.ICO
                },
                adresaSidla: {
                    ulice: adresaSidla.UliceNazev,
                    cisloDomovni: adresaSidla.CisloDomovniHodnota,
                    cisloOrientacni: [adresaSidla.CisloOrientacni, adresaSidla.CisloOrientacniZnak].join(''),
                    psc: adresaSidla.PSC,
                    obec: adresaSidla.ObecNazev,
                    castObce: adresaSidla.CastObceNazev,
                    okres: adresaSidla.OkresKod,
                    stat: adresaSidla.StatKod
                }
            }
        };
    }

    /**
     * Requests "overeni adresy".
     */
    requestOvereniAdresy(value: any): Promise<any> {
        const url = 'api:', //resource
            content = this.prepareOvereniAdresy(value, {
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
                            resolve(this.finishOvereniAdresy(result));
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
     * Prepares a value for XML builder.
     */
    private prepareOvereniAdresy(value: any, defaults: any = {}): string {
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
     * Finishes a value from XML parser result.
     */
    private finishOvereniAdresy(result: any): any {
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

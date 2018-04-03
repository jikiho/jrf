/**
 * "Pravnicka osoba - Podnikatel" feature data service.
 */
import {Injectable} from '@angular/core';

import {ContentModel} from '../content.model';
import {DataService} from './data.service';
import {HttpService} from '../http/http.service';
import {PodnikatelModel} from './podnikatel.model';
import {UtilsModule as utils} from '../utils.module';
import {xmlBuilder, xmlParser} from '../feature.module';

@Injectable()
export class PodnikatelDataService {
    constructor(private data: DataService, private http: HttpService) {
    }

    /**
     * Prepares a value with contents for XML builder.
     */
    prepareValue(value: any, content: ContentModel<PodnikatelModel>): any {
        const entry = content.entry,
            podnikatel = entry.value.podnikatel,
            adresaSidla = entry.value.adresaSidla,
            cisloOrientacni = (adresaSidla.cisloOrientacni || '').match(/^(\d+)([a-z])?$/i);

        Object.assign(value.Podani.NovaOpravneniPO, {
            ZakladniCastPO: {
                Podnikatel: {
                    ObchodniJmeno: podnikatel.nazev,
                    PravniForma: {
                        $: {
                            kod: podnikatel.pravniForma
                        }
                    },
                    ICO: podnikatel.ico
                },
                SidloAdresa: {
                    UliceNazev: adresaSidla.ulice,
                    CisloDomovniHodnota: adresaSidla.cisloDomovni,
                    CisloOrientacni: cisloOrientacni ? cisloOrientacni[1] : adresaSidla.cisloOrientacni,
                    CisloOrientacniZnak: cisloOrientacni && cisloOrientacni[2],
                    PSC: adresaSidla.psc,
                    ObecNazev: adresaSidla.obec,
                    CastObceNazev: adresaSidla.castObce,
                    OkresKod: adresaSidla.okres,
                    StatKod: adresaSidla.stat
                }
            }
        });
    }

    /**
     * Finishes a model value from XML parser result.
     */
    finishValue(result: any): any {
        const data = result.Podani.NovaOpravneniPO,
            Podnikatel = utils.get(data, 'ZakladniCastPO.Podnikatel') || {},
            SidloAdresa = utils.get(data, 'ZakladniCastPO.SidloAdresa') || {};

        return {
            value: {
                podnikatel: {
                    nazev: Podnikatel.ObchodniJmeno,
                    pravniForma: Podnikatel.PravniForma.$.kod,
                    ico: Podnikatel.ICO
                },
                adresaSidla: {
                    ulice: SidloAdresa.UliceNazev,
                    cisloDomovni: SidloAdresa.CisloDomovniHodnota,
                    cisloOrientacni: [SidloAdresa.CisloOrientacni, SidloAdresa.CisloOrientacniZnak].join(''),
                    psc: SidloAdresa.PSC,
                    obec: SidloAdresa.ObecNazev,
                    castObce: SidloAdresa.CastObceNazev,
                    okres: SidloAdresa.OkresKod,
                    stat: SidloAdresa.StatKod
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
                    Ulice: value.ulice,
                    CisloDomovni: value.cisloDomovni,
                    CisloOrientacni: value.cisloOrientacni,
                    PSC: value.psc,
                    Obec: value.obec,
                    CastObce: value.castObce,
                    Stat: {
                        $: {
                            kod: value.stat || defaults.stat
                        }
                    }
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
            ulice: item.Ulice,
            cisloDomovni: item.CisloDomovni,
            cisloOrientacni: item.CisloOrientacni,
            psc: item.PSC,
            obec: item.Obec._,
            castObce: item.CastObce._,
            okres: item.Okres.$.kod,
            stat: item.Stat.$.kod
        }));
    }
}

/**
 * "Pravnicka osoba - Podnikatel" feature model.
 */
import {UtilsModule as utils} from '../utils.module';

export class PodnikatelModel {
    state = {
        completePodnikatel: false,
        completeAdresaSidla: false,
        nazev: '',
        ico: ''
    };

    value = {
        podnikatel: {
            nazev: null,
            pravniForma: null,
            ico: null
        },
        adresaSidla: {
            ulice: null,
            cisloDomovni: null,
            cisloOrientacni: null,
            psc: null,
            obec: null,
            castObce: null,
            okres: null,
            stat: null
        }
    };

    constructor(value: any) {
        Object.assign(this, value);
    }

    /**
     * Transforms a model value for XML builder.
     */
    static xml(value: any): string {
        return '';
    }

    /**
     * Transforms XML parser result to a model value.
     */
    static value(result: any): any {
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
}

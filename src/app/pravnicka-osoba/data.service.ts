/**
 * "Pravnicka osoba" feature data service.
 */
//TODO: load/parse error handling
import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {Builder, Parser} from 'xml2js';

import {AppService} from '../app.service';
import {DataContentModel} from './data-content.model';
import {HttpService} from '../http/http.service';
import {UtilsModule as utils} from '../utils.module';
//import {XmlModel} from './xml.model';

@Injectable()
export class DataService {
    builder = new Builder();

    parser = new Parser({
        explicitArray: false
    });

    /**
     * Features content.
     */
    content: DataContentModel;

    /**
     * List...
     */
    pravniForma$ = new BehaviorSubject<any[]>(null);
    okres$ = new BehaviorSubject<any[]>(null);
    stat$ = new BehaviorSubject<any[]>(null);
    druhZivnosti$ = new BehaviorSubject<any[]>(null);
    skupinaZivnosti$ = new BehaviorSubject<any>(null);
    zivnost$ = new BehaviorSubject<any>(null);
    oborCinnosti$ = new BehaviorSubject<any>(null);

    /**
     * Number of options.
     */
    counts = {};

    /**
     * Default single option values.
     */
    defaults = {};

    /**
     * Various quick references.
     */
    refs = {
        stat: {
            CZ: null
        }
    };

    constructor(private app: AppService, private http: HttpService) {
        this.content = new DataContentModel();
        this.loadCiselnik('./assets/pravni-forma.xml', this.pravniForma$);
        this.loadCiselnik('./assets/uir-okres.xml', this.okres$);
        this.loadCiselnik('./assets/stat.xml', this.stat$, null, this.finishStat);
        this.loadCiselnik('./assets/druh-zivnosti.xml', this.druhZivnosti$);
        this.loadCiselnik('./assets/zivnost.xml', null, null, this.finishZivnost);
        this.loadCiselnik('./assets/obor-cinnosti.xml', this.oborCinnosti$, this.transformOborCinnosti);
    }

    /**
     * Requests...
     */

    /**
     * Creates a new content.
     */
    create(): DataContentModel {
        this.content = new DataContentModel();

        return this.content;
    }

    /**
     * Loads and processes options from a resource.
     */
    private loadCiselnik(url: string, subject?: BehaviorSubject<any[]>, tr?: Function, fn?: Function) {
        this.http.getXml(url).subscribe(
            (response) => {
                this.parser.parseString(response.body, (error, result) => {
                    if (error) {
                        this.app.failure(`Resource XML parsing failed: "${url}"`, error);
                    }
                    else {
                        let items = result.Ciselnik.Polozka;

                        if (tr) {
                            items = items.map((item) => tr(item));
                        }

                        if (fn) {
                            subject = fn.call(this, items, subject);
                        }

                        if (subject) {
                            subject.next(items);
                        }
                    }
                });
            },
            (error) => {
                this.app.failure(`Resource loading failed: "${url}"`, error);
            }
        );
    }

    /**
     * Analyzes options and updates corresponding counts and defaults.
     */
    private analyze(items: any[], key: string, counts: any = {}, defaults: any = {}) {
        items.forEach((item) => {
            const value = item[key];

            let count = counts[value];

            if (count) {
                delete defaults[value];
            }
            else {
                this.defaults[value] = item;
                count = 0;
            }

            counts[value] = count + 1;
        });
    }

    /**
     * Transforms "okres" options.
     */
    private transformOborCinnosti(item: any): any {
        return {
            Druh: item.Poznamka2,
            Skupina: 'Z010',
            Zivnost: 'Z01000',
            Kod: item.Poznamka,
            Cislo: item.Kod,
            Hodnota: item.Hodnota
        };
    }

    /**
     * Processes "stat" options.
     */
    private finishStat(items: any[], subject?: BehaviorSubject<any>): any {
        this.refs.stat.CZ = utils.filter(items, {Kod: 'CZ'})[0];

        return subject;
    }

    /**
     * Processes "zivnosti" options.
     */
    private finishZivnost(items: any[], subject?: BehaviorSubject<any>): any {
        const groups = [],
            values = [];

        items.forEach((item) => {
            const group = item.Poznamka !== '0',
                items = group ? groups : values;

            items.push({
                Druh: item.Poznamka2,
                Skupina: group ? undefined : item.Kod.substr(0, 4),
                Kod: group ? item.Kod.substr(0, 4) : item.Kod,
                Hodnota: item.Hodnota
            });
        });

        groups.push({
            Druh: 'O',
            Skupina: undefined,
            Kod: 'Z010',
            Hodnota: undefined
        });

        this.analyze(groups, 'Druh', this.counts, this.defaults);
        this.analyze(values, 'Skupina', this.counts, this.defaults);

        this.skupinaZivnosti$.next(groups);

        this.zivnost$.next(values);
    }

    /**
     * "Overeni adresy" request.
     */
    requestOvereniAdresy(value: any): Observable<any> {
        const url = 'api:', //resource
            content = this.xmlOvereniAdresy(value),
            file = utils.xmlFile(content),
            body = utils.formData({
                VSS_SERV: 'ZUMJRFADR',
                filename: file
            });

        return new Observable((observer) => {
            this.http.postXml(url, body).subscribe(
                (response) => {
                    this.parser.parseString(response.body, (error, result) => {
                        if (error) {
                            observer.error(error);
                        }
                        else {
                            observer.next(this.mapOvereniAdresy(result));
                            observer.complete();
                        }
                    });
                },
                (error) => {
                    observer.error([error, `Resource loading failure: "${url}"`]);
                }
            );
        });
    }

    private xmlOvereniAdresy(value: any): string {
        return this.builder.buildObject({
            KlientPozadavek: {
                $: {
                    version: '1.0',
                    xmlns: 'urn:cz:isvs:rzp:schemas:Podani:v1'
                },
                OvereniAdresy: {
                    Stat: {
                        $: {
                            kod: value.stat || this.refs.stat.CZ.Kod
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

    private mapOvereniAdresy(result: any): any {
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

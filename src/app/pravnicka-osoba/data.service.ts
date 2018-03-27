/**
 * "Pravnicka osoba" feature data service.
 */
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';

import {AppService} from '../app.service';
import {ContentsModel} from './contents.model';
import {HttpService} from '../http/http.service';
import {UtilsModule as utils} from '../utils.module';
import {xmlParser} from '../feature.module';

@Injectable()
export class DataService {
    /**
     * Features content.
     */
    content = new ContentsModel();

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
        this.loadResources();
    }

    /**
     * Loads data from resources.
     */
    private loadResources() {
        this.loadCiselnik('./assets/pravni-forma.xml', this.pravniForma$);
        this.loadCiselnik('./assets/uir-okres.xml', this.okres$);
        this.loadCiselnik('./assets/stat.xml', this.stat$, null, this.finishStat);
        this.loadCiselnik('./assets/druh-zivnosti.xml', this.druhZivnosti$);
        this.loadCiselnik('./assets/zivnost.xml', null, null, this.finishZivnost);
        this.loadCiselnik('./assets/obor-cinnosti.xml', this.oborCinnosti$, this.transformOborCinnosti);
    }

    /**
     * Loads and processes options from a resource.
     */
    private loadCiselnik(url: string, subject?: BehaviorSubject<any[]>, tr?: Function, fn?: Function) {
        this.http.getXml(url).subscribe(
            (response) => {
                xmlParser.parseString(response.body, (error, result) => {
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
    private analyzeCiselnik(items: any[], key: string, counts: any = {}, defaults: any = {}) {
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
     * Transforms "obor cinnosti" options.
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
                items = group ? groups : values,
                Skupina = group ? {} : {
                    Skupina: item.Kod.substr(0, 4)
                };

            items.push({
                Druh: item.Poznamka2,
                ...Skupina,
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

        this.analyzeCiselnik(groups, 'Druh', this.counts, this.defaults);
        this.analyzeCiselnik(values, 'Skupina', this.counts, this.defaults);

        this.skupinaZivnosti$.next(groups);

        this.zivnost$.next(values);
    }
}

/**
 * "Pravnicka osoba" feature data service.
 */
//TODO: load/parse error handling
import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {Parser} from 'xml2js';

import {ContentModel} from '../content.model';
import {HttpService} from '../http/http.service';
import {Model} from '../model';
import {XmlModel} from './xml.model';

class DataContentModel {
    podnikatel: ContentModel;
    zivnosti: ContentModel;
    ostatni: ContentModel;
    zmenoveListy: ContentModel;
}

@Injectable()
export class DataService {
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

    private parser = new Parser({
        explicitArray: false
    });

    constructor(private http: HttpService) {
        this.content = new DataContentModel();

        this.loadCiselnik('./assets/pravni-forma.xml', this.pravniForma$);
        this.loadCiselnik('./assets/uir-okres.xml', this.okres$);
        this.loadCiselnik('./assets/stat.xml', this.stat$);
        this.loadCiselnik('./assets/druh-zivnosti.xml', this.druhZivnosti$);
        this.loadCiselnikZivnost('./assets/zivnost.xml');
        this.loadCiselnikOborCinnosti('./assets/obor-cinnosti.xml');
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

    private loadCiselnik(url: string, subject: BehaviorSubject<any[]>) {
        this.http.getXml(url).subscribe((response) => {
            this.parser.parseString(response.body, (error, result) => {
                subject.next(result.Ciselnik.Polozka);
            });
        });
    }

    private loadCiselnikZivnost(url: string) {
        this.http.getXml(url).subscribe((response) => {
            this.parser.parseString(response.body, (error, result) => {
                const items = result.Ciselnik.Polozka,
                    groups = [],
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
            });
        });
    }

    private loadCiselnikOborCinnosti(url: string) {
        this.http.getXml(url).subscribe((response) => {
            this.parser.parseString(response.body, (error, result) => {
                const items = result.Ciselnik.Polozka.map((item) => ({
                    Druh: item.Poznamka2,
                    Skupina: 'Z010',
                    Zivnost: 'Z01000',
                    Kod: item.Poznamka,
                    Cislo: item.Kod,
                    Hodnota: item.Hodnota
                }));

                this.oborCinnosti$.next(items);
            });
        });
    }
}

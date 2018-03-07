/**
 * "Pravnicka osoba" feature data service.
 */
//TODO: load/parse error handling
import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {Parser} from 'xml2js';

import {HttpService} from '../http/http.service';
import {Model} from '../model';
import {XmlModel} from './xml.model';

class Storage extends Model<Storage> {
    podnikatel = {};
    zivnosti = {};
    odpovedniZastupci = {};
    ostatni = {};
    zmenoveListy = {};
}

@Injectable()
export class DataService {
    pravniForma$ = new BehaviorSubject<any[]>(null);
    okres$ = new BehaviorSubject<any[]>(null);
    stat$ = new BehaviorSubject<any[]>(null);
    druhZivnosti$ = new BehaviorSubject<any[]>(null);
    skupinaZivnosti$ = new BehaviorSubject<any>(null);
    zivnost$ = new BehaviorSubject<any>(null);
    oborCinnosti$ = new BehaviorSubject<any>(null);

    /**
     * Feature data storage.
     */
    storage = new Storage();

    private parser = new Parser({
        explicitArray: false
    });

    constructor(private http: HttpService) {
        this.loadCiselnik('./assets/pravni-forma.xml', this.pravniForma$);
        this.loadCiselnik('./assets/uir-okres.xml', this.okres$);
        this.loadCiselnik('./assets/stat.xml', this.stat$);
        this.loadCiselnik('./assets/druh-zivnosti.xml', this.druhZivnosti$);
        this.loadCiselnikZivnost('./assets/zivnost.xml');
        this.loadCiselnik('./assets/obor-cinnosti.xml', this.oborCinnosti$);
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

                this.skupinaZivnosti$.next(groups);
                this.zivnost$.next(values);
            });
        });
    }
}

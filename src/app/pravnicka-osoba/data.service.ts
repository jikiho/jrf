/**
 * "Pravnicka osoba" feature data service.
 */
import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs/Rx';

import {HttpService} from '../http/http.service';
import {DataModel} from './data.model';

@Injectable()
export class DataService {
    data$ = new BehaviorSubject<DataModel>(null);

    constructor(private http: HttpService) {
    }
}

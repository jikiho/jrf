/**
 * "Pravnicka osoba - Zmenove listy" feature component.
 */
import {Component, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

import {AppService} from '../app.service';
import {DataService} from './data.service';

@Component({
    templateUrl: './zmenove-listy.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZmenoveListyComponent {
    @ViewChild('form')
    private form: NgForm;

    constructor(private app: AppService, private data: DataService) {
    }
}

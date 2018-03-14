/**
 * "Pravnicka osoba - Ostatni" feature component.
 */
import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

import {ContentModel} from '../content.model';
import {DataService} from './data.service';
import {OstatniModel} from './ostatni.model';

@Component({
    templateUrl: './ostatni.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OstatniComponent implements OnInit, OnDestroy {
    /**
     * Feature content.
     */
    content: ContentModel<OstatniModel> = this.data.content.ostatni;

    @ViewChild('form')
    private form: NgForm;

    constructor(public data: DataService) {
    }

    ngOnInit() {
        this.content.init(this.form);
    }

    ngOnDestroy() {
        this.content.destroy();
    }
}

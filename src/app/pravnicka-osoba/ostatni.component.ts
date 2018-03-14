/**
 * "Pravnicka osoba - Ostatni" feature component.
 */
import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs/Rx';

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

    private subscriptions: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef,
            public data: DataService) {
    }

    ngOnInit() {
        this.content.init(this.form);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) =>
                subscription.unsubscribe());

        this.content.destroy();
    }
}

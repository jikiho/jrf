/**
 * "Pravnicka osoba - Ostatni" feature component.
 */
import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {BehaviorSubject, Subscription} from 'rxjs/Rx';

import {AppService} from '../app.service';
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
    content: ContentModel<OstatniModel>;

    @ViewChild('form')
    private form: NgForm;

    private synchronizer: Subscription | BehaviorSubject<OstatniModel[]>;

    constructor(private cdr: ChangeDetectorRef,
            app: AppService, public data: DataService) {

        this.content = this.data.content.ostatni = this.data.content.ostatni ||
                new ContentModel(app, OstatniModel);
    }

    ngOnInit() {
        this.synchronizer = this.content.init(this.form);
            // checked due to content toolbar entries async pipe
            //.subscribe(() => this.cdr.markForCheck());
    }

    ngOnDestroy() {
        if (this.synchronizer) {
            //this.synchronizer.unsubscribe();
        }

        this.content.destroy();
    }
}

/**
 * "Pravnicka osoba - Zmenove listy" feature component.
 */
import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {BehaviorSubject, Subscription} from 'rxjs/Rx';

import {AppService} from '../app.service';
import {ContentModel} from '../content.model';
import {DataService} from './data.service';
import {UtilsModule as utils} from '../utils.module';
import {ZmenovyListModel} from './zmenovy-list.model';

@Component({
    templateUrl: './zmenove-listy.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZmenoveListyComponent implements OnInit, OnDestroy {
    /**
     * Feature content.
     */
    content: ContentModel<ZmenovyListModel>;

    @ViewChild('form')
    private form: NgForm;

    private synchronizer: Subscription | BehaviorSubject<ZmenovyListModel[]>;

    constructor(private cdr: ChangeDetectorRef,
            app: AppService, public data: DataService) {
        this.content = this.data.content.zmenoveListy = this.data.content.zmenoveListy ||
                new ContentModel(app, ZmenovyListModel, 3);
    }

    ngOnInit() {
        this.synchronizer = this.content.init(this.form, (value) => this.update(value));
            // checked due to content toolbar entries async pipe
            //.subscribe(() => this.cdr.markForCheck());
    }

    ngOnDestroy() {
        if (this.synchronizer) {
            //this.synchronizer.unsubscribe();
        }

        this.content.destroy();
    }

    private update(value): any {
        const entry = this.content.entry;
        
        if (value.puvodniUdaj !== entry.puvodniUdaj ||
                value.novyUdaj !== entry.novyUdaj) {
            Object.assign(value, {
                zmenovyList: utils.dirty(value.puvodniUdaj, value.novyUdaj) ?
                        [value.puvodniUdaj, value.novyUdaj].join(' / ') : ''
            });
        }

        return value;
    }

    @ViewChild('input.puvodniUdaj')
    private inputPuvodniUdaj: ElementRef;

    @HostListener('document:keydown.alt.2')
    private focusPuvodniUdajOnKey() {
        this.inputPuvodniUdaj.nativeElement.focus();
    }

    @ViewChild('input.novyUdaj')
    private inputNovyUdaj: ElementRef;

    @HostListener('document:keydown.alt.3')
    private focusNovyUdajOnKey() {
        this.inputNovyUdaj.nativeElement.focus();
    }
}

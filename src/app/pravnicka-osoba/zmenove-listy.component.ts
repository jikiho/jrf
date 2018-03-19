/**
 * "Pravnicka osoba - Zmenove listy" feature component.
 */
import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Observable, Subscription} from 'rxjs/Rx';

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
    content: ContentModel<ZmenovyListModel> = this.data.content.zmenoveListy;

    @ViewChild('form')
    form: NgForm;

    @ViewChild('inputPuvodniUdaj')
    private inputPuvodniUdaj: ElementRef;

    @ViewChild('inputNovyUdaj')
    private inputNovyUdaj: ElementRef;

    private changes: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef,
            public data: DataService) {
    }

    ngOnInit() {
        setTimeout(() => {
            const control = this.form.control,
                reset = Observable.fromEvent(this.form['el'].nativeElement, 'reset');

            this.changes.push(control.get('puvodniUdaj').valueChanges.map((puvodniUdaj) => ({puvodniUdaj}))
                .merge(control.get('novyUdaj').valueChanges.map((novyUdaj) => ({novyUdaj})))
                .debounceTime(250)
                .merge(reset)
                .subscribe((changes) => this.update(changes)));
        });
    }

    ngOnDestroy() {
        this.changes.forEach((s) => s.unsubscribe());
    }

    /**
     * Updates...
     */
    private update(changes?: any) {
        const value = {...this.form.value, ...changes};

        this.content.patch({
            overview: changes && utils.filled(value.puvodniUdaj, value.novyUdaj) ?
                    [value.puvodniUdaj, value.novyUdaj].join(' / ') : ''
        });

        this.cdr.markForCheck();
    }

    /**
     * Controls...
     */
    @HostListener('document:keydown.alt.2')
    private focusPuvodniUdajOnKey() {
        this.inputPuvodniUdaj.nativeElement.focus();
    }

    @HostListener('document:keydown.alt.3')
    private focusNovyUdajOnKey() {
        this.inputNovyUdaj.nativeElement.focus();
    }
}

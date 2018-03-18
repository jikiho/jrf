/**
 * "Pravnicka osoba - Zivnosti" feature component.
 */
import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Observable, Subscription} from 'rxjs/Rx';

import {ContentModel} from '../content.model';
import {DataService} from './data.service';
import {UtilsModule as utils} from '../utils.module';
import {ZivnostModel} from './zivnost.model';

@Component({
    templateUrl: './zivnosti.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZivnostiComponent implements OnInit, OnDestroy {
    /**
     * Feature content.
     */
    content: ContentModel<ZivnostModel> = this.data.content.zivnosti;

    @ViewChild('form')
    form: NgForm;

    @ViewChild('inputDruhZivnosti')
    private inputDruhZivnosti: ElementRef;

    @ViewChild('inputSkupinaZivnosti')
    private inputSkupinaZivnosti: ElementRef;

    @ViewChild('inputZivnost')
    private inputZivnost: ElementRef;

    private changes: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef,
            public data: DataService) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.changes.push(Observable.fromEvent(this.inputDruhZivnosti.nativeElement, 'change')
                .merge(Observable.fromEvent(this.form['el'].nativeElement, 'reset'))
                .subscribe(() => this.updateDruhZivnosti()));

            this.changes.push(Observable.fromEvent(this.inputSkupinaZivnosti.nativeElement, 'change')
                .subscribe(() => this.updateSkupinaZivnosti()));

            this.changes.push(Observable.fromEvent(this.inputZivnost.nativeElement, 'change')
                .subscribe(() => this.updateZivnost()));
        });
    }

    ngOnDestroy() {
        this.changes.forEach((s) => s.unsubscribe());
    }

    /**
     * Updates...
     */
    updateDruhZivnosti() {
        const item = this.form.value.druhZivnosti;

        this.content.patch({
            oboryCinnosti: item ? item.Kod === 'O' : false
        });

        this.form.control.patchValue({
            skupinaZivnosti: item && this.data.defaults[item.Kod] || null
        });

        setTimeout(() => this.updateSkupinaZivnosti());
    }

    updateSkupinaZivnosti() {
        const item = this.form.value.skupinaZivnosti;

        this.form.control.patchValue({
            zivnost: item && this.data.defaults[item.Kod] || null,
            oborCinnosti: null
        });

        setTimeout(() => this.updateZivnost());
    }

    updateZivnost() {
        const item = this.form.value.zivnost,
            kodZivnosti = item && item.Kod || utils.get(this.form.value.skupinaZivnosti, 'Kod') ||
                    utils.get(this.form.value.druhZivnosti, 'Kod') || '';

        this.content.patch({
            overview: {
                kodZivnosti,
                predmetPodnikani: item ? item.Hodnota || item.Kod : ''
            }
        });

        setTimeout(() => this.cdr.markForCheck());
    }

    private getKodZivnosti() {
        const value = this.form.value;

    }

    /**
     * Controls...
     */
    @HostListener('document:keydown.alt.5')
    private focusDruhZivnostiOnKey() {
        this.inputDruhZivnosti.nativeElement.focus();
    }
}

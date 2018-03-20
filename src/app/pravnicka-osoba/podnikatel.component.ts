/**
 * "Pravnicka osoba - Podnikatel" feature component.
 */
import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Observable, Subscription} from 'rxjs/Rx';

import {ContentModel} from '../content.model';
import {DataService} from './data.service';
import {PodnikatelModel} from './podnikatel.model';
import {UtilsModule as utils} from '../utils.module';

@Component({
    templateUrl: './podnikatel.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PodnikatelComponent implements OnInit, OnDestroy {
    /**
     * Feature content.
     */
    content: ContentModel<PodnikatelModel> = this.data.content.podnikatel;

    @ViewChild('form')
    form: NgForm;

    private changes: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef,
            public data: DataService) {
    }

    ngOnInit() {
        setTimeout(() => {
            const control = this.form.control,
                reset = Observable.fromEvent(this.form['el'].nativeElement, 'reset');

            this.changes.push(control.get('nazev').valueChanges.map((nazev) => ({nazev}))
                .merge(control.get('ico').valueChanges.map((ico) => ({ico})))
                .debounceTime(250)
                .merge(reset)
                .subscribe((changes) => this.updatePodnikatel(changes)));

            this.changes.push(control.get('ulice').valueChanges.map((ulice) => ({ulice}))
                .merge(control.get('cisloDomovni').valueChanges.map((cisloDomovni) => ({cisloDomovni})))
                .merge(control.get('cisloOrientacni').valueChanges.map((cisloOrientacni) => ({cisloOrientacni})))
                .merge(control.get('obec').valueChanges.map((obec) => ({obec})))
                .debounceTime(250)
                .merge(reset)
                .subscribe((changes) => this.updateAdresaSidla(changes)));

            this.changes.push(control.get('okres').valueChanges
                .subscribe((value) => this.updateOkres(value)));

            this.changes.push(control.get('stat').valueChanges
                .subscribe((value) => this.updateStat(value)));
        });
    }

    ngOnDestroy() {
        this.changes.forEach((s) => s.unsubscribe());
    }

    /**
     * Updates...
     */
    private updatePodnikatel(changes?: any) {
        const value = {...this.form.value, ...changes};
    
        this.content.patch({
            completePodnikatel: changes && utils.filled(value.nazev, value.ico),
            overview: {
                nazev: value.nazev,
                ico: value.ico
            }
        });

        this.cdr.markForCheck();
    }

    private updateAdresaSidla(changes?: any) {
        const value = {...this.form.value, ...changes};
    
        this.content.patch({
            completeAdresa: changes && utils.filled(value.ulice) && utils.filled(value.obec) &&
                    utils.filled(value.cisloDomovni, value.cisloOrientacni)
        });

        this.cdr.markForCheck();
    }

    private updateOkres(item?: any) {
        if (item) {
            this.form.control.patchValue({
                stat: this.data.refs.stat.CZ
            });
        }

        this.cdr.markForCheck();
    }

    private updateStat(item?: any) {
        if (item && item.Kod !== this.data.refs.stat.CZ.Kod) {
            this.form.control.patchValue({
                okres: null
            });
        }

        this.cdr.markForCheck();
    }

    /**
     * Controls...
     */
    @ViewChild('input_nazev')
    private inputNazev: ElementRef;

    @ViewChild('input_ulice')
    private inputUlice: ElementRef;

    @HostListener('document:keydown.alt.1')
    private focusNazevOnKey() {
        this.inputNazev.nativeElement.focus();
    }

    @HostListener('document:keydown.alt.2')
    private focusUliceOnKey() {
        this.inputUlice.nativeElement.focus();
    }
}

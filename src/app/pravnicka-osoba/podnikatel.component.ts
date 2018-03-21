/**
 * "Pravnicka osoba - Podnikatel" feature component.
 */
import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Observable, Subscription} from 'rxjs/Rx';

import {AppService} from '../app.service';
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

    completePodnikatel = false;
    completeAdresaSidla = false;

    vyberAdresySidla = null;
    vybranaAdresaSidla = null;

    @ViewChild('form')
    form: NgForm;

    private changes: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef,
            private app: AppService, public data: DataService) {
    }

    ngOnInit() {
        setTimeout(() => {
            const control = this.form.control,
                reset = Observable.fromEvent(this.form['el'].nativeElement, 'reset');

            this.changes.push(control.get('podnikatel.nazev').valueChanges.map((nazev) => ({nazev}))
                .merge(control.get('podnikatel.ico').valueChanges.map((ico) => ({ico})))
                .debounceTime(250)
                .merge(reset)
                .subscribe((changes) => this.updatePodnikatel(changes)));

            this.changes.push(control.get('adresaSidla.ulice').valueChanges.map((ulice) => ({ulice}))
                .merge(control.get('adresaSidla.cisloDomovni').valueChanges.map((cisloDomovni) => ({cisloDomovni})))
                .merge(control.get('adresaSidla.cisloOrientacni').valueChanges.map((cisloOrientacni) => ({cisloOrientacni})))
                .merge(control.get('adresaSidla.obec').valueChanges.map((obec) => ({obec})))
                .debounceTime(250)
                .merge(reset)
                .subscribe((changes) => this.updateAdresaSidla(changes)));

            this.changes.push(control.get('adresaSidla.okres').valueChanges
                .subscribe((value) => this.updateOkres(value)));

            this.changes.push(control.get('adresaSidla.stat').valueChanges
                .subscribe((value) => this.updateStat(value)));
        });
    }

    ngOnDestroy() {
        this.changes.forEach((s) => s.unsubscribe());
    }

    /**
     * "Overeni adresy sidla" request and management.
     */
    requestVyberAdresySidla() {
        const value = this.content.entry.value;

        this.data.requestOvereniAdresy(value.adresaSidla).first()
            .subscribe((items) => {
                this.vyberAdresySidla = items;
                this.openVyberAdresySidla();
            });
    }

    openVyberAdresySidla() {
        const message = 'Odpovídající adresa nebyla nalezena.',
            items = this.vyberAdresySidla;

        if (!items || !items.length) {
            this.app.alert(message);
        }
        else if (items.length >= 1) {
            this.panelVyberAdresySidla.nativeElement.showModal();

            this.cdr.markForCheck();
        }
        else {
            this.applyVyberAdresySidla(items[0]);
        }
    }

    closeVyberAdresySidla() {
        this.vyberAdresySidla = this.vybranaAdresaSidla = null;

        this.panelVyberAdresySidla.nativeElement.close();
    }

    applyVyberAdresySidla(item: any = this.vybranaAdresaSidla) {
        this.form.controls.adresaSidla.patchValue(item);

        this.closeVyberAdresySidla();

        this.cdr.markForCheck();
    }

    clearAdresaSidla() {
        this.form.controls.adresaSidla.reset();
    }

    /**
     * Updates...
     */
    private updatePodnikatel(changes?: any) {
        const value = {...this.form.value, ...changes};
    
        this.completePodnikatel = changes && utils.some(value.nazev, value.ico),

        this.content.patch({
            overview: {
                nazev: value.podnikatel.nazev,
                ico: value.podnikatel.ico
            }
        });

        this.cdr.markForCheck();
    }

    private updateAdresaSidla(changes?: any) {
        const value = {...this.form.value, ...changes}.adresaSidla;

        this.completeAdresaSidla = changes && utils.some(value.ulice) && utils.some(value.obec) &&
                utils.some(value.cisloDomovni, value.cisloOrientacni)

        this.cdr.markForCheck();
    }

    private updateOkres(value?: any) {
        if (value) {
            this.form.control.patchValue({
                adresaSidla: {
                    stat: this.data.refs.stat.CZ.Kod
                }
            });
        }

        this.cdr.markForCheck();
    }

    private updateStat(value?: any) {
        if (value && value !== this.data.refs.stat.CZ.Kod) {
            this.form.control.patchValue({
                adresaSidla: {
                    okres: null
                }
            });
        }

        this.cdr.markForCheck();
    }

    /**
     * Controls...
     */
    @ViewChild('panelVyberAdresySidla')
    private panelVyberAdresySidla: ElementRef;

    @ViewChild('inputNazev')
    private inputNazev: ElementRef;

    @ViewChild('inputUlice')
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

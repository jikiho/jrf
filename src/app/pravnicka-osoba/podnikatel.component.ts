/**
 * "Pravnicka osoba - Podnikatel" feature component.
 */
//TODO: separate dialog form
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

    vyberAdresySidla = {
        items: null,
        item: null
    };

    @ViewChild('form')
    form: NgForm;

    private changes: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef,
            private app: AppService, public data: DataService) {
    }

    ngOnInit() {
        setTimeout(() => {
            const control = this.form.control;

            this.changes.push(control.get('podnikatel.nazev').valueChanges
                .merge(control.get('podnikatel.ico').valueChanges)
                .debounceTime(1) //reset...
                .subscribe(() => this.updatePodnikatel()));

            this.changes.push(control.get('adresaSidla.ulice').valueChanges
                .merge(control.get('adresaSidla.cisloDomovni').valueChanges)
                .merge(control.get('adresaSidla.cisloOrientacni').valueChanges)
                .merge(control.get('adresaSidla.obec').valueChanges)
                .debounceTime(1) //reset...
                .subscribe(() => this.updateAdresaSidla()));

            this.changes.push(control.get('adresaSidla.okres').valueChanges
                .subscribe(() => this.updateAdresaSidlaOkres()));

            this.changes.push(control.get('adresaSidla.stat').valueChanges
                .subscribe(() => this.updateAdresaSidlaStat()));
        });
    }

    ngOnDestroy() {
        while (this.changes.length) {
            this.changes.shift().unsubscribe();
        }
    }

    /**
     * "Vyber adresy sidla" request and management.
     */
    requestVyberAdresySidla() {
        const value = this.content.entry.value;

        this.data.requestOvereniAdresy(value.adresaSidla).first()
            .subscribe(
                (items) => {
                    this.vyberAdresySidla.items = items;
                    this.openVyberAdresySidla();
                },
                ([error, ...args]) => {
                    this.app.failure(...args, error);
                }
            );
    }

    openVyberAdresySidla() {
        const message = 'Odpovídající adresa nebyla nalezena.',
            items = this.vyberAdresySidla.items;

        if (!items || !items.length) {
            this.app.alert(message);
        }
        else if (items.length >= 1) {
            this.panelVyberAdresySidla.nativeElement.showModal();

            // apply complex content changes
            this.cdr.markForCheck();
        }
        else {
            this.applyVyberAdresySidla(items[0]);
        }
    }

    closeVyberAdresySidla() {
        // just close like escape
        this.panelVyberAdresySidla.nativeElement.close();
    }

    applyVyberAdresySidla(item: any = this.vyberAdresySidla.item) {
        this.form.controls.adresaSidla.patchValue(item);

        this.closeVyberAdresySidla();
    }

    clearAdresaSidla() {
        this.form.controls.adresaSidla.reset();
    }

    /**
     * Updates...
     */
    private updatePodnikatel() {
        const value = this.content.entry.value.podnikatel,
            previous = this.completePodnikatel;

        this.completePodnikatel = utils.some(value.nazev, value.ico);

        this.content.patch({
            overview: {
                nazev: value.nazev,
                ico: value.ico
            }
        });

        if (previous !== this.completePodnikatel) {
            this.cdr.markForCheck();
        }
    }

    private updateAdresaSidla() {
        const value = this.content.entry.value.adresaSidla,
            previous = this.completeAdresaSidla;

        this.completeAdresaSidla = utils.some(value.ulice) && utils.some(value.obec) &&
                utils.some(value.cisloDomovni, value.cisloOrientacni);

        if (previous !== this.completeAdresaSidla) {
            this.cdr.markForCheck();
        }
    }

    private updateAdresaSidlaOkres() {
        const value = this.content.entry.value.adresaSidla.okres;

        if (value) {
            utils.suspend(this.content.entry.value.adresaSidla.okres, 0);

            this.form.controls.adresaSidla.patchValue({
                stat: this.data.refs.stat.CZ.Kod
            });
        }
    }

    private updateAdresaSidlaStat() {
        const value = this.content.entry.value.adresaSidla.okres;

        if (value !== this.data.refs.stat.CZ.Kod) {
            if (!utils.suspended(this.content.entry.value.adresaSidla.okres)) {
                this.form.controls.adresaSidla.patchValue({
                    okres: null
                });
            }
        }
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

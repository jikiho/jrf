/**
 * "Pravnicka osoba - Podnikatel" feature component.
 */
//TODO: separate dialog form
import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs/Rx';

import {AppService} from '../app.service';
import {ContentModel} from '../content.model';
import {ContentsService} from './contents.service';
import {DataService} from './data.service';
import {PodnikatelDataService} from './podnikatel-data.service';
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
    content: ContentModel<PodnikatelModel> = this.contents.podnikatel;

    vyberAdresySidla = {
        seznamAdres: null,
        adresa: null
    };

    @ViewChild('form')
    form: NgForm;

    //@ViewChild('formVyberAdresySidla')
    //formVyberAdresySidla: NgForm;

    private changes: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef,
            private app: AppService, private contents: ContentsService, public data: DataService,
            private podnikatelData: PodnikatelDataService) {
    }

    ngOnInit() {
        setTimeout(() => {
            const control = this.form.control;

            this.updatePodnikatel();

            this.changes.push(control.get('podnikatel.nazev').valueChanges
                .merge(control.get('podnikatel.ico').valueChanges)
                .debounceTime(1) //reset...
                .subscribe(() => this.updatePodnikatel()));

            this.updateAdresaSidla();

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
     * Checks valid "cislo orientacni".
     */
    validCisloOrientacni(input: string, errors: any): string | null {
        return utils.validPattern(/^\s*([1-9]\d*)\s*([a-z]?)\s*$/i, input, errors,
                (match) => `${match[1]}${match[2]}`);
    }

    /**
     * "Vyber podnikatele" request and management.
     */
    requestVyberPodnikatele() {
        const value = this.content.entry.value.podnikatel;

        this.app.alert(value);
    }

    /**
     * "Vyber adresy sidla" request and management.
     */
    requestVyberAdresySidla() {
        const value = this.content.entry.value.adresaSidla;

        this.podnikatelData.requestOvereniAdresy(value)
            .then((items) => {
                this.vyberAdresySidla.seznamAdres = items;
                this.openVyberAdresySidla();
            })
            .catch(({message, error}) => {
                this.app.failure(message, error);
            });
    }

    openVyberAdresySidla() {
        const message = 'Odpovídající adresa nebyla nalezena.',
            items = this.vyberAdresySidla.seznamAdres;

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

    applyVyberAdresySidla(value: any = this.vyberAdresySidla.adresa) {
        this.content.patch({
            value: {
                adresaSidla: {
                    ...value
                }
            }
        });

        this.closeVyberAdresySidla();
    }

    clearAdresaSidla() {
        this.form.controls.adresaSidla.reset();
    }

    /**
     * Updates...
     */
    private updatePodnikatel() {
        const value = this.content.entry.value.podnikatel;

        this.content.patch({
            state: {
                completePodnikatel: utils.some(value.nazev, value.ico),
                nazev: value.nazev,
                ico: value.ico
            }
        });

        // apply complex content changes
        this.cdr.markForCheck();
    }

    private updateAdresaSidla() {
        const value = this.content.entry.value.adresaSidla;

        this.content.patch({
            state: {
                completeAdresaSidla: utils.some(value.ulice) && utils.some(value.obec) &&
                        utils.some(value.cisloDomovni, value.cisloOrientacni)
            }
        });

        // apply complex content changes
        this.cdr.markForCheck();
    }

    private updateAdresaSidlaOkres() {
        const value = this.content.entry.value.adresaSidla.okres;

        if (value) {
            utils.suspend(this.content.entry.value.adresaSidla.okres, 0);

            this.content.patch({
                value: {
                    adresaSidla: {
                        stat: this.data.refs.stat.CZ.Kod
                    }
                }
            });
        }
    }

    private updateAdresaSidlaStat() {
        const value = this.content.entry.value.adresaSidla.okres;

        if (value !== this.data.refs.stat.CZ.Kod) {
            if (!utils.suspended(this.content.entry.value.adresaSidla.okres)) {
                this.content.patch({
                    value: {
                        adresaSidla: {
                            okres: null
                        }
                    }
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

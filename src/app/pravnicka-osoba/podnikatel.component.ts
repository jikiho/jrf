/**
 * "Pravnicka osoba - Podnikatel" feature component.
 */
import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/Rx';

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

    private changers: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef,
            private app: AppService, public data: DataService) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.changers.push(utils.changer(this.form.controls.podnikatel, {
                'nazev': ({values}) => this.updatePodnikatel(values),
                'ico': ({values}) => this.updatePodnikatel(values)
            }));

            this.changers.push(utils.changer(this.form.controls.adresaSidla, {
                'obec': ({values, control}) => this.updateAdresaSidla(values, control),
                'ulice': ({values, control}) => this.updateAdresaSidla(values, control),
                'cisloOrientacni': ({values, control}) => this.updateAdresaSidla(values, control),
                'cisloDomovni': ({values, control}) => this.updateAdresaSidla(values, control),
                'okres': ({value, control}) => this.updateAdresaSidlaOkres(value, control),
                'stat': ({value, control}) => this.updateAdresaSidlaStat(value, control)
            }));
        });
    }

    ngOnDestroy() {
        while (this.changers.length) {
            this.changers.shift().unsubscribe();
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
                (error, ...args) => {
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
    private updatePodnikatel(value: any) {
        this.completePodnikatel = utils.some(value.nazev, value.ico);

        this.content.patch({
            overview: {
                nazev: value.nazev,
                ico: value.ico
            }
        });
    }

    private updateAdresaSidla(value: any, control: FormGroup) {
        this.completeAdresaSidla = utils.some(value.ulice) && utils.some(value.obec) &&
                utils.some(value.cisloDomovni, value.cisloOrientacni);
    }

    private updateAdresaSidlaOkres(value: any, control: FormGroup) {
        setTimeout(() => {
            if (value) {
                control.patchValue({
                    stat: this.data.refs.stat.CZ.Kod
                });
            }
        });
    }

    private updateAdresaSidlaStat(value: any, control: FormGroup) {
        setTimeout(() => {
            if (value !== this.data.refs.stat.CZ.Kod) {
                control.patchValue({
                    okres: null
                });
            }
        });
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

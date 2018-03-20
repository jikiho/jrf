/**
 * "Pravnicka osoba - Zivnosti" feature component.
 */
import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Observable, Subscription} from 'rxjs/Rx';

import {AppService} from '../app.service';
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

    vybranyDruhZivnosti = null;
    vybranaSkupinaZivnosti = null;
    vybranaZivnost = null;
    vybranyOborCinnosti = null;
    vybraneOboryCinnosti = false;

    @ViewChild('form')
    form: NgForm;

    private changes: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef,
            private app: AppService, public data: DataService) {
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
        }, 250);
    }

    ngOnDestroy() {
        this.changes.forEach((s) => s.unsubscribe());
    }

    /**
     * Manages...
     */
    openVyberZivnosti() {
        const entry = this.content.entry;

        this.vybranyDruhZivnosti = entry.druhZivnosti;
        this.vybranaSkupinaZivnosti = entry.skupinaZivnosti;
        this.vybranaZivnost = entry.zivnost;
        this.vybranyOborCinnosti = entry.oborCinnosti;
        this.updateDruhZivnosti(true);

        this.panelVyberZivnosti.nativeElement.showModal();
    }

    closeVyberZivnosti() {
        this.vybranyDruhZivnosti = this.vybranaSkupinaZivnosti = this.vybranaZivnost =
                this.vybranyOborCinnosti = null;
        this.vybraneOboryCinnosti = false;

        this.panelVyberZivnosti.nativeElement.close();
    }

    applyVyberZivnosti() {
        const item = this.vybranaZivnost,
            message = 'Není možné přidat znvou stejnou živnost.';

        if (item && this.content.entries.findIndex((entry) => entry.zivnost &&
                entry.zivnost.Kod === item.Kod) > -1) {
            this.app.alert(message);
        }
        else {
            this.applier(item);
        }
    }

    private applier(item) {
        const kodZivnosti = item && item.Kod || utils.get(this.vybranaSkupinaZivnosti, 'Kod') ||
                    utils.get(this.vybranyDruhZivnosti, 'Kod') || '';

        let predmetPodnikani = '';

        if (item) {
//utils.pluck(this.vybranyOborCinnosti, 'Cislo')
            const hodnotaZivnosti = item.Hodnota || item.Kod || '',
                oboryCinnosti = utils.numeric(this.vybranyOborCinnosti);

            predmetPodnikani = !this.vybraneOboryCinnosti ? hodnotaZivnosti :
                    `${hodnotaZivnosti} (${oboryCinnosti})`;
        }

        this.content.patch({
            druhZivnosti: this.vybranyDruhZivnosti,
            skupinaZivnosti: this.vybranaSkupinaZivnosti,
            zivnost: item,
            oborCinnosti: this.vybranyOborCinnosti,
            overview: {
                kodZivnosti,
                predmetPodnikani
            }
        });

        this.closeVyberZivnosti();
    }

    /**
     * Updates...
     */
    private updateDruhZivnosti(open: boolean = false) {
        const item = this.vybranyDruhZivnosti;

        this.vybraneOboryCinnosti = item ? item.Kod === 'O' : false;

        if (!open) {
            this.vybranaSkupinaZivnosti = item && this.data.defaults[item.Kod] || null;
        }

        setTimeout(() => this.updateSkupinaZivnosti(open));
    }

    private updateSkupinaZivnosti(open: boolean = false) {
        const item = this.vybranaSkupinaZivnosti;

        if (!open) {
            this.vybranaZivnost = item && this.data.defaults[item.Kod] || null;
        }

        setTimeout(() => this.updateZivnost(open));
    }

    private updateZivnost(open: boolean = false) {
        if (!open) {
            this.vybranyOborCinnosti = null;
        }

        setTimeout(() => this.cdr.markForCheck());
    }

    /**
     * Controls...
     */
    @ViewChild('panelVyberZivnosti')
    private panelVyberZivnosti: ElementRef;

    @ViewChild('inputDruhZivnosti')
    private inputDruhZivnosti: ElementRef;

    @ViewChild('inputSkupinaZivnosti')
    private inputSkupinaZivnosti: ElementRef;

    @ViewChild('inputZivnost')
    private inputZivnost: ElementRef;

    @HostListener('document:keydown.alt.5')
    private focusDruhZivnostiOnKey() {
        this.inputDruhZivnosti.nativeElement.focus();
    }
}

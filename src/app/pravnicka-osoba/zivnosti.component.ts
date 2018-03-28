/**
 * "Pravnicka osoba - Zivnosti" feature component.
 */
//TODO: separate dialog form
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

    vyberZivnosti = {
        druhZivnosti: null,
        skupinaZivnosti: null,
        zivnost: null,
        oborCinnosti: null,
        oboryCinnosti: false,
        fresh: {}
    };

    @ViewChild('form')
    form: NgForm;

    //@ViewChild('formVyberZivnosti')
    //formVyberZivnosti: NgForm;

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
        });
    }

    ngOnDestroy() {
        while (this.changes.length) {
            this.changes.shift().unsubscribe();
        }
    }

    /**
     * Manages...
     */
    openVyberZivnosti() {
        const entry = this.content.entry,
            value = entry.druhZivnosti;

        Object.assign(this.vyberZivnosti, {
            druhZivnosti: value,
            skupinaZivnosti: entry.skupinaZivnosti,
            zivnost: entry.zivnost,
            oborCinnosti: entry.oborCinnosti,
            oboryCinnosti: value ? value.Kod === 'O' : false
        });

        this.panelVyberZivnosti.nativeElement.showModal();
    }

    closeVyberZivnosti() {
        // just close like escape
        this.panelVyberZivnosti.nativeElement.close();
    }

    applyVyberZivnosti() {
        const message = 'Není možné přidat znvou stejnou živnost.',
            item = this.vyberZivnosti.zivnost,
            index = item ? this.content.entries.findIndex((entry) => entry.zivnost &&
                entry.zivnost.Kod === item.Kod) : -1;

        if (index > -1 && index !== this.content.index) {
            this.app.alert(message);
        }
        else {
            this.applierVyberZivnosti(item);
        }
    }

    private applierVyberZivnosti(item) {
        const entry = this.content.entry,
            kodZivnosti = item && item.Kod || utils.get(this.vyberZivnosti.skupinaZivnosti, 'Kod') ||
                    utils.get(this.vyberZivnosti.druhZivnosti, 'Kod') || '';

        let predmetPodnikani = '';

        if (item) {
            const hodnotaZivnosti = item.Hodnota || item.Kod || '',
                count = utils.numeric(this.vyberZivnosti.oborCinnosti);

            predmetPodnikani = !this.vyberZivnosti.oboryCinnosti ? hodnotaZivnosti :
                    `${hodnotaZivnosti} (${count})`;
        }

        this.content.patch({
            state: {
                kodZivnosti,
                predmetPodnikani
            },
            druhZivnosti: this.vyberZivnosti.druhZivnosti,
            skupinaZivnosti: this.vyberZivnosti.skupinaZivnosti,
            zivnost: this.vyberZivnosti.zivnost,
            oborCinnosti: this.vyberZivnosti.oborCinnosti
        });

        this.closeVyberZivnosti();
    }

    /**
     * Updates...
     */
    private updateDruhZivnosti() {
        const value = this.vyberZivnosti.druhZivnosti,
            skupinaZivnosti = value && this.data.defaults[value.Kod] || null;

        Object.assign(this.vyberZivnosti, {
            skupinaZivnosti,
            zivnost: null,
            oborCinnosti: null,
            oboryCinnosti: value ? value.Kod === 'O' : false
        });

        if (skupinaZivnosti) {
            this.updateSkupinaZivnosti();
        }
        else {
            this.cdr.markForCheck();
        }
    }

    private updateSkupinaZivnosti() {
        const value = this.vyberZivnosti.skupinaZivnosti,
            zivnost = value && this.data.defaults[value.Kod] || null;

        Object.assign(this.vyberZivnosti, {
            zivnost,
            oborCinnosti: null
        });

        if (zivnost) {
            this.updateZivnost();
        }
        else {
            this.cdr.markForCheck();
        }
    }

    private updateZivnost() {
        Object.assign(this.vyberZivnosti, {
            oborCinnosti: null
        });

        // apply complex content changes
        this.cdr.markForCheck();
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

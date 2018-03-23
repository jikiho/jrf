/**
 * "Pravnicka osoba - Zivnosti" feature component.
 */
import {Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Observable, Subscription, BehaviorSubject} from 'rxjs/Rx';

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
        oboryCinnosti: false
    };

    @ViewChild('form')
    form: NgForm;

    private changers: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef,
            private app: AppService, public data: DataService) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.changers.push(utils.changer(this.form.controls.vyberZivnosti, {
                'druhZivnosti': ({value}) => this.updateDruhZivnosti(value),
                'skupinaZivnosti': ({value}) => this.updateSkupinaZivnosti(value),
                'zivnost': ({value}) => this.updateZivnost(value)
            }));
        });
    }

    ngOnDestroy() {
        while (this.changers.length) {
            this.changers.shift().unsubscribe();
        }
    }

    /**
     * Manages...
     */
    openVyberZivnosti() {
        const entry = this.content.entry;

        this.vyberZivnosti.druhZivnosti = entry.druhZivnosti;
        this.vyberZivnosti.skupinaZivnosti = entry.skupinaZivnosti;
        this.vyberZivnosti.zivnost = entry.zivnost;
        this.vyberZivnosti.oborCinnosti = entry.oborCinnosti;

        this.panelVyberZivnosti.nativeElement.showModal();

        // apply complex content changes
        this.cdr.markForCheck();
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
            druhZivnosti: this.vyberZivnosti.druhZivnosti,
            skupinaZivnosti: this.vyberZivnosti.skupinaZivnosti,
            zivnost: this.vyberZivnosti.zivnost,
            oborCinnosti: this.vyberZivnosti.oborCinnosti,
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
    private updateDruhZivnosti(value: any) {
console.log('druhZivnosti', value);
        this.vyberZivnosti.skupinaZivnosti = value && this.data.defaults[value.Kod] || null;
        this.vyberZivnosti.zivnost = null;
        this.vyberZivnosti.oborCinnosti = null;
        this.vyberZivnosti.oboryCinnosti = value ? value.Kod === 'O' : false;
    }

    private updateSkupinaZivnosti(value?: any) {
console.log('skupinaZivnosti', value);
        this.vyberZivnosti.zivnost = value && this.data.defaults[value.Kod] || null;
        this.vyberZivnosti.oborCinnosti = null;
    }

    private updateZivnost(value: any) {
console.log('zivnost', value);
        this.vyberZivnosti.oborCinnosti = null;
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

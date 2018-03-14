/**
 * "Pravnicka osoba - Zivnosti" feature component.
 */
import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs/Rx';

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
    private form: NgForm;

    private subscriptions: Subscription[] = [];

    constructor(private cdr: ChangeDetectorRef,
            public data: DataService) {
    }

    ngOnInit() {
        this.content.init(this.form, (value) => this.update(value));
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) =>
                subscription.unsubscribe());

        this.content.destroy();
    }

    private update(value): any {
        const entry = this.content.entry;
        
        if (value.druhZivnosti !== entry.druhZivnosti) {
            const item = value.druhZivnosti;

            Object.assign(value, {
                skupinaZivnosti: item && this.data.defaults[item.Kod] || null,
                oborCinnosti: null,
                oboryCinnosti: item ? item.Kod === 'O' : false
            });

            this.form.control.patchValue({
                skupinaZivnosti: value.skupinaZivnosti,
                oborCinnosti: value.oborCinnosti
            });

            this.cdr.markForCheck();
        }

        if (value.skupinaZivnosti !== entry.skupinaZivnosti) {
            const item = value.skupinaZivnosti;

            Object.assign(value, {
                zivnost: item && this.data.defaults[item.Kod] || null
            });

            this.form.control.patchValue({
                zivnost: value.zivnost
            });

            this.cdr.markForCheck();
        }

        if (value.zivnost !== entry.zivnost) {
            const item = value.zivnost;

            Object.assign(value, {
                predmetPodnikani: item ? item.Hodnota || item.Kod : ''
            });

            this.cdr.markForCheck();
        }

        return value;
    }

    @ViewChild('input.druhZivnosti')
    private inputDruhZivnosti: ElementRef;

    @HostListener('document:keydown.alt.5')
    private focusDruhZivnostiOnKey() {
        this.inputDruhZivnosti.nativeElement.focus();
    }
}

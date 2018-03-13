/**
 * "Pravnicka osoba - Zivnosti" feature component.
 */
import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {BehaviorSubject, Subscription} from 'rxjs/Rx';

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
    content: ContentModel<ZivnostModel>;

    @ViewChild('form')
    private form: NgForm;

    private synchronizer: Subscription | BehaviorSubject<ZivnostModel[]>;

    constructor(private cdr: ChangeDetectorRef,
            app: AppService, public data: DataService) {
        this.content = this.data.content.zivnosti = this.data.content.zivnosti ||
                new ContentModel(app, ZivnostModel, 3);
    }

    ngOnInit() {
        this.synchronizer = this.content.init(this.form, (value) => this.update(value));
            // checked due to content toolbar entries async pipe
            //.subscribe(() => this.cdr.markForCheck());
    }

    ngOnDestroy() {
        if (this.synchronizer) {
            //this.synchronizer.unsubscribe();
        }

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
        }

        if (value.skupinaZivnosti !== entry.skupinaZivnosti) {
            const item = value.skupinaZivnosti;

            Object.assign(value, {
                zivnost: item && this.data.defaults[item.Kod] || null
            });

            this.form.control.patchValue({
                zivnost: value.zivnost
            });
        }

        if (value.zivnost !== entry.zivnost) {
            const item = value.zivnost;

            Object.assign(value, {
                predmetPodnikani: item ? item.Hodnota || item.Kod : ''
            });
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

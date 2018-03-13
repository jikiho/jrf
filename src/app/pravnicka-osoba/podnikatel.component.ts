/**
 * "Pravnicka osoba - Podnikatel" feature component.
 */
import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {BehaviorSubject, Subscription} from 'rxjs/Rx';

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
    content: ContentModel<PodnikatelModel>;

    @ViewChild('form')
    private form: NgForm;

    private synchronizer: Subscription | BehaviorSubject<PodnikatelModel[]>;

    constructor(private cdr: ChangeDetectorRef,
            app: AppService, public data: DataService) {
        this.content = this.data.content.podnikatel = this.data.content.podnikatel ||
                new ContentModel(app, PodnikatelModel);
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

        if (value.okres !== entry.okres) {
            const item = value.okres;

            if (item) {
                this.content.patchValue({
                    stat: this.data.refs.stat.CZ
                });
            }
        }

        if (value.stat !== entry.stat) {
            const item = value.stat;

            if (item && item.Kod !== this.data.refs.stat.CZ.Kod) {
                this.content.patchValue({
                    okres: null
                });
            }
        }

        if (value.nazev !== entry.nazev || value.ico !== entry.ico) {
            Object.assign(value, {
                completePodnikatel: utils.dirty(value.nazev, value.ico)
            });
        }

        if (value.ulice !== entry.ulice || value.obec !== entry.obec ||
                value.cisloDomovni !== entry.cisloDomovni || value.cisloOrientacni !== entry.cisloOrientacni) {
            Object.assign(value, {
                completeAdresa: utils.dirty(value.ulice) && utils.dirty(value.obec) &&
                        utils.dirty(value.cisloDomovni, value.cisloOrientacni)
            });
        }

        return value;
    }

    @ViewChild('input.nazev')
    private inputNazev: ElementRef;

    @HostListener('document:keydown.alt.1')
    private focusNazevOnKey() {
        this.inputNazev.nativeElement.focus();
    }

    @ViewChild('input.ulice')
    private inputUlice: ElementRef;

    @HostListener('document:keydown.alt.2')
    private focusUliceOnKey() {
        this.inputUlice.nativeElement.focus();
    }
}

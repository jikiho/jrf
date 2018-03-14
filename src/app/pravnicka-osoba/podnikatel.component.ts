/**
 * "Pravnicka osoba - Podnikatel" feature component.
 */
import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs/Rx';

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

            this.cdr.markForCheck();
        }

        if (value.ulice !== entry.ulice || value.obec !== entry.obec ||
                value.cisloDomovni !== entry.cisloDomovni || value.cisloOrientacni !== entry.cisloOrientacni) {
            Object.assign(value, {
                completeAdresa: utils.dirty(value.ulice) && utils.dirty(value.obec) &&
                        utils.dirty(value.cisloDomovni, value.cisloOrientacni)
            });

            this.cdr.markForCheck();
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

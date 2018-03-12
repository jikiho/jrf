/**
 * "Pravnicka osoba - Podnikatel" feature component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener} from '@angular/core';

import {AppService} from '../app.service';
import {ContentModel} from '../content.model';
import {DataService} from './data.service';
import {FeatureComponentBase} from '../feature.component-base';
import {UtilsModule as utils} from '../utils.module';

class PodnikatelModel {
    completePodnikatel: boolean;
    completeAdresa: boolean;
    nazev: string;
    pravniForma: any;
    ico: string;
    ulice: string;
    cisloDomovni: string;
    cisloOrientacni: string;
    psc: string;
    obec: string;
    castObce: string;
    okres: any;
    stat: any
}

@Component({
    templateUrl: './podnikatel.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PodnikatelComponent extends FeatureComponentBase {
    constructor(app: AppService, public data: DataService) {
        super(app);

        this.content = this.data.content.podnikatel = this.data.content.podnikatel ||
                new ContentModel(() => new PodnikatelModel());
    }

    update(value): any {
        const entry = this.content.entry;

        if (value.okres !== entry.okres) {
            const item = value.okres;

            if (item) {
                this.form.control.patchValue({
                    stat: this.data.refs.stat.CZ
                });
            }
        }

        if (value.stat !== entry.stat) {
            const item = value.stat;

            if (item && item.Kod !== this.data.refs.stat.CZ.Kod) {
                this.form.control.patchValue({
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

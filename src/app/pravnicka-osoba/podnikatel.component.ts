/*
        this.okres$ = utils.controlValueChanges(this.form, 'okres');
        this.okres$.subscribe((value) => {
            if (value) {
                this.form.control.patchValue({
                    stat: 'CZ'
                });
            }
        });
        this.stat$ = utils.controlValueChanges(this.form, 'stat');
        this.stat$.subscribe((value) => {
            if (value != 'CZ') {
                this.form.control.patchValue({
                    okres: ''
                });
            }
        });
*/
/**
 * "Pravnicka osoba - Podnikatel" feature component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener} from '@angular/core';

import {AppService} from '../app.service';
import {ContentModel} from '../content.model';
import {DataService} from './data.service';
import {FeatureComponentBase} from '../feature.component-base';
import {Getter} from '../utils.module';

class PodnikatelModel {
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
    constructor(app: AppService, private data: DataService) {
        super(app);

        this.content = this.data.content.podnikatel = this.data.content.podnikatel ||
                new ContentModel(() => new PodnikatelModel());
    }

    @ViewChild('input.nazev')
    private inputNazev: ElementRef;

    @HostListener('document:keydown.alt.1')
    private focusNazevOnKey() {
        this.inputNazev.nativeElement.focus();
    }
}

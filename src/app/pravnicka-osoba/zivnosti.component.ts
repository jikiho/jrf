/**
 * "Pravnicka osoba - Zivnosti" feature component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener} from '@angular/core';

import {AppService} from '../app.service';
import {ContentModel} from '../content.model';
import {DataService} from './data.service';
import {FeatureComponentBase} from '../feature.component-base';

class ZivnostModel {
    druhZivnosti: any;
    skupinaZivnosti: any;
    zivnost: any;
    oborCinnosti: any[];
    oboryCinnosti: boolean;
    predmetPodnikani: string;
}

@Component({
    templateUrl: './zivnosti.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZivnostiComponent extends FeatureComponentBase {
    constructor(app: AppService, public data: DataService) {
        super(app);

        this.content = this.data.content.zivnosti = this.data.content.zivnosti ||
                new ContentModel(() => new ZivnostModel(), 0);
    }

    update(value): any {
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

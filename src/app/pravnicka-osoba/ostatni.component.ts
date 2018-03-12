/**
 * "Pravnicka osoba - Ostatni" feature component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener} from '@angular/core';

import {AppService} from '../app.service';
import {ContentModel} from '../content.model';
import {DataService} from './data.service';
import {FeatureComponentBase} from '../feature.component-base';
import {Getter} from '../utils.module';

class OstatniModel {
    value: any;
}

@Component({
    templateUrl: './ostatni.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OstatniComponent extends FeatureComponentBase {
    constructor(app: AppService, private data: DataService) {
        super(app);

        this.content = this.data.content.ostatni = this.data.content.ostatni ||
                new ContentModel(new OstatniModel());
    }

    /*
    @ViewChild('input.nazev')
    private inputNazev: ElementRef;

    @HostListener('document:keydown.alt.1')
    private focusNazevOnKey() {
        this.inputNazev.nativeElement.focus();
    }
    */
}

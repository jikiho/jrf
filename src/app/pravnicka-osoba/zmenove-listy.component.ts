/**
 * "Pravnicka osoba - Zmenove listy" feature component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener} from '@angular/core';

import {AppService} from '../app.service';
import {ContentModel} from '../content.model';
import {DataService} from './data.service';
import {FeatureComponentBase} from '../feature.component-base';
import {UtilsModule as utils} from '../utils.module';

class ZmenovyListModel {
    zmenovyList: string;
    zivnosti: any[];
    puvodniUdaj: string;
    novyUdaj: string;
}

@Component({
    templateUrl: './zmenove-listy.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZmenoveListyComponent extends FeatureComponentBase {
    constructor(app: AppService, public data: DataService) {
        super(app);

        this.content = this.data.content.zmenoveListy = this.data.content.zmenoveListy ||
                new ContentModel(() => new ZmenovyListModel(), 3);
    }

    update(value): any {
        const entry = this.content.entry;
        
        if (value.puvodniUdaj !== entry.puvodniUdaj ||
                value.novyUdaj !== entry.novyUdaj) {
            Object.assign(value, {
                zmenovyList: utils.dirty(value.puvodniUdaj, value.novyUdaj) ? [value.puvodniUdaj, value.novyUdaj].join(' / ') : ''
            });
        }

        return value;
    }

    @ViewChild('input.puvodniUdaj')
    private inputPuvodniUdaj: ElementRef;

    @HostListener('document:keydown.alt.2')
    private focusPuvodniUdajOnKey() {
        this.inputPuvodniUdaj.nativeElement.focus();
    }

    @ViewChild('input.novyUdaj')
    private inputNovyUdaj: ElementRef;

    @HostListener('document:keydown.alt.3')
    private focusNovyUdajOnKey() {
        this.inputNovyUdaj.nativeElement.focus();
    }
}

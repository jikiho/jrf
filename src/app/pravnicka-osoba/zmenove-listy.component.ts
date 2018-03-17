/**
 * "Pravnicka osoba - Zmenove listy" feature component.
 */
import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';

import {ContentModel} from '../content.model';
import {DataService} from './data.service';
import {UtilsModule as utils} from '../utils.module';
import {ZmenovyListModel} from './zmenovy-list.model';

@Component({
    templateUrl: './zmenove-listy.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZmenoveListyComponent implements OnInit, OnDestroy {
    /**
     * Feature content.
     */
    content: ContentModel<ZmenovyListModel> = this.data.content.zmenoveListy;

    @ViewChild('form')
    private form: NgForm;

    constructor(public data: DataService) {
    }

    ngOnInit() {
        this.content.init(this.form, (value) => this.update(value));
    }

    ngOnDestroy() {
        this.content.destroy();
    }

    private update(value): any {
        const entry = this.content.entry;
        
        if (value.puvodniUdaj !== entry.puvodniUdaj ||
                value.novyUdaj !== entry.novyUdaj) {
            Object.assign(value, {
                overview: utils.dirty(value.puvodniUdaj, value.novyUdaj) ?
                        [value.puvodniUdaj, value.novyUdaj].join(' / ') : ''
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

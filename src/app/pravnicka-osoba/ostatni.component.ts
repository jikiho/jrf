/**
 * "Pravnicka osoba - Ostatni" feature component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';

import {AppService} from '../app.service';
import {DataService} from './data.service';

@Component({
    templateUrl: './ostatni.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OstatniComponent {
    @ViewChild('form')
    private form: NgForm;

    @ViewChild('accesskeyC')
    private accesskeyC: ElementRef;

    constructor(private app: AppService, private data: DataService) {
    }

    @HostListener('document:keydown.alt.C')
    private accessCOnKey() {
        this.accesskeyC.nativeElement.focus();
    }
}

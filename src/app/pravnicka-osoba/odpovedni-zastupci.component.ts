/**
 * "Pravnicka osoa - Odpovedni zastupci" feature component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';

import {AppService} from '../app.service';
import {DataService} from './data.service';

@Component({
    templateUrl: './odpovedni-zastupci.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OdpovedniZastupciComponent {
    @ViewChild('form')
    private form: NgForm;

    @ViewChild('accesskey8')
    private accesskey8: ElementRef;

    @ViewChild('accesskey2')
    private accesskey2: ElementRef;

    constructor(private app: AppService, private data: DataService) {
    }

    @HostListener('document:keydown.alt.8')
    private access8OnKey() {
        this.accesskey8.nativeElement.focus();
    }

    @HostListener('document:keydown.alt.2')
    private access2OnKey() {
        this.accesskey2.nativeElement.focus();
    }
}

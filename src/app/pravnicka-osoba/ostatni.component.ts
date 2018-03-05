/**
 * "Pravnicka osoba - Ostatni" feature component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';

import {AppService} from '../app.service';

@Component({
    templateUrl: './ostatni.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OstatniComponent {
    @ViewChild('form')
    private form: NgForm;

    @ViewChild('accesskeyC')
    private accesskeyC: ElementRef;

    constructor( private app: AppService) {
    }

    @HostListener('document:keydown.alt.PageUp')
    private previousRouteOnKey() {
        this.app.navigate(['pravnicka-osoba', 'odpovedni-zastupci']);
    }

    @HostListener('document:keydown.alt.PageDown')
    private nextRouteOnKey() {
        this.app.navigate(['/pravnicka-osoba', 'zmenove-listy']);
    }

    @HostListener('document:keydown.alt.C')
    private accessCOnKey() {
        this.accesskeyC.nativeElement.focus();
    }
}

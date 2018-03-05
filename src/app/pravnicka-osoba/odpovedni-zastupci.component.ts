/**
 * "Pravnicka osoa - Odpovedni zastupci" feature component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';

import {AppService} from '../app.service';

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

    constructor( private app: AppService) {
    }

    @HostListener('document:keydown.alt.PageUp')
    private previousRouteOnKey() {
        this.app.navigate(['pravnicka-osoba', 'zivnosti']);
    }

    @HostListener('document:keydown.alt.PageDown')
    private nextRouteOnKey() {
        this.app.navigate(['/pravnicka-osoba', 'ostatni']);
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

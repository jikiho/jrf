/**
 * "Pravnicka osoba - Podnikatel" feature component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';

import {AppService} from '../app.service';

@Component({
    templateUrl: './podnikatel.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PodnikatelComponent {
    @ViewChild('form')
    private form: NgForm;

    @ViewChild('accesskey1')
    private accesskey1: ElementRef;

    @ViewChild('accesskey2')
    private accesskey2: ElementRef;

    constructor( private app: AppService) {
    }

    @HostListener('document:keydown.alt.PageUp')
    private previousRouteOnKey() {
        this.app.navigate(['pravnicka-osoba', 'zmenove-listy']);
    }

    @HostListener('document:keydown.alt.PageDown')
    private nextRouteOnKey() {
        this.app.navigate(['/pravnicka-osoba', 'zivnosti']);
    }

    @HostListener('document:keydown.alt.1')
    private access1OnKey() {
        this.accesskey1.nativeElement.focus();
    }

    @HostListener('document:keydown.alt.2')
    private access2OnKey() {
        this.accesskey2.nativeElement.focus();
    }
}

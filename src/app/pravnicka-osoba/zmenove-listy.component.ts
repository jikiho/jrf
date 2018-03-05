/**
 * "Pravnicka osoba - Zmenove listy" feature component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';

import {AppService} from '../app.service';

@Component({
    templateUrl: './zmenove-listy.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZmenoveListyComponent {
    @ViewChild('form')
    private form: NgForm;

    constructor( private app: AppService) {
    }

    @HostListener('document:keydown.alt.PageUp')
    previousRoute() {
        this.app.navigate(['pravnicka-osoba', 'ostatni']);
    }

    @HostListener('document:keydown.alt.PageDown')
    nextRoute() {
        this.app.navigate(['/pravnicka-osoba', 'podnikatel']);
    }
}

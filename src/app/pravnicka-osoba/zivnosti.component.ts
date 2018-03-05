/**
 * "Pravnicka osoba - Zivnosti" feature component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';
import {BehaviorSubject} from 'rxjs/Rx';

import {AppService} from '../app.service';

@Component({
    templateUrl: './zivnosti.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZivnostiComponent {
    @ViewChild('form')
    private form: NgForm;

    @ViewChild('accesskey5')
    private accesskey5: ElementRef;

    constructor( private app: AppService) {
    }

    @HostListener('document:keydown.alt.PageUp')
    private previousRouteOnKey() {
        this.app.navigate(['pravnicka-osoba', 'podnikatel']);
    }

    @HostListener('document:keydown.alt.PageDown')
    private nextRouteOnKey() {
        this.app.navigate(['/pravnicka-osoba', 'odpovedni-zastupci']);
    }

    @HostListener('document:keydown.alt.5')
    private access5OnKey() {
        this.accesskey5.nativeElement.focus();
    }
}

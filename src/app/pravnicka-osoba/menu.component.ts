/**
 * "Pravnicka osoba" feature menu component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener} from '@angular/core';

import {DataService} from './data.service';
import {UtilsModule as utils} from '../utils.module';

@Component({
    selector: 'menu-component',
    templateUrl: './menu.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
    /**
     * Links scope.
     */
    @ViewChild('links')
    private scope: ElementRef;

    constructor(public data: DataService) {
    }

    /**
     * Actual list of available links.
     */
    private get links(): HTMLElement[] {
        return Array.from(this.scope.nativeElement.querySelectorAll('[routerLink]:not([disabled])'));
    }

    /**
     * Makes a previous/next link active (click on it).
     */
    private shift(value: number) {
        let links = this.links,
            length = links.length,
            index = links.findIndex((link) => link.classList.contains('active')),
            link = index > -1 && value ? links[(index + value + length) % length] : undefined;

        if (link) {
            setTimeout(() => link.click());
        }
    }

    /**
     * Controls...
     */
    @HostListener('document:keydown.alt.pageup', ['$event', '-1'])
    @HostListener('document:keydown.alt.pagedown', ['$event', '1'])
    private shiftOnKey(event: KeyboardEvent, value: string) {
        if (utils.keydown(event)) {
            this.shift(parseInt(value));
        }
    }
}

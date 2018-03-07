/**
 * "Pravnicka osoba" feature menu component.
 */
import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener} from '@angular/core';

@Component({
    selector: 'menu-component',
    templateUrl: './menu.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
    static suspended: boolean = false;

    /**
     * Links scope.
     */
    @ViewChild('links')
    private scope: ElementRef;

    private suspended: boolean;

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

    @HostListener('document:keydown.alt.PageUp', ['-1'])
    @HostListener('document:keydown.alt.PageDown', ['1'])
    private shiftOnKey(value: number) {
        if (!MenuComponent.suspended) {
            //MenuComponent.suspended = true;

            this.shift(value);
        }
    }

    @HostListener('document:keyup.PageUp')
    @HostListener('document:keyup.alt.PageUp')
    @HostListener('document:keyup.PageDown')
    @HostListener('document:keyup.alt.PageDown')
    private resumeOnKey() {
        MenuComponent.suspended = false;
    }
}

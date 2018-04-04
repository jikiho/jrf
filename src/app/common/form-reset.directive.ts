/**
 * Directive to enhance a form reset functionality.
 */
import {Directive, ElementRef, HostListener} from '@angular/core';

import {UtilsModule as utils} from '../utils.module';

@Directive({
    selector: 'form'
})
export class FormResetDirective {
    constructor(private el: ElementRef) {
    }

    /**
     * Reset event...
     */
    @HostListener('keydown.alt.Delete', ['$event'])
    private resetOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.el.nativeElement.reset();
        }
    }
}

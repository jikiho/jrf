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
    @HostListener('keyup.alt.Delete', ['$event'])
    private resetOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
console.log("RESET");
            this.el.nativeElement.reset();
        }
    }
}

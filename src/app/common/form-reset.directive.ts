/**
 * Directive to enhance a form reset functionality.
 */
import {Directive, OnInit, ElementRef, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';

import {UtilsModule as utils} from '../utils.module';

@Directive({
    selector: 'form'
})
export class FormResetDirective implements OnInit {
    constructor(private form: NgForm, private el: ElementRef) {
    }

    ngOnInit() {
        this.form['el'] = this.el;
    }

    /**
     * Reset event...
     */
    @HostListener('keyup.alt.Delete', ['$event'])
    private resetOnKey(event: KeyboardEvent) {
        if (utils.keydown(event)) {
            this.el.nativeElement.reset();
        }
    }
}

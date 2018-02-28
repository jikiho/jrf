/**
 * Directive to...
 */
import {Directive, AfterViewInit, Input, HostBinding, ElementRef} from '@angular/core';
import {NgControl} from '@angular/forms';

import {UtilsModule as utils} from '../utils.module';

@Directive({
    selector: 'output[for]'
})
export class OutputForDirective implements AfterViewInit {
    @Input('for')
    private htmlFor: string;

    //private control: NgControl;
    private element: HTMLElement;

    constructor(private el: ElementRef) {
    }

    ngAfterViewInit() {
        this.element = document.getElementById(this.htmlFor);
    }
}

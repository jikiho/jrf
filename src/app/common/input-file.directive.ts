/**
 * File input element enhancement.
 */
import {Directive, Input, HostListener} from '@angular/core';
import {NgControl} from '@angular/forms';

import {UtilsModule as utils} from '../utils.module';

@Directive({
    selector: 'input[type=file][name][value]'
})
export class InputFileDirective {
    @Input()
    private value;

    constructor(private control: NgControl) {
    }

    /**
     * Changes corresponding control group value.
     */
    @HostListener('change', ['$event.target'])
    changeOnEvent(input: HTMLInputElement) {
        const group = this.control.control.parent,
            name = this.control.name,
            files = input.files;

        utils.setProperty(group.value, name, files.length ? files : null);
    }
}

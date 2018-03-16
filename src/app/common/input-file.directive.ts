/**
 * Directive to synchronize a file input and a corresponding control group value.
 */
import {Directive, HostListener} from '@angular/core';
import {NgControl} from '@angular/forms';

import {UtilsModule as utils} from '../utils.module';

@Directive({
    selector: 'input[type=file][name][value]'
})
export class InputFileDirective {
    constructor(private control: NgControl) {
    }

    /**
     * Changes corresponding control group value.
     */
    @HostListener('change', ['$event.target'])
    private changeOnEvent(input: HTMLInputElement) {
        const group = this.control.control.parent,
            name = this.control.name,
            files = input.files;

        utils.set(group.value, name, files.length ? files : null);
    }
}

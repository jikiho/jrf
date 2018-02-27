/**
 * Directive to control a form standard HTML5 validation.
 */
import {Directive, Input, HostBinding} from '@angular/core';

import {UtilsModule as utils} from '../utils.module';

@Directive({
    selector: 'form'
})
export class FormValidateDirective {
    /**
     * Flag to disable a form validation (undefined to enable).
     */
    @HostBinding('attr.novalidate')
    novalidate: boolean;

    @Input('novalidate')
    set _novalidate(value: boolean) {
        this.novalidate = utils.booleric(value, '') || undefined;
    }
}

/**
 * Directive to provide custom validations.
 */
import {Directive, Input, HostBinding, ElementRef, HostListener} from '@angular/core';
import {NG_VALIDATORS, Validator, AbstractControl, ValidationErrors} from '@angular/forms';

import {UtilsModule as utils} from '../utils.module';

@Directive({
    selector: 'input[valid]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: InputValidDirective,
            multi: true
        }
    ]
})
export class InputValidDirective implements Validator {
    static readonly VALIDATOR = {
//TODO: date, rc, number, float, regexp/glob
        'text': utils.validText,
        'date': utils.validDate,
        'rc': utils.validRc,
        'ico': utils.validIco
    };

    /**
     * List of validators to use.
     */
    private validators: string[] = [];

    /**
     * Input prop. with one or more validator names.
     */
    @Input()
    private set valid(value: string | string[]) {
        this.validators = Array.isArray(value) ? value : [value];
    }

    /**
     * Control ref.
     */
    private control: AbstractControl;

    /**
     * Normalized value, or undefined for invalid.
     */
    private value: string;

    constructor(private el: ElementRef) {
    }

    /**
     * Validates and normalizes a string value.
     */
    validate(control: AbstractControl): ValidationErrors {
        const errors = {},
            input = control.value;

        this.control = control;
    
        if (!input) { //empty or undefined
            return null;
        }

        for (let name of this.validators) {
            const validator = InputValidDirective.VALIDATOR[name],
                value = validator(input);

            if (value !== null) {
                this.value = value;

                return null;
            }

            errors[name] = {
                actualValue: input
            };
        }

        this.value = undefined;

        return errors;
    }

    /**
     * Normalizes a value on blur event.
     */
    @HostListener('blur')
    private normalizeOnBlur() {
        const control = this.control,
            value = this.value;

        if (value !== undefined) {
            if (value !== control.value) {
                control.setValue(value);
            }
        }
    }
}

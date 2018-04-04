/**
 * Directive to provide custom validations and normalization.
 */
//TODO: password, file, checkbox, radiobutton, textarea
//TODO: reset cursor position after normalization
import {Directive, Input, ElementRef, HostListener} from '@angular/core';
import {NG_VALIDATORS, Validator, AbstractControl, ValidationErrors} from '@angular/forms';

import {UtilsModule as utils} from '../utils.module';

class InputValidContext {
    errors?: any;
}

@Directive({
    selector: 'input[type="text"]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: InputValidDirective,
            multi: true
        }
    ]
})
export class InputValidDirective implements Validator {
    /**
     * List of validators to use, any text value by default.
     */
    private validators: any[] = ['any'];

    /**
     * Flag to set empty value to a pristine control.
     */
    private pristine: boolean;

    /**
     * One or more validators, or boolean for no more.
     * "number", "number|any", "[callback]", "[/regexp/]", "['number', callback...]"
     */
    @Input()
    private set valid(value: any) {
        const items = Array.isArray(value) ? value :
                (typeof value === 'string' ? value.split('|') : value);

        this.validators = items;
        this.pristine = items.indexOf('some') > -1;
    }

    /**
     * Last valid normalized value for a control.
     */
    private validValue: string;
    private control: AbstractControl;

    constructor(private el: ElementRef) {
    }

    /**
     * Prepares and calls a value validation.
     */
    validate(control: AbstractControl): ValidationErrors {
        let value = control.value;

        this.validValue = utils.trims(value || ''); //undefined
        this.control = control;

        if (!utils.some(value)) { //control.pristine
            if (!this.pristine) {
                return null;
            }
            else if (!value) {
                value = '';
            }
        }

        return this.process(value);
    }

    /**
     * Processes an input value using list of validators.
     */
    private process(input: string): any {
        let errors = {};

        for (let item of this.validators) {
            const callback = typeof item === 'function' ? item : null,
                validator = callback || utils.valid[item],
                value = validator(input, errors);

            if (value !== null) {
                if (value !== undefined) {
                    this.validValue = value;
                }

                errors = null;

                break;
            }
            else if (!Object.keys(errors).length) {
                errors = {
                    [callback ? 'callback' : String(item)]: {
                        actualValue: input
                    }
                };
            }
        }

        return errors;
    }

    /**
     * Normalizes a value on blur event.
     */
    @HostListener('blur')
    private normalizeOnBlur() {
        const value = this.validValue,
            control = this.control;

        if (value !== undefined) {
            if (control && value !== control.value) {
                control.setValue(value);
            }
        }
    }
}

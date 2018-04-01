/**
 * Directive to provide custom validations and normalization.
 */
//TODO: reset cursor position after normalization
//TODO: validator list extension
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
    static readonly VALIDATORS = {
        'any': utils.validAny,
        'some': utils.validSome,
        'number': utils.validNumber,
        'date': utils.validDate,
        'psc': utils.validPsc,
        'rc': utils.validRc,
        'ico': utils.validIco
    };

    /**
     * List of validators to use, any text value by default.
     */
    private validators: any[] = ['any'];

    /**
     * Flag to set empty value to a pristine control.
     */
    private pristine: boolean;

    /**
     * One or more validators, or "off" for none.
     * "number", "number|any", "[callback]", "[/regexp/]", "['number', callback...]"
     */
    @Input()
    private set valid(value: any) {
        const items = Array.isArray(value) ? value :
                (typeof value === 'string' ? value.split('|') : value);

        this.validators = items.indexOf('off') > -1 ? [] : items;

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
                validator = callback || InputValidDirective.VALIDATORS[item],
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

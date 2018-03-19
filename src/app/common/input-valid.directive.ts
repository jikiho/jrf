/**
 * Directive to provide custom validations and normalization.
 */
//TODO: warning, number, integer, float, hexadecimal..., glob, regexp
import {Directive, Input, HostBinding, ElementRef, HostListener} from '@angular/core';
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
        'ignore': InputValidDirective.ignore, //no validation but normalize valid
        'text': utils.validText,
        //'filled': utils.validFilled,
        'number': utils.validNumber,
        'date': utils.validDate,
        'psc': utils.validPsc,
        'rc': utils.validRc,
        'ico': utils.validIco
    };

    static ignore(value: any, context: any): undefined {
        return context.errors = null || undefined;
    }

    /**
     * List of validators to use.
     */
    private validators: any[] = ['text'];

    /**
     * Input prop. with one or more validator name or callback, or "off" for none.
     * Single string can containe multiple names separated by "|".
     */
    @Input()
    private set valid(value: any) {
        const items = Array.isArray(value) ? value :
                (typeof value === 'string' ? value.split('|') : value);

        this.validators = items.indexOf('off') > -1 ? [] : items;
    }

    /**
     * Last valid normalized value for a control.
     */
    private validValue: string;
    private control: AbstractControl;

    constructor(private el: ElementRef) {
    }

    /**
     * Validates and normalizes a string value.
     * Ignores empty or undefined value.
     */
    validate(control: AbstractControl): ValidationErrors {
        const input = control.value,
            context = new InputValidContext();

        this.validValue = undefined;
        this.control = control;

        if (input == undefined || input === '') {
            return null;
        }

        for (let item of this.validators) {
            const validator = typeof item === 'function' ? item : InputValidDirective.VALIDATORS[item],
                value = validator(String(input), context);

            if (value !== null) {
                if (value !== undefined) {
                    this.validValue = value;
                }

                context.errors = null;

                break;
            }
            else if (!context.errors) {
                context.errors = {
                    [String(item)]: {
                        actualValue: input
                    }
                };
            }
        }

        return context.errors;
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

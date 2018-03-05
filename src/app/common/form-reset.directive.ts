/**
 * Directive to enhance a form reset functionality.
 */
import {Directive, OnInit, Input, ElementRef, HostBinding, HostListener} from '@angular/core';
import {NgForm} from '@angular/forms';

@Directive({
    selector: 'form'
})
export class FormResetDirective implements OnInit {
    /**
     * Form default value.
     */
    private defaultValue: any;

    /**
     * Flag...
     */
    private clearing: boolean = false;

    constructor(private form: NgForm, private el: ElementRef) {
        this.settleReset();
    }

    ngOnInit() {
        this.settleClear();
    }

    /**
     * Resets form value on reset event.
     */
    @HostListener('reset', ['$event'])
    resetOnEvent(event: Event) {
        event.preventDefault();

        this.form.reset(this.clearing ? undefined : this.defaultValue);

        this.clearing = false;
    }

    /**
     * Resets form element on keyboard event.
     */
    @HostListener('keyup.alt.Backspace', ['$event'])
    resetOnKeyboard(event: KeyboardEvent) {
        event.preventDefault();

        this.el.nativeElement.reset();
    }

    /**
     * Clears form element on keyboard event.
     */
    @HostListener('keyup.alt.Delete', ['$event'])
    clearOnKeyboard(event: KeyboardEvent) {
        event.preventDefault();

        this.el.nativeElement.clear();
    }

    /**
     * Initializes and handles form reset.
     * Enhances a form reset functionality to update a default value.
     */
    private settleReset() {
        const form = this.form,
            reset = form.reset;

        Object.assign(form, {
            reset: (value: any, ...args) => {
                if (!this.clearing) {
                    this.defaultValue = value;
                }

                return reset.call(form, value, ...args);
            }
        });
    }

    /**
     * Initializes and handles form clear.
     * Adds a form element clear functionality.
     */
    private settleClear() {
        this.el.nativeElement.clear = () => {
            this.clearing = true;

            this.el.nativeElement.reset();
        };
    }
}

/**
 * Directive to provide a clear form button (type=clear).
 */
@Directive({
    selector: 'form button[type=clear]'
})
export class ButtonClearDirective {
    /**
     * Makes a button standard (type=reset).
     */
    @HostBinding()
    private type = 'reset';

    constructor(private el: ElementRef) {
    }

    /**
     * Clears form element on a mouse click.
     */
    @HostListener('click', ['$event'])
    clearOnClick(event: MouseEvent) {
        event.preventDefault();

        this.el.nativeElement.form.clear();
    }
}
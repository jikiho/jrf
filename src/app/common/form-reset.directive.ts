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
     * Flag...
     */
    private clearing: boolean = false;

    constructor(private form: NgForm, private el: ElementRef) {
    }

    ngOnInit() {
        this.settleClear();
    }

    /**
     * Resets form value on reset event.
     */
    @HostListener('reset', ['$event'])
    private resetOnEvent(event: Event) {
        event.preventDefault();

        this.form.reset();

        this.clearing = false;
    }

    /**
     * Resets form element on keyboard event.
     */
    @HostListener('keyup.alt.Backspace', ['$event'])
    private resetOnKeyboard(event: KeyboardEvent) {
        event.preventDefault();

        this.el.nativeElement.reset();
    }

    /**
     * Clears form element on keyboard event.
     */
    @HostListener('keyup.alt.Delete', ['$event'])
    private clearOnKeyboard(event: KeyboardEvent) {
        event.preventDefault();

        this.el.nativeElement.clear();
    }

    /**
     * Initializes and handles form clear.
     * Adds a form element clear functionality.
     */
    private settleClear() {
        const directive = this;

        Object.defineProperty(this.el.nativeElement, 'clear', {
            value: function() {
                directive.clearing = true;

                this.reset();
            }
        });
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

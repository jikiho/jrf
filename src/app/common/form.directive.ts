/**
 * Form element enhancement.
 */
import {Directive, HostListener, forwardRef} from '@angular/core';
import {ControlContainer, NgForm, NgModelGroup} from '@angular/forms';

@Directive({
    selector: 'form'
})
export class FormDirective {
    /**
     * Form default value.
     */
    private defaultValue: any;

    /**
     * Flag...
     */
    private clearInProgress: boolean = false;

    constructor(private form: NgForm) {
    }

    /**
     * Resets a form value using the default one.
     */
    @HostListener('reset', ['$event'])
    resetOnEvent(event: Event) {
        event.preventDefault();

        this.form.reset(this.clearInProgress ? undefined : this.defaultValue);

        this.clearInProgress = false;
    }
}

/**
 * Provides a model group as the control container.
 */
@Directive({
    selector: '[provide-control]',
    providers: [
        {
            provide: ControlContainer,
            useExisting: forwardRef(() => NgModelGroup)
        }
    ]
})
export class ProvideControlDirective {
}

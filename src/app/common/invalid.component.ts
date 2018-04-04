/**
 * Component with information about an invalid control.
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'invalid-component',
    templateUrl: './invalid.component.html'
})
export class InvalidComponent {
    @Input()
    control: any;

    /**
     * Error messages.
     */
//TODO: get common/custom messages
    messages = {
        invalid: 'Položka není správně vyplněná.',
        some: 'Položka musí být vyplněná.'
    };

    @Input()
    set invalid(value: string) {
        this.messages.invalid = value;
    }

    @Input()
    set some(value: string) {
        this.messages.some = value;
    }

    /**
     * Flag to show information.
     */
    get visible(): boolean {
        return this.control && !this.control.valid && (this.control.active ||
                (this.control.form && this.control.form.submitted));
    }
}

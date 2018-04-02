/**
 * Component with information about a control errors.
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
    message = {
        invalid: 'Položka není správně vyplněná.',
        some: 'Položka musí být vyplněná.'
    };

    @Input()
    set invalid(value: string) {
        this.message.invalid = value;
    }

    @Input()
    set some(value: string) {
        this.message.some = value;
    }
}

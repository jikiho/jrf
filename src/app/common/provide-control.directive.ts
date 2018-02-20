/**
 * Directive to provide a model group as a control container.
 */
import {Directive, forwardRef} from '@angular/core';
import {ControlContainer, NgModelGroup} from '@angular/forms';

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

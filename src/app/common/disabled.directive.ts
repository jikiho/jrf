/**
 * Directive to enable resp. disable an element.
 */
import {Directive, OnChanges, Input, HostBinding} from '@angular/core';

@Directive({
    selector: '[enabled]'
})
export class DisabledDirective implements OnChanges {
    @Input() enabled: any;

    @HostBinding('attr.disabled') private disabled: boolean | null;

    ngOnChanges(changes: any) {
        this.disabled = !this.enabled || null;
    }
}

/**
 * Directive to control an element disability.
 */
import {Directive, OnChanges, Input, HostBinding} from '@angular/core';

@Directive({
    selector: '[enabled]'
})
export class EnabledDirective implements OnChanges {
    @Input()
    private enabled: any;

    @HostBinding('attr.disabled')
    private disabled: boolean | null;

    ngOnChanges(changes: any) {
        this.disabled = !this.enabled || null;
    }
}

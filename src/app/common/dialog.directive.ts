/**
 * Directive to enhance a dialog functionality.
 */
import {NgModule, Directive, Input, ElementRef, OnChanges} from '@angular/core';

@Directive({
    selector: 'dialog[modal]'
})
export class DialogDirective implements OnChanges {
    @Input()
    private visible: boolean;

    constructor(private el: ElementRef) {
    }

    ngOnChanges(changes: any) {
        if (this.visible) {
            this.el.nativeElement.showModal();
        }
        else {
            this.el.nativeElement.removeAttribute('open');
        }
    }
}

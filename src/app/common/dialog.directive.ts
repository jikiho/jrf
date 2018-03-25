/**
 * Directive to provide a dialog element.
 */
import {Directive, OnInit, ElementRef} from '@angular/core';

@Directive({
    selector: 'dialog'
})
export class DialogDirective implements OnInit {
    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this.settleToggle();
    }

    /**
     * Initializes and handles dialog toggling.
     * Adds an element functionality.
     */
    private settleToggle() {
        //this.el.nativeElement.setAttribute('modal', true);

        Object.defineProperty(this.el.nativeElement, 'toggle', {
            value: function() {
                return this.hasAttribute('open') ? this.close() : this.showModal();
            }
        });

//TODO: close before show, or check and keep open if modal
        if (!this.el.nativeElement.showModal) {
//TODO: emit open event
            Object.defineProperty(this.el.nativeElement, 'showModal', {
                value: function() {
                    this.setAttribute('open', true);

                    return this.hasAttribute('open');
                }
            });
        }

        if (!this.el.nativeElement.close) {
//TODO: emit close event, close on escape key
            Object.defineProperty(this.el.nativeElement, 'close', {
                value: function() {
                    this.removeAttribute('open');

                    return this.hasAttribute('open');
                }
            });
        }
    }
}

/**
 * Directive to control a hidden element.
 */
import {Directive, OnInit, ElementRef} from '@angular/core';

@Directive({
    selector: '[hidden]'
})
export class HiddenDirective implements OnInit {
    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this.settleToggle();
    }

    /**
     * Initializes and handles element toggling.
     * Adds an element functionality.
     */
    private settleToggle() {
        Object.defineProperty(this.el.nativeElement, 'toggle', {
            value: function() {
                return this.hasAttribute('hidden') ? this.show() : this.hide();
            }
        });

        Object.defineProperty(this.el.nativeElement, 'show', {
            value: function() {
                this.removeAttribute('hidden');

                return this.hasAttribute('hidden');
            }
        });

        Object.defineProperty(this.el.nativeElement, 'hide', {
            value: function() {
                this.setAttribute('hidden', true);

                return this.hasAttribute('hidden');
            }
        });
    }
}

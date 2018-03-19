/**
 * Directive to normalize a pasted value.
 */
import {Directive, ElementRef, Input, HostListener} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
    selector: 'input[type="text"]'
})
export class InputPasteDirective {
    constructor(private field: NgControl, private el: ElementRef) {
    }

    /**
     * Normalizes a pasted value.
     */
    @HostListener('paste', ['$event', '$event.clipboardData'])
    private trimOnPaste(event: ClipboardEvent, data?: DataTransfer) {
        const element = this.el.nativeElement,
            start = element.selectionStart,
            end = element.selectionEnd,
            text = data && data.getData('text');

        let value = element.value;

        if (text != undefined && value != undefined && value.length === end - start) {
            value = value.slice(0, start) + this.normalize(text) + value.slice(end);
            this.field.control.setValue(value);
            //event.stopPropagation();
            event.preventDefault();
        }
    }

    /**
     * Normalizes a value (just trim now).
     */
    private normalize(value: string): string {
        return value.trim();
    }
}

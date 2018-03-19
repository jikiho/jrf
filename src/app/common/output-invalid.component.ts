/**
 * Sdilena komponenta pro zobrazeni chybovych hlaseni (validace polozky formulare).
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'output-invalid',
    templateUrl: './invalid.component.html'
})
export class OutputInvalidComponent {
    /**
     * Vstupni prop. s polozkou formulare.
     */
    @Input() control: any;

    /**
     * Vstupni prop. s vlastnim textem pro nedefinovany typ kontroly.
     */
    @Input() invalid: string;

    /**
     * Vstupni prop. s vlastnim textem pro typ "required".
     */
    @Input() required: string;

    /**
     * Vstupni prop. s vlastnim textem pro typ "numeric".
     */
    @Input() numeric: string;

    /**
     * Vstupni prop. s vlastnim textem pro typ "date".
     */
    @Input() date: string;

    /**
     * Vstupni prop. s vlastnim textem pro typ "pattern".
     */
    @Input() pattern: string;

    /**
     * Vstupni prop. s vlastnim textem pro typ "like".
     */
    @Input() like: string;

    /**
     * Vstupni prop. s vlastnim textem pro typ "unlike".
     */
    @Input() unlike: string;

    /**
     * Vstupni prop. s vlastnim textem pro typ "min".
     */
    @Input() min: string;

    /**
     * Vstupni prop. s vlastnim textem pro typ "max".
     */
    @Input() max: string;
}

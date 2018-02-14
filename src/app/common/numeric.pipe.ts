/**
 * Converts a value to the corresponding number.
 * A date is treated as the number of milliseconds since midnight January 1, 1970.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'numeric'
})
export class NumericPipe implements PipeTransform {
    transform(value: any): number {
        if (typeof value === 'string') {
            return parseFloat(value);
        }

        return Number(value);
    }
}

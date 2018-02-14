/**
 * Converts a value to the corresponding boolean.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'booleric'
})
export class BoolericPipe implements PipeTransform {
    transform(value: any): boolean {
        return Boolean(value);
    }
}

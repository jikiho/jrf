/**
 * Converts an undefined value to unavailable text (n/a).
 */
import {Pipe, PipeTransform} from '@angular/core';

const UNAVAILABLE = 'n/a';

@Pipe({
    name: 'unavailable'
})
export class UnavailablePipe implements PipeTransform {
    transform(value: any): number {
        return value == undefined ? UNAVAILABLE : value;
    }
}

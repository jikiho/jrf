/**
 * Converts a value to the corresponding date.
 * A number is treated as a timestamp.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dateric'
})
export class DatericPipe implements PipeTransform {
    transform(value: any): Date {
        const timestamp = typeof value === 'number' ? value : Date.parse(value);

        return new Date(timestamp);
    }
}

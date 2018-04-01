/**
 * Converts control validation errors to text.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'invalid'
})
export class InvalidPipe implements PipeTransform {
    transform(value: any, message: any = {}): string {
        if (value) {
            for (let name of Object.keys(value)) {
                if (message[name]) {
                    return message[name];
                }
            }

            return message['invalid'];
        }
    }
}

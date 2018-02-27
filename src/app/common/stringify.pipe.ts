/**
 * Converts a value to the corresponding string.
 */
import {Pipe, PipeTransform} from '@angular/core';

import {UtilsModule as utils} from '../utils.module';

@Pipe({
    name: 'stringify'
})
export class StringifyPipe implements PipeTransform {
    transform(value: any, ...args): string {
        return utils.stringify(value, ...args);
    }
}

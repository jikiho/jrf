/**
 * Converts a value to the corresponding number.
 */
import {Pipe, PipeTransform} from '@angular/core';

import {UtilsModule as utils} from '../utils.module';

@Pipe({
    name: 'numeric'
})
export class NumericPipe implements PipeTransform {
    transform(value: any): number {
        return utils.numeric(value);
    }
}

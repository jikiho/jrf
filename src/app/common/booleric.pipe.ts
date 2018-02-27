/**
 * Converts a value to the corresponding boolean.
 */
import {Pipe, PipeTransform} from '@angular/core';

import {UtilsModule as utils} from '../utils.module';

@Pipe({
    name: 'booleric'
})
export class BoolericPipe implements PipeTransform {
    transform(value: any, ...args): boolean {
        return utils.booleric(value, ...args);
    }
}

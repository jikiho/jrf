/**
 * Converts an undefined value to unavailable text (n/a).
 */
import {Pipe, PipeTransform} from '@angular/core';

import {UtilsModule as utils} from '../utils.module';

@Pipe({
    name: 'unavailable'
})
export class UnavailablePipe implements PipeTransform {
    transform(value: any): any {
        return utils.unavailable(value);
    }
}

/**
 * Converts a value to the corresponding date.
 */
import {Pipe, PipeTransform} from '@angular/core';

import {UtilsModule as utils} from '../utils.module';

@Pipe({
    name: 'dateric'
})
export class DatericPipe implements PipeTransform {
    transform(value: any): Date {
        return utils.dateric(value);
    }
}

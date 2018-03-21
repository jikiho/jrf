/**
 * Converts address properties to a standard postal address string.
 */
import {Pipe, PipeTransform} from '@angular/core';

import {UtilsModule as utils} from '../utils.module';

@Pipe({
    name: 'postal'
})
export class PostalPipe implements PipeTransform {
    transform(value: any): string {
        return utils.postal(value);
    }
}

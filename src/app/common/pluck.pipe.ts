/*
 * Plucks property from a list.
 */
import {Pipe, PipeTransform} from '@angular/core';

import {UtilsModule as utils} from '../utils.module';

@Pipe({
    name: 'pluck'
})
export class PluckPipe implements PipeTransform {
    transform(items: any, name: string): any {
        return items ? utils.pluck(items, name) : items;
    }
}

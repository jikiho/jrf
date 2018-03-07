/**
 * Filters a list by value, or filter entries by property value.
 */
import {Pipe, PipeTransform} from '@angular/core';

import {UtilsModule as utils} from '../utils.module';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any, value: any): any {
        return items ? utils.filter(items, value) : items;
    }
}

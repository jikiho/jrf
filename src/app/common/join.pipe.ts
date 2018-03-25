/**
 * Simply joins list items into the corresponding string.
 */
//TODO: default separator
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'join'
})
export class JoinPipe implements PipeTransform {
    transform(items: any, separator?: string): any {
        return items ? items.join(separator) : items;
    }
}

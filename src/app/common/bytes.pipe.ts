/**
 * Converts number of bytes to bytes with a corresponding unit.
 */
import {Pipe, PipeTransform} from '@angular/core';

import {UtilsModule as utils} from '../utils.module';

@Pipe({
    name: 'bytes'
})
export class BytesPipe implements PipeTransform {
    transform(value: number): string {
        return utils.bytes(value);
    }
}

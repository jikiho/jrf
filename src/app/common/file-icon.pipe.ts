/**
 * Converts a value to the corresponding file type icon name.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'fileicon'
})
export class FileIconPipe implements PipeTransform {
    transform(value: string | File): string {
        if (value instanceof File) {
            value = value.type;
        }

        let icon: string;

        if (/\/pdf$/.test(value)) {
            icon = 'fa-file-pdf-o';
        }
        else if (/^image\//.test(value)) {
            icon = 'fa-file-image-o';
        }
        else if (/^audio\//.test(value)) {
            icon = 'fa-file-audio-o';
        }
        else if (/^video\//.test(value)) {
            icon = 'fa-file-video-o';
        }
        else if (/^text\//.test(value)) {
            icon = 'fa-file-text-o';
        }
        else {
            icon = 'fa-file-o';
        }

        //fa-file-word-o
        //'\f1c2'

        //fa-file-excel-o
        //'\f1c3'

        //fa-file-powerpoint-o
        //'\f1c4'

        //fa-file-archive-o
        //'\f1c6'

        //fa-file-code-o
        //'\f1c9'

        return icon || '';
    }
}

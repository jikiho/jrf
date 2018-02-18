/**
 * Utility functions (static methods).
 *
 * @example
 *      import {UtilsModule as utils} from './common/utils.module';
 */
import {NgModule} from '@angular/core';
import {MD5} from 'object-hash';
import {Observable} from 'rxjs/Rx';

@NgModule({
})
export class UtilsModule {
    /**
     * Converts a locale to the corresponding language.
     */
    static localeLang(locale: string): string {
        return locale.split('-')[0];
    }

    /**
     * Converts any value to a corresponding string.
     */
    static stringify(value: any, defaults?: string): string {
        if (value == undefined) {
            return defaults;
        }

        return typeof value === 'object' ? JSON.stringify(value) : value.toString();
    }

    /**
     * Gets a property value by its name.
     * Use dot notation string for a nested property.
     */
    static getProperty(obj: any, name: string): any {
        return name.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    /**
     * Sets a property value by its name.
     * Use dot notation string for a nested property.
     */
    static setProperty(obj: any, name: string, value?: any) {
        const parts = name.split('.');

        if (parts.length > 1) {
            name = parts.splice(-1)[0];
            obj = parts.reduce((acc, part) => acc && acc[part], obj);
        }

        if (obj && obj.hasOwnProperty(name)) {
            obj[name] = value;
        }
    }

    /**
     * Concats values into a sentence (timmed string with single spaces).
     */
    static concat(...args): string {
        return args.join(' ').trim().replace(/ +/, ' ');
    }

    /**
     * Generates a random value.
     */
    static readonly MAX_SAFE_INTEGER_32 = Math.pow(2, 32) - 1;

    static random(limit: number = 1): number {
        if (limit > Number.MAX_SAFE_INTEGER) {
            throw new Error('Random limit exceeds a safe integer maximum.');
        }

        const value = !crypto || limit > UtilsModule.MAX_SAFE_INTEGER_32 ? Math.random() :
                crypto.getRandomValues(new Uint32Array(1))[0] / UtilsModule.MAX_SAFE_INTEGER_32;

        return Math.round(value * limit);
    }

    /**
     * Generates a MD5 hash from a value (object).
     */
    static md5(value: any, options?: any) {
        return MD5(value, options);
    }

    /**
     * Converts number of bytes to file size with a corresponding unit.
     */
    static readonly BYTES_PREFIX = ['', 'K', 'M', 'G', 'T'];
    static readonly BYTES_MULTIPLE = 1024;

    static bytes(value: number): string {
        let sign = Math.sign(value),
            range = Math.abs(value),
            convert = UtilsModule.BYTES_PREFIX.length,
            prefix: string;

        for (prefix of UtilsModule.BYTES_PREFIX) {
            if (range < UtilsModule.BYTES_MULTIPLE) {
                break;
            }
            else if (convert -= 1) {
                range /= UtilsModule.BYTES_MULTIPLE;
            }
        }

        return [sign * Math.round(range * 10) / 10, `${prefix}B`].join(' ');
    }

    /**
     * Converts buffer(s) to an ascii value (base64).
     */
    static btoa(buffer: any): string {
        const bytes = new Uint8Array(buffer).reduce((bytes, byte) =>
                bytes + String.fromCharCode(byte), '');

        return window.btoa(bytes);
    }

    /**
     * Converts an ascii value (base64) to buffers.
     */
    static atob(value: string, size: number = 512): Uint8Array[] {
        const chars = window.atob(value),
            bytes: Uint8Array[] = [];

        for (let offset = 0; offset < chars.length; offset += size) {
            const slice = chars.slice(offset, offset + size),
                numbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i += 1) {
                 numbers[i] = slice.charCodeAt(i);
            }

            bytes.push(new Uint8Array(numbers));
        }

        return bytes;
    }

    /**
     * Reads a file content as an observable.
     */
//TODO: reader.abort on unsubscribe
    static read<T>(file: File, method: string = 'readAsArrayBuffer'): Observable<T> {
        return new Observable((observer) => {
            const reader = new FileReader();

            reader.onload = () => {
                observer.next(reader.result);
                observer.complete();
            };

            reader.onabort = () => {
                observer.complete();
            }

            reader.onerror = () => {
                observer.error(reader.error);
            };

            reader[method](file);
        });
    }

    /**
     * Creates a XML file.
     */
    static xmlFile(content: string, name: string = 'request.xml'): File {
        return new File([content], name, {
            type: 'text/xml'
        });
    }

    /**
     * Creates...
     */
    static formData(params?: any): FormData {
        const data = new FormData();

        Object.entries(params).forEach(([name, value]) => {
            if (value instanceof File) {
                data.append(name, <Blob>value, value.name);
            }
            else {
                data.append(name, <string>value);
            }
        });

        return data;
    }

    /**
     * Merges properties of one or more urls.
     */
    static readonly RELATIVE_ORIGIN = 'https://target';
    static readonly RELATIVE_PATHNAME = '/';

    static mergeUrl(arg, ...args): URL {
        let url = new URL(arg);

        for (arg of args) {
            const target = new URL(arg, `${UtilsModule.RELATIVE_ORIGIN}/${UtilsModule.RELATIVE_PATHNAME}`),
                relative = target.origin === UtilsModule.RELATIVE_ORIGIN &&
                        !target.pathname.indexOf(`/${UtilsModule.RELATIVE_PATHNAME}`),
                search = url.search && target.search;

            if (relative) {
                url.pathname += target.pathname.slice(1 + UtilsModule.RELATIVE_PATHNAME.length);
            }

            if (search) {
                url.search += '&' + target.search.slice(1);
            }
        }

        return url;
    }

    /**
     * Sorts an object by keys (strings).
     * Recreates the keys of an original object, use a copy to keep the original.
     */
    static sortByKeys(o: any, fn?: (a: string, b: string) => number): any {
        const keys = o ? Object.keys(o) : undefined;

        if (keys) {
            keys.sort(fn).forEach(key => {
                let value;

                if (Array.isArray(o[key])) {
                    value = o[key].sort();
                }
                else if (typeof o[key] === 'object') {
                    value = UtilsModule.sortByKeys(o[key], fn);
                }
                else {
                    value = o[key];
                }

                delete o[key];

                o[key] = value;
            });
        }

        return o;
    }
}

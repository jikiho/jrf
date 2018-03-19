/**
 * Utility functions (static methods).
 *
 * @example
 *      import {UtilsModule as utils} from './common/utils.module';
 */
import {NgModule} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {Observable} from 'rxjs/Rx';
import {MD5} from 'object-hash';
import {saveAs} from 'file-saver';

@NgModule({
})
export class UtilsModule {
    constructor() {
        Observable.fromEvent(document, 'keyup').subscribe((event: KeyboardEvent) => {
            UtilsModule.keydowns.delete(event.key);
        });
    }

    /**
     * Stops a standard event (prevents default action).
     */
    static stopEvent(event: Event) {
        //event.stopPropagation();
        event.preventDefault();
    }

    /**
     * Controls a keydown event w/out repeating.
     */
    static keydowns = new Set<string>();

    static keydown(event: KeyboardEvent, stop: boolean = true): boolean {
        const key = event.key;

        if (stop) {
            UtilsModule.stopEvent(event);
        }

        if (UtilsModule.keydowns.has(key)) {
            return false;
        }

        UtilsModule.keydowns.add(key);

        return true;
    }

    /**
     * Freezes script execution for a specific time (milliseconds).
     */
    static freeze(time: number = 0): number {
        time += Date.now();

        while (Date.now() < time);

        return time;
    }

    /**
     * Checks existance of a dirty (non-blank) argument.
     */
    static dirty(...args): boolean {
        return args.reduce((acc, part) => acc || (part ? /\S/.test(part) : false), false);
    }

    /*
     * Filters a list by value or properties.
     * Accepts dot notation string for a nested property.
     */
    static filter(items: any[], value: any): any[] {
        return typeof value !== 'object' ? items.filter((item) => item == value) :
                items.filter((item) => Object.keys(value).reduce((acc, part) => acc &&
                        UtilsModule.get(item, part) == value[part], true));
    }

    /*
     * Plucks property from a list.
     * Accepts dot notation string for a nested property.
     */
    static pluck(items: any[], name: string): any[] {
        return items.map((item) => UtilsModule.get(item, name));
    }

    /**
     * Gets a property value by its name.
     * Accepts dot notation string for a nested property.
     */
    static get(obj: any, name: string): any {
        return name.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    /**
     * Sets a property value by its name.
     * Accepts dot notation string for a nested property.
     */
    static set(obj: any, name: string, value?: any) {
        const parts = name.split('.');

        if (parts.length > 1) {
            name = parts.pop();
            obj = parts.reduce((acc, part) => acc && acc[part], obj);
        }

        if (obj && obj.hasOwnProperty(name)) {
            obj[name] = value;
        }
    }

    /**
     * Converts a value to the corresponding boolean.
     * Optional values to be inverted (e.g. '' to return true for an empty string).
     * Date is treated as validity.
     * Defined object is treated as number of properties.
     * Not-a-number is treated as false.
     */
    static booleric(value: any, ...args): boolean {
        if (args.indexOf(value) > -1) {
            return !value;
        }
        else if (value instanceof Date) {
            return !Number.isNaN(value.valueOf());
        }
        else if (value !== null && typeof value === 'object') {
            return Object.keys(value).length ? true: false;
        }
        else if (Number.isNaN(value)) {
            return false;
        }
        
        return Boolean(value);
    }

    /**
     * Converts a value to the corresponding date.
     * Number is treated as a timestamp.
     */
    static dateric(value: any): Date {
        const timestamp = typeof value === 'number' ? value : Date.parse(value);

        return new Date(timestamp);
    }

    /**
     * Converts a value to the corresponding number.
     * Date is treated as the number of milliseconds since midnight January 1, 1970.
     * Defined object is treated as number of properties.
     */
    static numeric(value: any): number {
        if (typeof value === 'string') {
            return parseFloat(value);
        }
        else if (value instanceof Date) {
            ;
        }
        else if (value !== null && typeof value === 'object') {
            return value = Object.keys(value).length;
        }

        return Number(value);
    }

    /**
     * Converts a value to the corresponding string.
     * Optional values to be an empty string (e.g. undefiend).
     */
    static stringify(value: any, ...args): string {
        if (args.indexOf(value) > -1) {
            return '';
        }

        return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }

    /**
     * Converts an undefined value to unavailable text (n/a).
     */
    static readonly UNAVAILABLE = 'n/a';

    static unavailable(value: any): any {
        return value == undefined ? UtilsModule.UNAVAILABLE : value;
    }

    /**
     * Converts a locale to the corresponding language.
     */
    static localeLang(locale: string): string {
        return locale.split('-')[0];
    }

    /**
     * Concats values into a sentence (trimmed string with single spaces).
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
    static readonly BYTES_UNIT = ['bytes', 'B'];
    static readonly BYTES_PREFIX = ['', 'k', 'M', 'G', 'T'];
    static readonly BYTES_MULTIPLE = 1000;
    //static readonly BYTES_PREFIX = ['', 'Ki', 'Mi', 'Gi', 'Ti'];
    //static readonly BYTES_MULTIPLE = 1024;

    static bytes(value: number = 0): string {
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

        return [sign * Math.round(range * 10) / 10,
                prefix + UtilsModule.BYTES_UNIT[prefix ? 1 : 0]].join(' ');
    }

    /**
     * Converts buffer to an ascii value (base64).
     */
    static btoa(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer).reduce((bytes, byte) => bytes + String.fromCharCode(byte), '');

        return window.btoa(bytes);
    }

    /**
     * Converts an ascii value (base64) to buffers.
     */
//TODO: offset progress
    static atob(value: string, size: number = 4096): Uint8Array[] {
        const chars = window.atob(value),
            buffers: Uint8Array[] = [];

        for (let offset = 0; offset < chars.length; offset += size) {
            const slice = chars.slice(offset, offset + size),
                numbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i += 1) {
                 numbers[i] = slice.charCodeAt(i);
            }

            buffers.push(new Uint8Array(numbers));
        }

        return buffers;
    }

    /**
     * Reads a file content as an observable.
     */
//TODO: reader.abort on unsubscribe
//TODO: reader.progress
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
     * Opens a file in new window (download).
     */
    static openFile(file: File, name?: string): Window {
        return window.open(URL.createObjectURL(file), name);
    }

    /**
     * Saves a file.
     */
    static saveFile(file: File, name?: string) {
        saveAs(file, name);
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
     * Creates standard form data.
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
        const url = new URL(arg);

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
            keys.sort(fn).forEach((key) => {
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

    /**
     * Value validations.
     * @see https://www.cnb.cz/cs/dohled_financni_trh/vykon_dohledu/informacni_povinnosti/algoritmy.html
     * @returns a normalized string value, or null for an invalid one.
     */

    /**
     * Simple text value.
     */
    static validText(input: string): string | null {
        const value = input.trim().replace(/\s+/g, ' ');

        return value;
    }

    /**
     * Simple date value.
     */
    static validDate(input: string): string | null {
        const value = input.trim().replace(/\s+/g, '');

//TODO
        return value;
    }

    /**
     * "Rodne cislo (rc.)"
     */
    static validRc(input: string): string | null {
        const match = input.match(/^\s*((\d{2})(\d{2})(\d{2}))\/?((\d{3})(\d)?)\s*$/),
            value = match && `${match[1]}/${match[5]}`;

        let valid = false;

        if (value) {
//TODO
            valid = true;
        }

        return valid ? value : null;
    }

    /**
     * "Identifikacni cislo osoby (ICO)"
     * @see https://cs.wikipedia.org/wiki/Identifika%C4%8Dn%C3%AD_%C4%8D%C3%ADslo_osoby
     */
    static validIco(input: string): string | null {
        const match = input.match(/^\s*(\d{8})\s*$/),
            value = match && match[1];

        let valid = false;

        if (value) {
            let n = 0,
                c: number;

            for (let i = 0; i < 7; i += 1) {
                n += parseInt(value[i]) * (8 - i);
            }

            n = n % 11;

            if (n === 0) {
                c = 1;
            }
            else if (n === 1) {
                c = 0;
            }
            else {
                c = 11 - n;
            }

            valid = parseInt(value[7]) === c;
        }

        return valid ? value : null;
    }
}

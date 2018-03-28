/**
 * Utility functions (static methods).
 *
 * @example
 *      import {UtilsModule as utils} from './common/utils.module';
 */
import {NgModule} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {ControlContainer} from '@angular/forms';
import {Observable, Subscription} from 'rxjs/Rx';
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
     * Event and process manipulation...
     */

    /**
     * Controls a set of keys (objects) being suspended.
     */
    private static _suspended = new Set<any>();

    static suspended(key: any): boolean {
        return UtilsModule._suspended.has(key);
    }

    static suspend(key: any, delay: number = -1): boolean {
        if (delay > -1) {
            setTimeout(() => UtilsModule.resume(key), delay);
        }

        return UtilsModule._suspended.has(key) ? true : !UtilsModule._suspended.add(key);
    }

    static resume(key: any): boolean {
        return UtilsModule._suspended.delete(key);
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
     * File and data manipulation...
     */

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
     * Reads a file content as a promise.
     */
//TODO: reader.abort on unsubscribe
//TODO: reader.progress
    static read<T>(file: File, method: string = 'readAsArrayBuffer'): Promise<T> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onabort = () => {
                resolve();
            }

            reader.onerror = () => {
                reject(reader.error);
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
     * Object manipulation...
     */

    /**
     * Checks if...
     */
    static objectLiteral(obj: any): boolean {
        return obj && typeof obj === 'object' && obj.constructor === 'Object';
    }

    /**
     * Patches an object content.
     */
    static patch(obj: any, ...args): any {
        return args.reduce((acc, part) => {
            const whole = false; //part === null

            for (let name of Object.keys(acc)) {
                if (!whole && !part.propertyIsEnumerable(name)) {
                    ;
                }
                else if (UtilsModule.objectLiteral(acc[name])) {
                    UtilsModule.patch(acc[name], whole ? part : part[name]);
                }
                else {
                    acc[name] = whole ? part : part[name];
                }
            }

            return acc;
        }, obj);
    }

    /**
     * Gets a pair of value property reference and name (value[name] -> property).
     * Accepts dot notation string for a nested property.
     */
    static ref(value: any, name: string): any[] {
        const parts = name.split('.');

        if (parts.length > 1) {
            name = parts.pop();

            value = parts.reduce((acc, part) => acc &&
                    acc.hasOwnProperty(part) ? acc[part] : undefined, value);
        }

        return [value, name];
    }

    /**
     * Checks an object property existance.
     */
    static has(obj: any, name: string): boolean {
        [obj, name] = UtilsModule.ref(obj, name);

        if (obj && obj.hasOwnProperty(name)) {
            return true;
        }

        return false;
    }

    /**
     * Gets an object property value by name.
     */
    static get(obj: any, name: string): any {
        [obj, name] = UtilsModule.ref(obj, name);

        if (obj && obj.hasOwnProperty(name)) {
            return obj[name];
        }
    }

    /**
     * Sets an object property value by name.
     */
//TODO: create structure
    static set(obj: any, name: string, value?: any) {
        [obj, name] = UtilsModule.ref(obj, name);

        if (obj && obj.hasOwnProperty(name)) {
            obj[name] = value;
        }
    }

    /**
     * Deletes object properties, all or one by name.
     */
    static delete(obj: any, ...args): number {
        let count: number = 0;

        for (let arg of args.length ? args : Object.keys(obj)) {
            const [ref, name] = UtilsModule.ref(obj, arg);

            if (ref && ref.hasOwnProperty(name)) {
                delete ref[name];

                count += 1;
            }
        }

        return count;
    }

    /*
     * Plucks an object property from a list of objects.
     */
    static pluck(items: any[], name: string): any[] {
        return items.map((item) => UtilsModule.get(item, name));
    }

    /*
     * Filters a list by a value or properties.
     */
    static filter(items: any[], value: any): any[] {
        return typeof value !== 'object' ? items.filter((item) => item == value) :
                items.filter((item) => Object.keys(value).reduce((acc, part) => acc &&
                        UtilsModule.get(item, part) == value[part], true));
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
     * Deep object diff, returns changed "after" object (a) properties.
     */
    static diff(a: any, b: any): null | any {
        const changes = Object.is(a, b) ? null : Object.keys(a).reduce((acc, part) => {
                if (!b[part] || typeof a[part] !== 'object') {
                    return Object.is(a[part], b[part]) ? acc : Object.assign(acc, {[part]: a[part]});
                }
                else {
                    const changes = UtilsModule.diff(a[part], b[part]);

                    return !changes || !Object.keys(changes).length ? acc :
                            Object.assign(acc, {[part]: changes});
                }
            }, {});

        return changes;
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
     * Format and conversion...
     */

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
     * Trims and replaces white spaces with a single space.
     */
    static trims(input: string): string | null {
        return String(input).trim().replace(/\s+/g, ' ');
    }

    /**
     * Converts a value to the corresponding boolean.
     * Optional values to be inverted (e.g. '' to return true for an empty string).
     * Date is treated as it's validity.
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
     * Converts number of bytes to file size with a corresponding unit.
     * @see https://en.wikipedia.org/wiki/Megabyte
     */
    static readonly BYTES_UNITS = {
        1000: ['bytes', 'kB', 'MB', 'GB', 'TB'], //upto tera
        1024: ['bytes', 'KiB', 'MiB', 'GiB', 'TiB']
    };

    static bytes(value: number = 0, binary: boolean = false): string {
        const sign = Math.sign(value),
            multiplier = binary ? 1024 : 1000,
            units = UtilsModule.BYTES_UNITS[multiplier],
            separator = ' ';

        let range = Math.abs(value),
            convert = units.length,
            unit: string;

        for (unit of units) {
            if (range < multiplier) {
                break;
            }
            else if (convert -= 1) {
                range /= multiplier;
            }
        }

        return [sign * Math.round(range * 10) / 10, unit].join(separator);
    }

    /**
     * Converts an undefined value to unavailable text (n/a).
     */
    static readonly UNAVAILABLE = 'n/a';

    static unavailable(value: any): any {
        return value == undefined ? UtilsModule.UNAVAILABLE : value;
    }

    /**
     * Converts address properties to a standard postal address string.
     */
    static postal(item: any): string {
        const {stat, psc, obec, castObce, ulice, cisloDomovni, cisloOrientacni} = item;

//TODO
        return `${ulice} ${cisloDomovni}/${cisloOrientacni}, ${psc} ${obec}, ${stat}`;
    }

    /**
     * Validation and normalization...
     */

    /**
     * Checks some defined non-blank argument.
     */
    static some(...args): boolean {
        return args.reduce((acc, part) => acc ||
                (part != undefined ? /\S/.test(part) : false), false);
    }

    /**
     * Value validations...
     * @see https://www.cnb.cz/cs/dohled_financni_trh/vykon_dohledu/informacni_povinnosti/algoritmy.html
     *
     * @returns a normalized string value, or null for an invalid one.
     */

    /**
     * Any text value.
     */
    static validAny(input: string): string {
        return UtilsModule.trims(input);
    }

    /**
     * Some non-blank text value.
     */
    static validSome(input: string): string | null {
        return UtilsModule.some(input) ? UtilsModule.trims(input) : null;
    }

    /**
     * Number value, float or integer.
     */
    static validNumber(input: string): string | null {
        const match = input.match(/^\s*(\S(.*?))\s*$/);

        let value = match && match[1],
            valid = false;

        if (value) {
            const n = Number(value);

            valid = !Number.isNaN(n);

            value = String(n);
        }

        return valid ? value : null;
    }

    /**
     * Date value.
     */
//TODO: parsing and format
    static validDate(input: string): string | null {
        const match = input.match(/^\s*(([0-3])?(\d))\. ?(([0-1])?(\d))\. ?((\d{2})?(\d{2}))?\s*$/);

        let value = match && match[1],
            valid = false;

        if (value) {
            const n = Date.parse(value);

            valid = !Number.isNaN(n);

            value = `${match[2] || '0'}${match[3]}.${match[5] || '0'}${match[6]}.${match[8] || '20'}${match[9]}`;
        }

        return valid ? value : null;
    }

    /**
     * "Postovni smerovaci cislo (PSC)".
     */
//TODO: simple validation + async. request
    static validPsc(input: string): string | null {
        const match = input.match(/^\s*(\d{3}) ?(\d{2})\s*$/);

        let value = match ? `${match[1]}${match[2]}` : '',
            valid = false;

        if (value) {
            valid = true;
        }

        return valid ? value : null;
    }

    /**
     * "Rodne cislo (rc.)".
     */
//TODO: simple + invalid but possible
    static validRc(input: string): string | null {
        const match = input.match(/^\s*((\d{2})(\d{2})(\d{2}))\/?((\d{3})(\d)?)\s*$/);

        let value = match ? `${match[1]}/${match[5]}` : '',
            valid = false;

        if (value) {
            valid = true;
        }

        return valid ? value : null;
    }

    /**
     * "Identifikacni cislo osoby (ICO)".
     * @see https://cs.wikipedia.org/wiki/Identifika%C4%8Dn%C3%AD_%C4%8D%C3%ADslo_osoby
     */
    static validIco(input: string): string | null {
        const match = input.match(/^\s*(\d{8})\s*$/);

        let value = match ? match[1] : '',
            valid = false;

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

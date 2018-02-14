/**
 * Utility functions (static methods).
 *
 * @example
 *      import {UtilsModule as utils} from './common/utils.module';
 */
import {NgModule} from '@angular/core';
import {MD5} from 'object-hash';

@NgModule({
})
export class UtilsModule {
    static RELATIVE_ORIGIN = 'https://target';
    static RELATIVE_PATHNAME = '/';

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
     * Concats values into a sentence (timmed string with single spaces).
     */
    static concat(...args): string {
        return args.join(' ').trim().replace(/ +/, ' ');
    }

    /**
     * Generates a MD5 hash from a value (object).
     */
    static md5(value: any, options?: any) {
        return MD5(value, options);
    }

    /**
     * Merges properties of one or more urls.
     */
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

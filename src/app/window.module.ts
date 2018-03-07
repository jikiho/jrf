/**
 * Window module with enhancements.
 *
 * Circular-structure-safe value to JSON conversion.
 * Window visual viewport property.
 */
import {NgModule} from '@angular/core';

/**
 * Default circular-structure-safe value to JSON conversion.
 */
Object.defineProperty(JSON, 'stringify', {
    value: (function(stringify: Function) {
        return (value: any, replacer?: any, space: number = 4) => {
            const suffix: string = ' //object reference',
                refs = new Map(),
                parents = [],
                keys = [];

            try {
                return stringify(value, replacer || function(key, value) {
                    const parent = this;

                    if (typeof value === 'object' && value) {
                        if (refs.has(value)) {
                            const ref = refs.get(value).slice(1).join(''),
                                name = value.constructor ? value.constructor.name : 'Object',
                                definition = Array.isArray(value) ? `Array(${value.length})` : name;

                            return `${ref} => ${definition}${suffix}`;
                        }

                        key = Array.isArray(parent) ? `[${key}]` : `['${key}']`;

                        if (!parents.length) {
                            ; //root
                        }
                        else if (parent === parents.slice(-1)[0]) {
                            ; //sibling
                        }
                        else {
                            while (parents.length > 1 && parent !== parents.slice(-1)[0]) {
                                parents.pop();
                                keys.pop();
                            }
                        }

                        parents.push(value);
                        keys.push(key);

                        refs.set(value, [...keys]);
                    }

                    if (value instanceof Set || value instanceof Map) {
                        //todo
                    }

                    return value;
                }, space);
            }
            catch (error) {
                throw error;
            }
            finally {
                refs.clear();
                parents.splice(0);
                keys.splice(0);
            };
        };
    })(JSON.stringify)
});

/**
 * Window visual viewport property.
 * @see https://github.com/WICG/visual-viewport
 */
if (!window.hasOwnProperty('visualViewport')) {
    Object.defineProperty(window, 'visualViewport', {
        value: (function(window: Window) {
            return {
                get width(): number {
                    return window.innerWidth;
                },
                get height(): number {
                    return window.innerHeight;
                },
                get pageTop(): number {
                    return window.pageYOffset;
                },
                get pageLeft(): number {
                    return window.pageXOffset;
                }
            };
        })(window)
    });
}

@NgModule({
})
export class WindowModule {
}

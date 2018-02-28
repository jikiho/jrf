/**
 * Window module with enhancements.
 *
 * Circular-structure-safe value to JSON conversion.
 * Map to JSON conversion.
 * Window visual viewport property.
 */
import {NgModule} from '@angular/core';

@NgModule({
})
export class WindowModule {
    /**
     * Circular-structure-safe value to JSON conversion.
     */
    static safeSringify(stringify: Function) {
        return (value: any, replacer?: any, space: number = 4) => {
            const refs = new Set();

            try {
                return stringify(value, replacer || ((key, value) => {
                    if (typeof value === 'object' && value) {
                        if (refs.has(value)) {
                            const name = value.constructor.name,
                                definition = name === 'Object' ? `${name} {...}` : `class ${name} {...}`;
                            return `${definition} //circular structure`;
                        }
                        refs.add(value);
                    }
                    return value;
                }), space);
            }
            catch (error) {
                throw error;
            }
            finally {
                refs.clear();
            }
        };
    }

    /**
     * Map to JSON conversion.
     */
    static mapToJson() {
        return function() {
            const items = {
                keys: [],
                values: []
            };

            this.forEach((value, key) => {
                items.keys.push(key);
                items.values.push(value);
            });

            return JSON.stringify(items);
        };
    }

    /**
     * Window visual viewport property.
     * @see https://github.com/WICG/visual-viewport
     */
    static windowVisualViewport(window: Window) {
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
    }

    constructor() {
        Object.defineProperty(JSON, 'stringify', {
            value: WindowModule.safeSringify(JSON.stringify)
        });

        if (!Map.prototype.hasOwnProperty('toJSON')) {
            Object.defineProperty(Map.prototype, 'toJSON', {
                value: WindowModule.mapToJson()
            });
        }

        if (!window.hasOwnProperty('visualViewport')) {
            Object.defineProperty(window, 'visualViewport', {
                value: WindowModule.windowVisualViewport(window)
            });
        }
    }
}

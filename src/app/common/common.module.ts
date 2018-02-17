/**
 * Common module with standard enhancements.
 *
 * Map to JSON conversion.
 * Circular-structure safe value to JSON conversion.
 */
import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {RouterModule as NgRouterModule} from "@angular/router";

import {BoolericPipe} from './booleric.pipe';
import {DatericPipe} from './dateric.pipe';
import {DialogDirective} from './dialog.directive';
import {DisabledDirective} from './disabled.directive';
import {FileInputDirective} from './file-input.directive';
import {FormDirective, ProvideControlDirective} from './form.directive';
import {NumericPipe} from './numeric.pipe';
import {SafeUrlPipe} from './safe-url.pipe';
import {TimestampPipe} from './timestamp.pipe';
import {UnavailablePipe} from './unavailable.pipe';

@NgModule({
    imports: [
        NgCommonModule,
        NgRouterModule
    ],
    declarations: [
        BoolericPipe,
        DatericPipe,
        DialogDirective,
        DisabledDirective,
        FileInputDirective,
        FormDirective,
        NumericPipe,
        ProvideControlDirective,
        SafeUrlPipe,
        TimestampPipe,
        UnavailablePipe
    ],
    exports: [
        BoolericPipe,
        DatericPipe,
        DialogDirective,
        DisabledDirective,
        FileInputDirective,
        FormDirective,
        NgCommonModule,
        NgRouterModule,
        NumericPipe,
        ProvideControlDirective,
        SafeUrlPipe,
        TimestampPipe,
        UnavailablePipe
    ]
})
export class CommonModule {
}

/**
 * Map to JSON conversion.
 */
Map.prototype.hasOwnProperty('toJSON') ||
        Object.defineProperty(Map.prototype, 'toJSON', {
    value: function() {
        let items = {
            keys: [],
            values: []
        };

        this.forEach((value, key) => {
            items.keys.push(key);
            items.values.push(value);
        });

        return JSON.stringify(items);
    }
});

/**
 * Circular-structure safe value to JSON conversion.
 */
JSON.stringify = ((stringify: Function) => {
    return (value: any, replacer?: any, space: number = 4) => {
        let refs = new Set();

        try {
            return stringify(value, replacer || ((key, value) => {
                if (typeof value === 'object' && value) {
                    if (refs.has(value)) {
                        let name = value.constructor.name,
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
})(JSON.stringify);

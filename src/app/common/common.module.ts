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
import {BytesPipe} from './bytes.pipe';
import {DatericPipe} from './dateric.pipe';
import {DialogDirective} from './dialog.directive';
import {EnabledDirective} from './enabled.directive';
import {FormResetDirective, ButtonClearDirective} from './form-reset.directive';
import {InputFileDirective} from './input-file.directive';
import {NumericPipe} from './numeric.pipe';
import {ProvideControlDirective} from './provide-control.directive';
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
        ButtonClearDirective,
        BytesPipe,
        DatericPipe,
        DialogDirective,
        EnabledDirective,
        FormResetDirective,
        InputFileDirective,
        NumericPipe,
        ProvideControlDirective,
        SafeUrlPipe,
        TimestampPipe,
        UnavailablePipe
    ],
    exports: [
        BoolericPipe,
        ButtonClearDirective,
        BytesPipe,
        DatericPipe,
        DialogDirective,
        EnabledDirective,
        FormResetDirective,
        InputFileDirective,
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

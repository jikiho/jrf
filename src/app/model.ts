/**
 * Common model (base).
 *
 * @example
 *      let clone = new Model(original);
 */
import {UtilsModule as utils} from './utils.module';

export class Model<T> {
    /**
     * Creates a model with an optional initial content.
     */
    constructor(...args) {
        Object.assign(this, ...args);
    }
}

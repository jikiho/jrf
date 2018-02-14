/**
 * Common model (base).
 *
 * @example
 *      let clone = new Model(original);
 */
export class Model<T> {
    /**
     * Creates a model with an optional initial content.
     */
    constructor(...args) {
        args.length && Object.assign(this, ...args);
    }

    update(...args): T {
        return args.length && Object.assign(this, ...args);
    }
}

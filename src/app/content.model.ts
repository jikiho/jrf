/**
 * Feature content model.
 */
import {BehaviorSubject} from 'rxjs/Rx';

export class ContentModel {
    /**
     * List of content entries (stream).
     */
    entries$ = new BehaviorSubject<any[]>([]);

    /**
     * Actual list of content entries.
     */
    get entries(): any[] {
        return this.entries$.getValue();
    }

    /**
     * Index of a current content entry.
     */
    index: number = -1;

    /**
     * Current content entry number, starts from 1.
     */
    get current(): number {
        return this.index + 1;
    }

    /**
     * List length.
     */
    get length(): number {
        return this.entries.length;
    }

    /**
     * Last content entry index.
     *
     * @example select the last content entry
     *      content.select(content.last);
     */
    get last(): number {
        return this.entries.length - 1;
    }

    /**
     * Current content entry.
     */
    get entry(): any { 
        return this.entries[this.index];
    }

    /**
     * Hidden entries list/value element.
     */
    hidden: boolean = false;

    /**
     * Limit of content entries number, or 0 for unlimited.
     */
    limit: number = 0;

    /**
     * List available space, or -1 for unlimited.
     */
    get free(): number {
        return this.limit ? this.limit - this.length : -1;
    }

    /**
     * Content entry model.
     */
    private modeller: any;

    constructor(model: any, limit: number = 1) {
        this.modeller = typeof model === 'function' ? model : () => ({...model});
        this.limit = limit;
        this.create();
    }

    /**
     * Toggles entries list/value visibility.
     */
    toggle() {
        this.hidden = !this.hidden;
    }

    /**
     * Assigns a content entry values.
     */
    assign(...args) {
        Object.assign(this.entry, ...args);

        return this.update();
    }

    /**
     * Creates a new current content entry.
     */
    create(...args): any {
        if (this.free) {
            const entries = this.entries,
                entry = this.modeller(...args),
                length = entries.push(entry);

            return this.update(entries, length - 1);
        }
    }

    /**
     * Removes a content entry.
     * Recalculates the new selected content entry index.
     *
     * @example determine a current entry change
     *      if (content.entry !== content.remove()) {
     *          console.log('New current content entry', content.entry);
     *      }
     */
    remove(index: number = this.index): any {
        const entries = this.entries;

        entries.splice(index, 1);

        if (!entries.length) {
            return this.create();
        }

        if (entries.length <= this.index) {
            index = entries.length - 1;
        }
        else if (index < this.index) {
            index = this.index - 1;
        }
        else {
            index = this.index;
        }

        return this.update(entries, index);
    }

    /**
     * Unselects a content entry.
     */
    unselect(): any {
        return this.update(this.entries, -1);
    }

    /**
     * Selects an existing content entry.
     */
    select(value: number = this.index): any {
        const entries = this.entries,
            index = value < 0 ? 0 : Math.min(entries.length - 1, value);

        return this.update(entries, index);
    }

    /**
     * Shifts a selected content entry index to an existing one.
     */
    shift(value: number): any {
        const entries = this.entries,
            index = Math.min(entries.length - 1, Math.max(0, this.index + value));

        return this.update(entries, index);
    }

    /**
     * Selects the previous content entry.
     */
    previous(): any {
        return this.shift(-1);
    }

    /**
     * Selects the next content entry.
     */
    next(): any {
        return this.shift(1);
    }

    /**
     * Updates content state.
     */
    private update(entries: any[] = this.entries, index: number = this.index,
            entry: any = this.entries[index]): any {
console.log("UPDATE ENTRY", entry);
        this.index = entry ? index : -1;

        if (this.index > -1) {
            this.entries[index] = entry;
        }

        this.entries$.next(entries);

        return entry;
    }
}

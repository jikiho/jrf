/**
 * Feature content model.
 */
//TODO: reset form (pristine controls) on update
import {NgForm} from '@angular/forms';
import {BehaviorSubject} from 'rxjs/Rx';

import {UtilsModule as utils} from './utils.module';

interface Constructor<T> {
    new(value?: any): T;
}

export class ContentModel<T> {
    /**
     * List of content entries.
     */
    entries: T[] = [];

    /**
     * List length.
     */
    length: number;

    /**
     * Index of a current content entry.
     */
    index: number = -1;

    /**
     * Current content entry number, starts from 1.
     */
    current: number;

    /**
     * Current content entry.
     */
    entry: T;

    /**
     * Limit of content entries number, or 0 for unlimited.
     */
    limit: number;

    /**
     * Number of "free" entries, or -1 for unlimited.
     */
    free: number;

    /**
     * Single entry content.
     */
    single: boolean;

    /**
     * Content entry model class.
     */
    //private Model: T;

    constructor(private Model: Constructor<T>, limit: number = 1) {
        this.limit = limit;
        this.free = this.limit ? this.limit : -1;
        this.single = this.limit === 1;

        if (!this.entries || !this.entries.length) {
            this.addEntry();
        }
    }

    /**
     * Creates new content.
     */
    create(value?: any): T {
        const values = Array.isArray(value) ? value : [value],
            entries = values.map((value) => new this.Model(value));

        this.entries = entries;

        return this.selectEntry(0);
    }

    /**
     * Adds a new current content entry.
     */
    add(value?: any): T {
        return this.addEntry(value);
    }

    /**
     * Removes a content entry.
     *
     * @example determine a current entry change
     *      if (content.entry !== content.remove()) {
     *          console.log('New current content entry', content.entry);
     *      }
     */
    remove(index?: number): T {
        return this.removeEntry(index);
    }

    /**
     * Selects a content entry...
     */
    select(index?: number): T {
        return this.selectEntry(index);
    }

    first(): T {
        return this.select(0);
    }

    last(): T {
        return this.select(this.length - 1);
    }

    previous(): T {
        return this.selectNthEntry(-1);
    }

    next() {
        return this.selectNthEntry(1);
    }

    /**
     * Adds a new current content entry.
     */
    private addEntry(value?: any): T {
        if (this.free) {
            const entries = this.entries,
                entry = new this.Model(value),
                length = entries.push(entry);

            return this.update(entries, length - 1);
        }
    }

    /**
     * Removes a content entry.
     * Recalculates the new selected content entry index.
     */
    private removeEntry(index: number = this.index): T {
        const entries = this.entries,
            removed = entries.splice(index, 1);

        if (this.limit) {
            this.free += removed.length;
        }

        if (!entries.length) {
            return this.addEntry();
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
    private unselectEntry(): T {
        return this.update(this.entries, -1);
    }

    /**
     * Selects an existing content entry.
     */
    private selectEntry(value: number = this.index): T {
        const entries = this.entries,
            index = value < 0 ? 0 : Math.min(entries.length - 1, value);

        return this.update(entries, index);
    }

    /**
     * Selects N-th next or previous existing content entry.
     */
    private selectNthEntry(value: number = 1): T {
        const entries = this.entries,
            index = Math.min(entries.length - 1, Math.max(0, this.index + value));

        return this.update(entries, index);
    }

    /**
     * Updates content state.
     */
    private update(entries: T[] = this.entries, index: number = this.index,
            entry: T = entries[index]): T {
        if (index > -1) {
            entries[index] = entry;
        }

        this.length = entries.length;
        this.free = this.limit ? this.limit - this.length : -1;
        this.index = entry ? index : -1;
        this.current = this.index + 1;
        this.entry = entries[this.index];

        return entry;
    }
}

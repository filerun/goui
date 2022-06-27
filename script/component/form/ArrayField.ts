import {Config, ObservableListenerOpts} from "../Observable.js";
import {Field, FieldEventMap} from "./Field.js";
import {ContainerField} from "./ContainerField.js";
import {Collection} from "../../util/Collection.js";
import {Component} from "../Component.js";


/**
 * @inheritDoc
 */
type ArrayFieldConfig = {
	/**
	 * Function that returns a new form field for an array item
	 */
	itemComponent: ItemComponent

} & Config<ArrayField>

type ItemComponent = (value?: Record<string, any>) => Field;
type ArrayFieldValue = Record<string, any>[];

export interface ArrayField {
	get items(): Collection<Field>;

	// on<K extends keyof FieldEventMap<this>>(eventName: K, listener: Partial<FieldEventMap<this>>[K], options?: ObservableListenerOpts): void
	//
	// fire<K extends keyof FieldEventMap<this>>(eventName: K, ...args: Parameters<FieldEventMap<this>[K]>): boolean
}

/**
 * Field to return an array with objects
 *
 * @see Form
 */
export class ArrayField extends ContainerField {

	get tagName() {
		return "div" as keyof HTMLElementTagNameMap;
	}

	/**
	 *
	 * @param itemComponent Function that returns a new form field for an array item
	 */
	constructor(public itemComponent: ItemComponent) {
		super();
	}

	set value(v: ArrayFieldValue) {
		super.value = v;

		this.items.clear();

		v.forEach((item) => {
			const field = this.itemComponent(item);
			field.value = item;
			this.items.add(field);
		});
	}

	getValue(): ArrayFieldValue {

		const v: ArrayFieldValue = [];

		this.items.forEach((item) => {
			v.push(item.value);
		});

		return v;
	}


}


/**
 * Shorthand function to create {@see ArrayField}
 *
 * @param config
 * @param items
 */
export const arrayfield = (config: ArrayFieldConfig, ...items: Field[]) => {
	const f = new ArrayField(config.itemComponent);
	Object.assign(f, config);
	f.items.add(...items);
	return f;
}